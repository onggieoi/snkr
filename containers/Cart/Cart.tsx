import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { openModal } from '@redq/reuse-modal';
import _ from "lodash";

import { CartContext } from 'contexts/cart/cart.context';
import {
  CartPopupBody,
  PopupHeader,
  PopupItemCount,
  CloseButton,
  ItemCards,
  ItemImgWrapper,
  ItemDetails,
  ItemTitle,
  ItemPrice,
  ItemWeight,
  TotalPrice,
  PromoCode,
  DeleteButton,
  CheckoutButtonWrapper,
  CheckoutButton,
  Title,
  PriceBox,
  NoProductMsg,
  ItemWrapper,
  CouponBoxWrapper,
  CouponCode,
  ErrorMsg,
} from './CartItemCard.style';
import { CloseIcon } from 'components/AllSvgIcon';
import { ShoppingBagLarge } from 'components/AllSvgIcon';
import InputNumber from 'components/InputIncDec/InputIncDec';
import { calculateItemPrice } from 'helper/utility';
import { CURRENCY } from 'helper/constant';
import { FormattedMessage } from 'react-intl';

import CouponBox from 'components/CouponBox/CouponBox';

import { Scrollbars } from 'react-custom-scrollbars';
import { Product, ProductCart } from 'models/product';
import { AuthContext } from 'contexts/auth/auth.context';
import AuthenticationForm from 'containers/SignInOutForm/Form';
import { useAppDispatch } from 'helper/hooks';
import { getCoupon, getCoupons } from 'redux/coupon/couponReducer';
import { Coupon } from 'models/order';

type CartItemProps = {
  product: ProductCart;
  update: Function;
};

type CartPropsType = {
  scrollbarHeight?: string;
  onCloseBtnClick?: (e: any) => void;
};

const CartItem: React.FC<CartItemProps> = ({ product, update }) => {
  const itemPrice = calculateItemPrice(product);
  return (
    <ItemCards key={product.id}>
      <InputNumber
        type='vertical'
        value={product.quantity}
        onUpdate={(value: number) => update(product.id, value)}
        style={{ marginRight: 15 }}
      />

      <ItemImgWrapper>
        <img
          className='ListImage'
          src={product.image}
          height='150'
          width='150'
        />
      </ItemImgWrapper>

      <ItemDetails>
        <ItemTitle>{product.title}</ItemTitle>
        <ItemPrice>
          {CURRENCY}
          {product.salePrice ? product.salePrice : product.price}
        </ItemPrice>
        <ItemWeight>
          {product.quantity ? product.quantity : 1} x{' '}
          {product.unit ? product.unit : ''}
        </ItemWeight>
      </ItemDetails>
      <TotalPrice>
        {CURRENCY}
        {itemPrice}
      </TotalPrice>

      <DeleteButton onClick={() => update(product.id, 0)}>
        <CloseIcon />
      </DeleteButton>
    </ItemCards>
  );
};
// For showing demo only -Ends here ... delete this codes when you work on functin code and comment out bellow codes

const Cart: React.FC<CartPropsType> = ({
  onCloseBtnClick,
  scrollbarHeight,
}) => {
  const { products, totalPrice, update, addCoupon, coupon } = useContext(
    CartContext
  );
  const [couponText, setCoupon] = useState('');
  const [displayCoupon, showCoupon] = useState(false);
  const [error, setError] = useState('');

  const { authState, authDispatch } = useContext<any>(AuthContext);

  const reduxDispatch = useAppDispatch();

  const handleApplyCoupon = () => {
    reduxDispatch(getCoupon({
      request: couponText,
      callback,
    }));
  };

  const callback = (applyCoupon: Coupon) => {
    if (applyCoupon && applyCoupon.discount) {

      setError('');
      addCoupon(applyCoupon);
      setCoupon('');
    } else {
      setError('Invalid Coupon');
    }
  }

  const handleChange = (value: string) => {
    setCoupon(value);
  };

  const toggleCoupon = () => {
    showCoupon(true);
  };

  const signInOutForm = () => {
    authDispatch({
      type: 'SIGNIN',
    });

    openModal({
      show: true,
      overlayClassName: 'quick-view-overlay',
      closeOnClickOutside: true,
      component: AuthenticationForm,
      closeComponent: '',
      config: {
        enableResizing: false,
        disableDragging: true,
        className: 'quick-view-modal',
        width: 458,
        height: 'auto',
      },
    });
  };

  return (
    <CartPopupBody>
      <PopupHeader>
        <PopupItemCount>
          <ShoppingBagLarge width='19px' height='24px' />
          <span>
            {products && products.length}{' '}
            {products.length > 1 ? (
              <FormattedMessage id='cartItems' defaultMessage='items' />
            ) : (
              <FormattedMessage id='cartItem' defaultMessage='item' />
            )}
          </span>
        </PopupItemCount>

        <CloseButton onClick={onCloseBtnClick}>
          <CloseIcon />
        </CloseButton>
      </PopupHeader>

      <Scrollbars universal autoHide autoHeight autoHeightMax={scrollbarHeight}>
        <ItemWrapper>
          {products && products.length ? (
            products.map(item => (
              <CartItem
                key={`cartItem-${item.id}`}
                update={update}
                product={item}
              />
            ))
          ) : (
            <NoProductMsg>
              <FormattedMessage
                id='noProductFound'
                defaultMessage='No products found'
              />
            </NoProductMsg>
          )}
        </ItemWrapper>
      </Scrollbars>

      <CheckoutButtonWrapper>
        <PromoCode>
          {!coupon.discount ? (
            <>
              {!displayCoupon ? (
                <button onClick={toggleCoupon}>
                  <FormattedMessage
                    id='specialCode'
                    defaultMessage='Have a special code?'
                  />
                </button>
              ) : (
                <CouponBoxWrapper>
                  <CouponBox
                    onUpdate={handleChange}
                    value={couponText}
                    onClick={handleApplyCoupon}
                    disabled={!couponText.length || !products.length}
                    buttonTitle='Apply'
                    intlCouponBoxPlaceholder='couponPlaceholder'
                    style={{
                      boxShadow: '0 3px 6px rgba(0, 0, 0, 0.06)',
                    }}
                  />
                  {_ ? <ErrorMsg>{error}</ErrorMsg> : ''}
                </CouponBoxWrapper>
              )}
            </>
          ) : (
            <CouponCode>
              <FormattedMessage
                id='couponApplied'
                defaultMessage='Coupon Applied'
              />
              <span>{coupon.code}</span>
            </CouponCode>
          )}
        </PromoCode>

        {products.length !== 0 && authState.isAuthenticated ? (
          <Link href='/checkout'>
            <CheckoutButton onClick={onCloseBtnClick}>
              <>
                <Title>
                  <FormattedMessage
                    id='navlinkCheckout'
                    defaultMessage='Checkout'
                  />
                </Title>
                <PriceBox>
                  {CURRENCY}
                  {parseFloat(`${totalPrice}`).toFixed(2)}
                </PriceBox>
              </>
            </CheckoutButton>
          </Link>
        ) : (
          <CheckoutButton onClick={signInOutForm}>
            <>
              <Title>
                <FormattedMessage
                  id='navlinkCheckout'
                  defaultMessage='Checkout'
                />
              </Title>
              <PriceBox>
                {CURRENCY}
                {parseFloat(`${totalPrice}`).toFixed(2)}
              </PriceBox>
            </>
          </CheckoutButton>
        )}
      </CheckoutButtonWrapper>
    </CartPopupBody>
  );
};

export default Cart;

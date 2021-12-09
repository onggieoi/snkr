import React, { useContext, useEffect } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { Modal } from "@redq/reuse-modal";
import Checkout from "containers/Checkout/Checkout";

import { ProfileProvider } from "contexts/profile/profile.provider";
import { useAppDispatch, useAppSelector } from "helper/hooks";
import { getMe } from "redux/account/accountReducer";
import { AuthContext } from "contexts/auth/auth.context";
import { useRouter } from "next/router";
import InlineLoader from "components/InlineLoader";

type Props = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
const CheckoutPage: NextPage<Props> = ({ deviceType }) => {
  const router = useRouter();

  const { authState } = useContext<any>(AuthContext);

  const { me, loading } = useAppSelector(state => state.accountReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, []);

  if (loading && !me) {
    return <div>loading...</div>;
  }

  if (!authState.isAuthenticated) {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Checkout - SNKR</title>
      </Head>

      {loading && <InlineLoader />}
      
      <ProfileProvider initData={me}>
        <Modal>
          {me &&
            <Checkout token={true} deviceType={deviceType} />
          }
        </Modal>
      </ProfileProvider>
    </>
  );
};

export default CheckoutPage;

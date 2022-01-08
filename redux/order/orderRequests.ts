import { AxiosResponse } from "axios";

import { endpoints } from "constants/endpoints";
import axiosRequest from "services/axiosRequest";
import { OrderRequest } from "./orderReducer";
import { Order } from "models/order";
import _ from "lodash";

export function createOrderRequest(request: OrderRequest): Promise<AxiosResponse<Order>> {
  if (_.isUndefined(request.couponId) || _.isNull(request.couponId) || _.isEmpty(request.couponId)) {
    delete request.couponId;
  };

  return axiosRequest.axios.post(endpoints.order, request);
}

export function getOrderDetail(orderId: string): Promise<AxiosResponse<Order>> {
  return axiosRequest.axios.get(endpoints.getOrderDetail(orderId));
}

"use client";

import React from "react";
import { RootViews } from "./views/RootViews";
import "react-toastify/dist/ReactToastify.css";
import "@adyen/adyen-web/styles/adyen.css";
import "./sections/payment/PaymentSection/AdyenDropIn/adyenDropin.css";

export const Root = () => {
	return <RootViews />;
};

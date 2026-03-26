"use client";

import useSWR from "swr";
import { getProvinces } from "@services/address.service";

const useProvinces = () => {
	return useSWR("/api/data", getProvinces);
};

export { useProvinces };

"use server";

import { getLocale } from "next-intl/server";

import { parseRegion } from "./utils";
import type { Region } from "@/regions/types";

export const getCurrentRegion = async (): Promise<Readonly<Region>> => {
	const locale = await getLocale();

	return parseRegion(locale);
};

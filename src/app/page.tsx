import { redirect } from "next/navigation";
import { DEFAULT_CHANNEL_SLUG } from "@/constants";

export default async function EmptyPage() {
	redirect(DEFAULT_CHANNEL_SLUG);
}

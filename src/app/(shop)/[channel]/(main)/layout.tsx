import { type ReactNode } from "react";

export const metadata = {
	title: "Bán hàng chất lượng",
	description: "Đây là trang web bán hàng siêu rẻ"
};

export default function RootLayout(props: { children: ReactNode; params: { channel: string } }) {
	return <>{props.children}</>;
}

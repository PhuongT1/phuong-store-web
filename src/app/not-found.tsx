import { Compass } from "lucide-react";
import { AuthLayout } from "@components/layouts/auth-layout";
import { LinkWithChannel } from "@components/navigation";

const NotFound = () => (
	<AuthLayout>
		<div className="flex w-full max-w-md flex-col items-center text-center">
			{/* Icon — circular with info glow */}
			<div className="relative mb-4 flex h-20 w-20 items-center justify-center">
				{/* outer glow ring */}
				<div className="bg-info/10 border-info/30 absolute inset-0 rounded-full border-2" />
				{/* inner circle */}
				<div className="bg-info/15 flex h-14 w-14 items-center justify-center rounded-full">
					<Compass className="text-info h-7 w-7" strokeWidth={1.25} />
				</div>
			</div>

			{/* 404 big number */}
			<span className="text-destructive/25 text-[7rem] leading-none font-black tracking-tighter select-none">
				404
			</span>

			<h1 className="text-foreground mt-2 text-2xl font-bold">Không tìm thấy trang</h1>
			<p className="text-muted-foreground mt-3 text-sm leading-relaxed">
				Trang bạn đang tìm không tồn tại, đã bị di chuyển hoặc địa chỉ URL không đúng.
			</p>

			<div className="mt-8 w-full">
				<LinkWithChannel
					href="/"
					className="bg-primary text-primary-foreground hover:bg-primary/85 flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-colors"
				>
					Về trang chủ
				</LinkWithChannel>
			</div>
		</div>
	</AuthLayout>
);

export default NotFound;

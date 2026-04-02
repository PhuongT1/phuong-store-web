import Link from "next/link";

const NotFound = () => (
	<div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
		<h1 className="text-9xl font-black text-muted">404</h1>
		<h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Không tìm thấy trang</h2>
		<p className="mt-4 max-w-lg text-base text-muted-foreground">
			Có vẻ như trang bạn đang cố gắng truy cập không tồn tại, đã bị di chuyển hoặc địa chỉ URL không đúng.
		</p>
		<div className="mt-10">
			<Link
				href="/"
				className="bg-primary hover:bg-primary/90 focus-visible:outline-primary rounded-lg px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
			>
				Về trang chủ
			</Link>
		</div>
	</div>
);

export default NotFound;

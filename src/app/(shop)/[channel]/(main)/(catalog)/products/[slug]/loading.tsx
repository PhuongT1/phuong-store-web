import { MainProductLayout } from "@/components/layouts";
import { ProductRatingSkeleton } from "@components/skeleton";
import { ProductSwiperSkeleton } from "./skeleton/ProductSwiperSkeleton";
import { SidebarSkeleton } from "./skeleton/SidebarSkeleton";

const Loading = () => {
	return (
		<>
			<MainProductLayout isBg={false}>
				<div className="detail-grid">
					<div className="detail-content flex flex-col gap-3">
						<ProductSwiperSkeleton />
					</div>
					<div className="detail-sidebar flex flex-col gap-7">
						<SidebarSkeleton />
					</div>
				</div>
			</MainProductLayout>
			<MainProductLayout containerClassName="sm:p-3 p-0">
				<ProductRatingSkeleton />
			</MainProductLayout>
		</>
	);
};
export default Loading;

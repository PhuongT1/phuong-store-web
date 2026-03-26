import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import { HeartIcon, CircleCheckIcon } from "lucide-react";
import { StarIcon } from "@assets/icons";
import { type Rating } from "@/types";
import { Divider } from "@/checkout/components";

type RatingListProps = {
	data: Rating[];
};

const ProductReviewList = ({ data }: RatingListProps) => {
	if (!data) return <></>;
	const timeZone = "Asia/Ho_Chi_Minh";

	return (
		<div className="my-8">
			{data.map((item, index) => {
				const zonedDate = formatInTimeZone(item.createdAt, timeZone, "yyyy-MM-dd HH:mm:ss");
				const relativeTime = formatDistanceToNow(zonedDate, { addSuffix: true, locale: vi });

				return (
					<div key={index} className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<p className="font-bold">{item.name}</p>
							<p className="flex items-center gap-1 text-xs text-green-700">
								<CircleCheckIcon size={12} className="stroke-green-700" />
								Đã mua hàng
							</p>
						</div>
						<p className="flex items-center gap-2 ">
							{item.rating && (
								<span className="flex items-center">
									{Array.from({ length: item.rating }, (_, index) => (
										<StarIcon key={index} />
									))}
								</span>
							)}
							{item.isRecomment && (
								<span className="mt-[2px] flex items-center gap-1 text-xs text-gray-500">
									<HeartIcon size={12} className="fill-red-500 stroke-red-500" />
									Sẽ giới thiệu cho bạn bè, người thân
								</span>
							)}
						</p>
						<p className="text-sm">{item.shareFeelings}</p>
						<p className="text-xs text-gray-500">{relativeTime}</p>
						<Divider className="my-2" />
					</div>
				);
			})}
		</div>
	);
};

export { ProductReviewList };

import { StarIcon } from "@assets/icons";
import { formatDistanceToNow } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import { HeartIcon, CircleCheckIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Separator } from "@components/ui";
import { type Rating } from "@/types";

const dateFnsLocales = { vi, en: enUS } as const;

type RatingListProps = {
	data: Rating[];
};

const ProductReviewList = ({ data }: RatingListProps) => {
	const t = useTranslations("rating");
	const locale = useLocale();
	if (!data) return <></>;
	const timeZone = "Asia/Ho_Chi_Minh";
	const dateFnsLocale = dateFnsLocales[locale] ?? enUS;

	return (
		<div className="my-8">
			{data.map((item, index) => {
				const zonedDate = formatInTimeZone(item.createdAt, timeZone, "yyyy-MM-dd HH:mm:ss");
				const relativeTime = formatDistanceToNow(zonedDate, { addSuffix: true, locale: dateFnsLocale });

				return (
					<div key={index} className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<p className="font-bold">{item.name}</p>
							<p className="flex items-center gap-1 text-xs text-success">
								<CircleCheckIcon size={12} className="stroke-success" />
								{t("verified")}
							</p>
						</div>
						<p className="flex items-center gap-2">
							{item.rating && (
								<span className="flex items-center">
									{Array.from({ length: item.rating }, (_, index) => (
										<StarIcon key={index} />
									))}
								</span>
							)}
							{item.isRecomment && (
								<span className="text-muted-foreground mt-[2px] flex items-center gap-1 text-xs">
									<HeartIcon size={12} className="fill-badge-recommended stroke-badge-recommended" />
									{t("recommend")}
								</span>
							)}
						</p>
						<p className="text-sm">{item.shareFeelings}</p>
						<p className="text-muted-foreground text-xs">{relativeTime}</p>
						<Separator className="my-2" />
					</div>
				);
			})}
		</div>
	);
};

export { ProductReviewList };

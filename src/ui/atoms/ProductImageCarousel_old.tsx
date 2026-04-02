"use client";

import { clsx } from "clsx";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import Slider, { type Settings } from "react-slick";
import "react-medium-image-zoom/dist/styles.css";
import { ImageItem } from "@components/ui";

interface ProductImageCarouselProps {
	images: {
		url: string;
		alt: string;
		id: string;
	}[];
	customPaging?: Settings;
	className?: string;
}

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
	<button onClick={onClick} className="slick-arrow slick-next before:!content-['']">
		<ChevronRight size={44} className=" text-neutral-300" />
	</button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
	<button onClick={onClick} className="slick-arrow slick-prev before:!content-['']">
		<ChevronLeft size={44} className=" text-neutral-300" />
	</button>
);

function ProductImageCarousel({ images, customPaging, className }: ProductImageCarouselProps) {
	const settings: Settings = {
		customPaging: function (i: number) {
			return (
				<a>
					<ImageItem width={200} height={200} alt={images[i].alt} src={images[i].url} />
				</a>
			);
		},
		dots: true,
		dotsClass: "slick-dots slick-thumb custom-thumb !flex py-1 overflow-x-auto gap-1",
		infinite: true,
		speed: 500,
		autoplaySpeed: 5000,
		autoplay: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		focusOnSelect: true,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
		...customPaging
	};

	return (
		<div
			className={clsx(
				"[&_.slick-arrow]:z-[1] [&_.slick-next]:right-[32px] [&_.slick-prev]:left-[4px]",
				"[&_.custom-thumb_li_a_img]:outline [&_.custom-thumb_li_a_img]:outline-1 [&_.custom-thumb_li_a_img]:outline-gray-300 [&_li.slick-active_a_img]:outline-gray-900",
				"[&_.custom-thumb_.slick-active_a_img]:shadow-lg [&_.custom-thumb_.slick-active_a_img]:shadow-gray-500/50",
				className
			)}
		>
			{/* <Slider
				{...settings}
				className={clsx(
					`[&_.slick-dots.slick-thumb.custom-thumb]:bottom-[-70px]`,
					`[&_.slick-dots.slick-thumb.custom-thumb_li]:h-[60px] [&_.slick-dots.slick-thumb.custom-thumb_li]:w-[60px]`,
					`[&_.slick-dots.slick-thumb.custom-thumb_li_img]:h-[55px] [&_.slick-dots.slick-thumb.custom-thumb_li_img]:rounded-[6px] [&_.slick-dots.slick-thumb.custom-thumb_li_img]:object-cover`
				)}
			>
				{images.map((image) => (
					<div key={image.id}>
						<Zoom>
							<ImageItem
								className="h-[390px] w-full rounded-md object-cover object-center"
								width={500}
								height={390}
								alt={image.alt}
								src={image.url}
							/>
						</Zoom>
					</div>
				))}
			</Slider> */}
		</div>
	);
}

export { ProductImageCarousel };

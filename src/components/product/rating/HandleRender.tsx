import React from "react";
import { StarHalfIcon,StarIcon, StarOutlineIcon } from "@assets/icons";
import { type SvgComponentProps } from "@/types";

type StarTypeValue = `${StarType}`;

enum StarType {
	Full = "full",
	Half = "half",
	Outline = "outline"
}

const getStars = (rating: number, maxStars = 5) => {
	const stars: StarType[] = [];
	for (let i = 0; i < maxStars; i++) {
		if (i < Math.floor(rating)) {
			stars.push(StarType.Full); // Full star
		} else if (i < Math.ceil(rating) && rating % 1 >= 0.5) {
			stars.push(StarType.Half); // Half star
		} else {
			stars.push(StarType.Outline); // Outline star
		}
	}
	return stars;
};

const Star = (type: StarTypeValue, starProps?: SvgComponentProps) => {
	const iconsMap = {
		[StarType.Full]: StarIcon,
		[StarType.Half]: StarHalfIcon,
		[StarType.Outline]: StarOutlineIcon
	};

	const IconComponent = iconsMap[type];

	return IconComponent ? <IconComponent {...starProps} /> : null;
};

export { getStars, Star };

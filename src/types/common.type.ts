import { type ComponentProps } from "react";

type Option<TValue = unknown> = {
	label?: React.ReactNode;
	value?: TValue;
	disabled?: boolean;
	icon?: React.ReactNode;
};
interface OptionList<T extends Option = Option> {
	options?: T[];
}
type PageInfo<T = unknown> = {
	pageInfo: {
		endCursor: T;
		first: number;
		hasNextPage?: boolean;
	};
};
type _TupleOf<T, K extends number, R extends unknown[]> = R["length"] extends K
	? R
	: _TupleOf<T, K, [T, ...R]>;
type PropsArray<T, K extends number> = K extends 1 ? T : _TupleOf<T, K, []>;
type SvgComponentProps<K extends number = 1> = {
	svgProps?: ComponentProps<"svg">;
	pathProps?: PropsArray<ComponentProps<"path">, K>;
	rectProps?: PropsArray<ComponentProps<"rect">, K>;
	circleProps?: PropsArray<ComponentProps<"circle">, K>;
	gProps?: PropsArray<ComponentProps<"g">, K>;
	lineProps?: PropsArray<ComponentProps<"line">, K>;
};
type PaginatedData<T = unknown> = {
	data: T[];
} & PageInfo;
type GraphQLError = {
	code: string;
	field: string;
	message: string;
};

export {
	type Option,
	type OptionList,
	type PageInfo,
	type SvgComponentProps,
	type PaginatedData,
	type GraphQLError
};

"use client";

import clsx from "clsx";
import { type HTMLAttributes } from "react";
import { useField } from "formik";
import { type Children, type Classes } from "@/checkout/lib/globalTypes";
import { useFormContext } from "@/checkout/hooks/useForm";

export interface SelectBoxProps<TFieldName extends string>
	extends Classes, Children, Omit<HTMLAttributes<HTMLInputElement>, "children"> {
	disabled?: boolean;
	name: TFieldName;
	value: string;
}

export const SelectBox = <TFieldName extends string>({
	children,
	className,
	disabled = false,
	name,
	value
}: SelectBoxProps<TFieldName>) => {
	const { values, handleChange } = useFormContext<Record<TFieldName, string>>();
	const [field] = useField(name);
	const selected = values[name] === value;

	return (
		<label
			className={clsx(
				"relative mb-3 flex cursor-pointer flex-row items-start justify-start rounded-xl border-2 p-4 transition-all duration-200 ease-in-out",
				"hover:border-blue-500/50 hover:bg-gray-50/50 hover:shadow-md",
				{
					"border-blue-600 bg-blue-50/30": selected,
					"border-gray-200 bg-white": !selected,
					"pointer-events-none opacity-50": disabled
				},
				className
			)}
		>
			<input
				type="radio"
				{...field}
				onChange={handleChange}
				value={value}
				checked={selected}
				className={clsx(
					"focus:ring-opacity-50 mt-1 h-5 w-5 rounded-full border-gray-300 text-blue-600 shadow-sm transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-offset-0",
					{ "border-blue-600": selected }
				)}
			/>
			<span className="ml-4 block w-full">{children}</span>
		</label>
	);
};

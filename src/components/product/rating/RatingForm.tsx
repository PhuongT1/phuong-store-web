"use client";

import { useContext, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageItem, FieldWrapper, Textarea } from "@ui";
import { FormProvider } from "@ui/form";
import { FormInput } from "@ui/input";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ratingFields } from "@/constants";
import { useMuteProduct } from "@/hooks/useRatingProduct";
import { type ProductItem } from "@/lib/utils";
import { type RatingFrom } from "@/types";
import { Star, getStars } from "./HandleRender";
import { ProductContext } from "./ProductContext";

type RatingFormProps = {
	onSuccess?: () => void;
} & Partial<ProductItem>;

const RatingForm = ({ onSuccess, product: productDetail }: RatingFormProps) => {
	const t = useTranslations("rating");
	const productContext = useContext(ProductContext);
	const product = productDetail ?? productContext.product;

	const ratingSchema = useMemo(
		() =>
			z.object({
				rating: z.number().min(1, t("pleaseRate")),
				name: z.string().nonempty(t("pleaseEnter", { field: ratingFields["name"] })),
				shareFeelings: z.string().optional(),
				email: z.string().optional(),
				phoneNumber: z.string().nonempty(t("pleaseEnter", { field: ratingFields["phoneNumber"] })),
				refProduct: z.string().optional()
			}),
		[t]
	);

	const { trigger } = useMuteProduct();
	const method = useForm<RatingFrom>({
		mode: "onTouched",
		resolver: zodResolver(ratingSchema),
		defaultValues: {
			rating: 0,
			name: "",
			shareFeelings: "",
			email: "",
			phoneNumber: "",
			refProduct: ""
		}
	});

	const {
		handleSubmit,
		watch,
		setValue,
		formState: { errors }
	} = method;
	const rating = watch("rating");

	const onSubmit = async (values: RatingFrom) => {
		try {
			await trigger({ ...values, refProduct: product?.id || "" });
			onSuccess?.();
			method.reset();
		} catch {}
	};

	const form = () => (
		<FormProvider methods={method} formProps={{ onSubmit: handleSubmit(onSubmit) }}>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-center gap-3">
					<ImageItem src={product?.thumbnail?.url || ""} />
					<h3>{product?.name}</h3>
					<FieldWrapper error={errors.rating?.message} className="items-center">
						<div className="flex gap-2">
							{getStars(rating).map((item, index) => (
								<div className="cursor-pointer" key={index} onClick={() => setValue("rating", index + 1)}>
									{Star(item, {
										svgProps: {
											width: 50,
											height: 50
										}
									})}
								</div>
							))}
						</div>
					</FieldWrapper>
					<div className="flex w-full gap-2">
						<FormInput
							name="name"
							inputProps={{
								placeholder: ratingFields["name"],
								required: true
							}}
						/>
						<FormInput
							name="phoneNumber"
							inputProps={{
								placeholder: ratingFields["phoneNumber"],
								required: true
							}}
						/>
					</div>
				</div>
				<Textarea {...method.register("shareFeelings")} placeholder={t("placeholder")} />
			</div>
		</FormProvider>
	);

	return { form, method, submit: handleSubmit(onSubmit) };
};

export { RatingForm };

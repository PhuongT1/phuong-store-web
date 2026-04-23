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
import { notify } from "@components/ui";
import { Star, getStars } from "./HandleRender";
import { ProductContext } from "./ProductContext";

type RatingFormProps = {
	onSuccess?: () => void;
	onSettled?: () => void;
} & Partial<ProductItem>;

const RatingForm = ({ onSuccess, onSettled, product: productDetail }: RatingFormProps) => {
	const t = useTranslations("rating");
	const tc = useTranslations("common");
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
			notify.success(tc("updateSuccess"));
		} catch (error) {
			const message = error instanceof Error ? error.message : "Submit review failed";
			notify.error(t("title"), { description: message });
		} finally {
			onSettled?.();
		}
	};

	const form = () => (
		<FormProvider methods={method} formProps={{ onSubmit: handleSubmit(onSubmit) }}>
			<div className="flex flex-col gap-3">
				<div className="border-border/40 flex flex-col items-center gap-2 border-b pb-4">
					{product?.thumbnail?.url && (
						<div className="relative h-20 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/5 p-2 dark:border-white/10 dark:bg-white/5">
							<ImageItem
								src={product.thumbnail.url}
								alt={product.name}
								className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
							/>
						</div>
					)}
					<h3 className="text-foreground text-center text-lg font-medium">{product?.name}</h3>
					<FieldWrapper error={errors.rating?.message} className="mt-2 items-center">
						<div className="flex gap-2">
							{getStars(rating).map((item, index) => (
								<div
									className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
									key={index}
									onClick={() => setValue("rating", index + 1)}
								>
									{Star(item, {
										svgProps: {
											width: 28,
											height: 28
										}
									})}
								</div>
							))}
						</div>
					</FieldWrapper>
					<div className="mt-4 flex w-full flex-col gap-3 sm:flex-row">
						<div className="w-full">
							<FormInput
								name="name"
								inputProps={{
									placeholder: ratingFields["name"],
									required: true,
									className: "rounded-xl"
								}}
							/>
						</div>
						<div className="w-full">
							<FormInput
								name="phoneNumber"
								inputProps={{
									placeholder: ratingFields["phoneNumber"],
									required: true,
									className: "rounded-xl"
								}}
							/>
						</div>
					</div>
				</div>
				<div className="w-full">
					<Textarea
						{...method.register("shareFeelings")}
						placeholder={t("placeholder")}
						className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-within:border-info focus-within:ring-info hover:border-foreground/30 min-h-[80px] resize-none rounded-xl border p-3 shadow-xs transition-[border-color] duration-200 ease-out focus-within:ring-[1px]"
					/>
				</div>
			</div>
		</FormProvider>
	);

	return { form, method, submit: handleSubmit(onSubmit) };
};

export { RatingForm };

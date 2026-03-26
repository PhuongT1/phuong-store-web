"use client";

import { useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { CheckboxItem, ImageItem, InputField, FieldWrapper, Textarea } from "@ui";
import { Star, getStars } from "./HandleRender";
import { ProductContext } from "./ProductContext";

import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useMuteProduct } from "@/hooks/useRatingProduct";
import { type RatingFrom } from "@/types";
import { type ProductItem } from "@/lib/utils";
import { errorMessages } from "@/checkout/hooks/useErrorMessages";
import { ratingFields } from "@/constants";

type RatingFormProps = {
	onSuccess?: () => void;
} & Partial<ProductItem>;

const RatingForm = ({ onSuccess, product: productDetail }: RatingFormProps) => {
	const productContext = useContext(ProductContext);
	const product = productDetail ?? productContext.product;

	const validationSchema = yup.object({
		name: yup.string().required(`${errorMessages.required} ${ratingFields["name"]}`),
		// email: string().email(errorMessages.emailInvalid).required(errorMessages.required),
		phoneNumber: yup.string().required(`${errorMessages.required}  ${ratingFields["phoneNumber"]}`),
		rating: yup.number().min(1, "Vui lòng đánh giá sản phẩm")
	});

	const { trigger } = useMuteProduct();
	const method = useFormik<RatingFrom>({
		initialValues: {
			rating: 0,
			name: "",
			shareFeelings: "",
			email: "",
			phoneNumber: "",
			refProduct: ""
		},

		validationSchema,
		onSubmit: async (values) => {
			try {
				await trigger({ ...values, refProduct: product?.id || "" });
				onSuccess?.();
				method.resetForm();
			} catch (error) {}
		}
	});

	const {
		values: { rating },
		errors,
		setFieldValue
	} = method;

	const form = () => (
		<FormProvider form={method}>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-center gap-3">
					<ImageItem src={product?.thumbnail?.url || ""} />
					<h3>{product?.name}</h3>
					<FieldWrapper error={errors.rating} className="items-center">
						<div className="flex gap-2">
							{getStars(rating).map((item, index) => (
								<div
									className="cursor-pointer"
									key={index}
									onClick={() => {
										void setFieldValue("rating", index + 1);
									}}
								>
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
						<InputField
							inputProps={{
								name: "name",
								placeholder: ratingFields["name"],
								required: true
							}}
						/>
						<InputField
							inputProps={{
								name: "phoneNumber",
								placeholder: ratingFields["phoneNumber"],
								required: true
							}}
						/>
					</div>
				</div>
				<Textarea name="share_feelings" placeholder="Mời bạn chia sẻ thêm cảm nhận..." />
				<CheckboxItem
					itemProp=""
					name="is_recomment"
					label="Tôi sẽ giới thiệu sản phẩm cho bạn bè, người thân"
				/>
			</div>
		</FormProvider>
	);

	return { form, method };
};

export { RatingForm };

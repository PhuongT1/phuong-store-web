import { useCallback, useMemo } from "react";
import { type ErrorCode } from "@/checkout/lib/globalTypes";

export const errorMessages = {
	invalid: "Vui lòng nhập đúng định dạng.",
	required: "Vui lòng nhập",
	requiredSelect: "Vui lòng chọn",
	unique: "Giá trị này phải là duy nhất.",
	emailInvalid: "Vui lòng nhập đúng định dạng email.",
	passwordAtLeastCharacters: "Mật khẩu phải có ít nhất 8 ký tự.",
	passwordTooShort: "Mật khẩu quá ngắn. Độ dài tối thiểu là 8 ký tự.",
	passwordTooSimilar: "Mật khẩu quá giống với mật khẩu trước đó.",
	passwordTooCommon: "Mật khẩu quá phổ biến. Vui lòng sử dụng mật khẩu khó đoán hơn.",
	passwordInvalid: "Mật khẩu không hợp lệ.",
	quantityGreaterThanLimit: "Số lượng vượt quá giới hạn cho phép.",
	insufficientStock: "Không đủ hàng trong kho.",
	invalidCredentials: "Thông tin đăng nhập không hợp lệ.",
	missingFields: "Thiếu thông tin trong biểu mẫu địa chỉ."
} satisfies Record<ErrorCode, string>;

export type ErrorMessages = Record<ErrorCode, string>;

export const useErrorMessages = <TKey extends string = ErrorCode>(customMessages?: Record<TKey, string>) => {
	const messagesToUse = customMessages || errorMessages;

	const getMessageByErrorCode = useCallback(
		(errorCode: string) => {
			const formattedMessage = messagesToUse[errorCode as keyof typeof messagesToUse];
			if (!formattedMessage) {
				console.warn(`Missing translation: ${errorCode}`);
				return "";
			}
			return formattedMessage;
		},
		[messagesToUse]
	);

	const translatedErrorMessages = useMemo(
		() =>
			Object.keys(messagesToUse).reduce(
				(result, key) => ({
					...result,
					[key]: getMessageByErrorCode(key as TKey)
				}),
				{} as Record<TKey, string>
			),
		[getMessageByErrorCode, messagesToUse]
	);

	return {
		errorMessages: translatedErrorMessages,
		getMessageByErrorCode
	};
};

/**
 * `FieldState` is a wrapper component that augments form controls
 * with accessibility attributes derived from the current field state.
 *
 * It uses Radix UI's `Slot` to allow flexible composition: you can pass
 * any form input component as a child, and `FieldState` will attach
 * ARIA attributes automatically (e.g. `aria-invalid`).
 *
 * @example
 * ```tsx
 * <FieldState fieldState={fieldState}>
 *   <input type="text" />
 * </FieldState>
 * ```
 *
 * @remarks
 * - `fieldState` is typically obtained from `react-hook-form`'s
 *   `Controller` or `useController`.
 * - Any additional props will be forwarded to the underlying `Slot`.
 */

import { Slot } from "@radix-ui/react-slot";
import { type PropsWithChildren } from "react";
import { type FieldErrorProps } from "./FieldError";

type FieldStateProps<BaseType extends Record<string, unknown> = Record<string, unknown>> = Pick<
	FieldErrorProps,
	"error"
> & {
	asChild?: boolean;
	restProps?: React.ComponentProps<"div">;
} & PropsWithChildren &
	BaseType;

const SlotBase = ({ asChild = true, children, ...slotProps }: FieldStateProps) => {
	if (!asChild && children) return <>{children}</>;
	return <Slot {...slotProps}>{children}</Slot>;
};

const FieldSlot = ({ error, ...slotProps }: FieldStateProps) => {
	return <SlotBase aria-invalid={!!error} {...slotProps} />;
};

const FieldState = ({ error, ...slotProps }: FieldStateProps) => {
	return <FieldSlot data-slot="field-state" {...slotProps} />;
};

export { FieldSlot, FieldState, SlotBase };

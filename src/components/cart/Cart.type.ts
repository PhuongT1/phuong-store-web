import { type CheckoutFindQuery, type CheckoutLine, type OrderLine } from "@/gql/graphql";

type CheckoutLineForm = { _id: string } & MakeOptional<
	NonNullable<CheckoutFindQuery["checkout"]>["lines"][number],
	"__typename"
>;
type CheckoutLineItem = CheckoutLine;
type CartLine = CheckoutLineItem | OrderLine;

export { type CartLine, type CheckoutLineItem, type CheckoutLineForm };

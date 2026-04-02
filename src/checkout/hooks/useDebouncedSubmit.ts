import { useCallback, useEffect } from "react";
import { debounce } from "lodash-es";

export const useDebouncedSubmit = <TArgs extends Array<any>>(
	onSubmit?: (...args: TArgs) => Promise<any> | void,
) => {
	const debouncedSubmit = useCallback(
		debounce((...args: TArgs) => {
			void onSubmit?.(...args);
		}, 2000),
		[onSubmit],
	);

	useEffect(() => {
		return () => {
			debouncedSubmit.cancel();
		};
		 
	}, []);

	return debouncedSubmit;
};

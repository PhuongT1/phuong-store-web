import { useCallback, useEffect } from "react";
import { debounce } from "lodash-es";

export const useDebouncedSubmit = <TArgs extends Array<any>>(
	onSubmit?: (...args: TArgs) => Promise<any> | void,
	delay = 1000
) => {
	const debouncedSubmit = useCallback(
		debounce((...args: TArgs) => {
			void onSubmit?.(...args);
		}, delay),
		[onSubmit, delay]
	);

	useEffect(() => {
		return () => {
			debouncedSubmit.cancel();
		};
	}, []);

	return debouncedSubmit;
};

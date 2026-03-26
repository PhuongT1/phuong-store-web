// import { useReducer, useCallback, useRef } from "react";
// import { type Action, type LoadingState, type State } from "@/types";

// import { LoadingState, useLoadingStore } from "@/store/useLoadingStore";
import { useEffect } from "react";
import { boolean } from "zod";

// const reducer = (_state: State, action: Action): State =>
// 	action.type === "SET" ? { status: action.payload } : { status: "idle" };

// const useLoading = () => {
// 	const [state, dispatch] = useReducer(reducer, { status: "idle" });
// 	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

// 	const setLoading = useCallback((status: LoadingState) => dispatch({ type: "SET", payload: status }), []);
// 	const startLoading = useCallback(() => setLoading("loading"), [setLoading]);
// 	const complete = useCallback(() => setLoading("completed"), [setLoading]);
// 	const setError = useCallback(() => setLoading("error"), [setLoading]);
// 	const reset = useCallback(() => setLoading("idle"), [setLoading]);

// 	const resetAfter = useCallback(
// 		(ms: number) => {
// 			if (timeoutRef.current) clearTimeout(timeoutRef.current);
// 			timeoutRef.current = setTimeout(() => reset(), ms);
// 		},
// 		[reset]
// 	);

// 	return {
// 		status: state.status,
// 		isLoading: state.status === "loading",
// 		isCompleted: state.status === "completed",
// 		isIdle: state.status === "idle",
// 		isError: state.status === "error",
// 		startLoading,
// 		complete,
// 		setError,
// 		reset,
// 		setLoading,
// 		resetAfter
// 	};
// };

// export { useLoading };

// type Loading = {
// 	isLoading?: boolean;
// };

// const useLoading = ({ isLoading }: Loading) => {
// 	const { setLoading } = useLoadingStore();

// 	useEffect(() => {
// 		setLoading(isLoading);
// 	}, [isLoading]);
// };

// export { useLoading };

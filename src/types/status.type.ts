type LoadingState = "idle" | "loading" | "completed" | "error";
type State = { status: LoadingState };
type Action = { type: "SET"; payload: LoadingState } | { type: "RESET" };

export { type LoadingState, type State, type Action };

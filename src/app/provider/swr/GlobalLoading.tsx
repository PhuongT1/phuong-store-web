import { useGlobalSWRLoading } from "@store/useLoadingStore";
import { Loading } from "@components/ui";

const GlobalLoading = () => {
	const { count, isLoadingVisible } = useGlobalSWRLoading();

	const isLoading = isLoadingVisible || count > 0;

	if (!isLoading) return null;

	return <Loading />;
};

export { GlobalLoading };

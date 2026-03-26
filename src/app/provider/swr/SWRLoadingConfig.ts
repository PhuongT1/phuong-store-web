/* eslint-disable react-hooks/rules-of-hooks */
import { type Middleware } from "swr";
import { useGlobalSWRLoading } from "@store/useLoadingStore";
import { type SWRConfigExtended } from "@/hooks/swr/useSWR";

const SWRLoadingConfig: Middleware = (useSWRNext) => (key, fetcher, config: SWRConfigExtended) => {
	const { showLoading: shouldTrackLoading, showLoadingAfterFetch, ...restConfig } = config;

	if (!fetcher) return useSWRNext(key, fetcher, restConfig);

	const { start, stop, setLoadingVisible } = useGlobalSWRLoading.getState();
	const extendedFetcher: typeof fetcher = async (...args) => {
		if (shouldTrackLoading) start();
		try {
			return await fetcher(...args);
		} finally {
			if (shouldTrackLoading) stop();
			if (showLoadingAfterFetch) setLoadingVisible();
		}
	};

	return useSWRNext(key, extendedFetcher, restConfig);
};

export { SWRLoadingConfig, type SWRConfigExtended };

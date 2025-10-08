import { QueryClient } from '@tanstack/react-query'

const STALE_TIME = 60_000

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: STALE_TIME,
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
})

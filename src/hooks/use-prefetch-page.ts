import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { moviesQuery } from '@/features/movies/queries'

type Params = {
	page: number
	totalPages: number
	resultsPerPage: number
	searchQuery?: string
	genreQuery?: string
	offset?: number
}

/**
 * Configurable hook for getting queries to prefetch pages with offset
 */
export function usePrefetchPage({ page, totalPages, resultsPerPage, searchQuery, genreQuery, offset = 1 }: Params) {
	const queryClient = useQueryClient()

	const prefetchPage = useCallback(() => {
		const target = page + offset
		if (target < 1 || target > totalPages) {
			return
		}
		queryClient.prefetchQuery(
			moviesQuery({
				page: target,
				limit: resultsPerPage,
				where: { search: searchQuery, genre: genreQuery },
			}),
		)
	}, [page, offset, totalPages, resultsPerPage, searchQuery, genreQuery, queryClient])

	return prefetchPage
}

import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod/v4-mini'
import { rest } from '@/lib/api/rest'

export const movieTotalsQuery = queryOptions({
	queryKey: ['movie-totals'],
	queryFn: () =>
		rest<{ data: { id: string; title: string }[]; totalPages: number }>(
			'/movies/titles',
			z.object({ data: z.array(z.object({ id: z.string(), title: z.string() })), totalPages: z.number() }),
			{
				needsToken: false,
				query: new URLSearchParams({ page: '1', limit: '1' }),
			},
		),
})

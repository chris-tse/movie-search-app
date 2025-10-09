import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod/v4-mini'
import { graphql } from '@/lib/api/graphql'
import { rest } from '@/lib/api/rest'

export const movieTotalsQuery = (params: { search?: string; genre?: string }) => {
	const metadataSearchParams = new URLSearchParams({ page: '1', limit: '1' })

	if (params.search) {
		metadataSearchParams.set('search', params.search)
	}

	if (params.genre) {
		metadataSearchParams.set('genre', params.genre)
	}

	return queryOptions({
		queryKey: ['movie-totals', params],
		queryFn: () =>
			rest<{ data: { id: string; title: string }[]; totalPages: number }>(
				'/movies',
				z.object({ data: z.array(z.object({ id: z.string(), title: z.string() })), totalPages: z.number() }),
				{ needsToken: true, query: metadataSearchParams },
			),
	})
}

export type Movie = {
	id: string
	title: string
	posterUrl: string | null
	genres: {
		title: string
	}[]
	rating: string | null
	summary: string | null
	duration: string | null
	datePublished: string | null
}

type Variables = {
	pagination: {
		page: number
		perPage: number
	}
	where?: { genre?: string; search?: string }
}

const template = `
	query MoviesQuery($pagination: PaginationInput!, $where: MovieFilterInput) {
		movies(pagination: $pagination, where: $where) {
			nodes {
				id
				rating
				posterUrl
				genres {
					title
				}
				title
				summary
				duration
				datePublished
			}
		}
	}
`

export const moviesQuery = (params: { page: number; limit: number; where?: { genre?: string; search?: string } }) => {
	const variables: Variables = {
		pagination: {
			page: params.page,
			perPage: params.limit,
		},
	}

	if (params.where?.genre) {
		variables.where = { genre: params.where.genre }
	}
	if (params.where?.search) {
		variables.where = { ...variables.where, search: params.where.search }
	}

	return queryOptions({
		queryKey: ['movies', params],
		queryFn: () => graphql<{ data: { movies: { nodes: Movie[] } } }>(template, variables),
	})
}

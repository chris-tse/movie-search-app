import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod/v4-mini'
import { graphql } from '@/lib/api/graphql'
import { rest } from '@/lib/api/rest'

/**
 * Since the API does not provide a total result count but total page count, we fetch one movie per page, total counts
 * can be derived from the total page count.
 * @param params Search and genre parameters
 */
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

/**
 * Lighter list item returned from GraphQL movies query for list display
 */
export type MovieResult = {
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

/**
 * MovieDetail: full detail from REST /movies/:id for detail dialog display
 */
export type MovieDetail = {
	id: string
	title: string
	posterUrl?: string | null
	rating?: string | null
	summary?: string | null
	duration?: string | null
	datePublished?: string | null
	ratingValue?: number | null
	bestRating?: number | null
	worstRating?: number | null
	directors?: string[] | null
	writers?: string[] | null
	mainActors?: string[] | null
	genres?: { id: string; title: string }[] | null
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
		queryFn: () => graphql<{ data: { movies: { nodes: MovieResult[] } } }>(template, variables),
		placeholderData: (prev) => prev,
	})
}

const nullableString = z.optional(z.nullable(z.string()))
const nullableNumber = z.optional(z.nullable(z.number()))

const movieDetailSchema = z.object({
	id: z.string(),
	title: z.string(),
	posterUrl: nullableString,
	rating: nullableString,
	summary: nullableString,
	duration: nullableString,
	datePublished: nullableString,
	ratingValue: nullableNumber,
	bestRating: nullableNumber,
	worstRating: nullableNumber,
	directors: z.optional(z.nullable(z.array(z.string()))),
	writers: z.optional(z.nullable(z.array(z.string()))),
	mainActors: z.optional(z.nullable(z.array(z.string()))),
	genres: z.optional(z.nullable(z.array(z.object({ id: z.string(), title: z.string() })))),
})

export const movieDetailQuery = (id: string | null) =>
	queryOptions({
		queryKey: ['movie-detail', id],
		enabled: !!id,
		queryFn: () => rest<MovieDetail>(`/movies/${id}`, movieDetailSchema, { needsToken: true }),
	})

// ---
const exploreTemplate = template

const EXPLORE_GENRES = ['Action', 'Comedy', 'Documentary', 'Sci-Fi', 'Horror'] as const
export type ExploreGenre = (typeof EXPLORE_GENRES)[number]
export type ExploreData = Record<ExploreGenre, MovieResult[]>

export const exploreGenresQuery = queryOptions({
	queryKey: ['explore-genres'],
	queryFn: async () => {
		const results = await Promise.all(
			EXPLORE_GENRES.map(async (genre) => {
				try {
					const variables: Variables = {
						pagination: { page: 1, perPage: 4 },
						where: { genre },
					}
					const res = await graphql<{ data: { movies: { nodes: MovieResult[] } } }>(exploreTemplate, variables)
					return [genre, res.data.movies.nodes] as const
				} catch {
					return [genre, []] as const
				}
			}),
		)
		return Object.fromEntries(results) as ExploreData
	},
})

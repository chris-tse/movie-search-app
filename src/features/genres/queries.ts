import { queryOptions } from '@tanstack/react-query'
import { graphql } from '@/lib/api/graphql'

export const genresQuery = queryOptions({
	queryKey: ['genres'],
	queryFn: () =>
		graphql<{ data: { genres: { nodes: { title: string }[] } } }>(`{
      genres {
        nodes {
          title
        }
      }
    }
  `),
})

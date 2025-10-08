import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod/v4-mini'
import { rest } from '@/lib/api/rest'

export const healthcheckQuery = queryOptions({
	queryKey: ['healthcheck'],
	queryFn: () =>
		rest<{ contentful: boolean }>('/healthcheck', z.object({ contentful: z.boolean() }), { needsToken: false }),
})

import type { z } from 'zod/v4-mini'
import { fetchAndSetToken } from './auth'
import { BASE_URL } from './const'

type RestOptions = {
	needsToken: boolean
	headers?: Record<string, string>
	options?: RequestInit
}

export async function rest<T>(
	path: string,
	schema: z.ZodMiniType<T>,
	options: RestOptions = { needsToken: true, options: {}, headers: {} },
): Promise<T> {
	let token: string | null = null

	if (options.needsToken) {
		token = localStorage.getItem('token') ?? (await fetchAndSetToken())
	}

	const response = await fetch(`${BASE_URL}${path}`, {
		...options.options,
		headers: {
			...options.headers,
			Authorization: options.needsToken ? `Bearer ${token}` : '',
		},
	})

	const json = await response.json()

	console.log({ json })

	return schema.parse(json)
}

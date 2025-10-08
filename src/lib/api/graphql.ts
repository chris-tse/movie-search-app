import { fetchAndSetToken } from './auth'
import { BASE_URL } from './const'

const GQL_URL = `${BASE_URL}/graphql` as const
const TIMEOUT = 10_000 as const

export async function graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
	const token = localStorage.getItem('token') ?? (await fetchAndSetToken())

	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)
	const response = await fetch(GQL_URL, {
		signal: controller.signal,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ query, variables }),
	})
	clearTimeout(timeoutId)

	return response.json()
}

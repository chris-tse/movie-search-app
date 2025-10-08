const BASE_URL = 'https://0kadddxyh3.execute-api.us-east-1.amazonaws.com'

function fetchAndSetToken() {
	return fetch(`${BASE_URL}/auth/token`)
		.then((res) => res.json())
		.then((data) => {
			localStorage.setItem('token', data.token)
			return data.token
		})
}

type RestOptions = {
	needsToken: boolean
	headers?: Record<string, string>
	options?: RequestInit
}

export async function rest<T>(
	path: string,
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

	return response.json()
}

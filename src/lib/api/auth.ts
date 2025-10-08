import { z } from 'zod/v4-mini'
import { BASE_URL } from './const'

const tokenSchema = z.object({
	token: z.string(),
})

export async function fetchAndSetToken() {
	try {
		const response = await fetch(`${BASE_URL}/auth/token`)
		const data = await response.json()
		const parsedData = tokenSchema.parse(data)

		localStorage.setItem('token', parsedData.token)

		return parsedData.token
	} catch (error) {
		console.error(error)
		return null
	}
}

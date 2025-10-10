export function pushCurrentHistory(state: { search: string; genre: string; page: number }) {
	if (typeof window === 'undefined') {
		return
	}
	window.history.pushState(state, '')
}

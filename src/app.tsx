import { lazy, Suspense } from 'react'
import { Header } from './components/header'
import { LoadingShell } from './components/loading-shell'

const MovieSearch = lazy(() => import('./components/movie-search').then((module) => ({ default: module.MovieSearch })))

export function App({ isApiHealthy }: { isApiHealthy: boolean }) {
	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			<Header />
			{isApiHealthy ? (
				<Suspense fallback={<LoadingShell />}>
					<MovieSearch />
				</Suspense>
			) : (
				<div className="text-center font-bold text-2xl">Movies API is down</div>
			)}
		</div>
	)
}

export default App

import { lazy } from 'react'
import { usePrefetchQuery, useQuery } from '@tanstack/react-query'
import { Header } from './components/header'
import { LoadingShell } from './components/loading-shell'
import { genresQuery } from './features/genres/queries'
import { healthcheckQuery } from './features/healthcheck/queries'
import { exploreGenresQuery } from './features/movies/queries'

const MovieSearch = lazy(() => import('./components/movie-search').then((module) => ({ default: module.MovieSearch })))

export function App() {
	const { isPending: isHealthcheckPending, data: healthcheckData } = useQuery(healthcheckQuery)
	const { isPending: isGenresPending, data: genresData } = useQuery(genresQuery)
	usePrefetchQuery(exploreGenresQuery)

	if (isHealthcheckPending || isGenresPending) {
		return <LoadingShell />
	}

	const apiIsHealthy = Boolean(healthcheckData?.contentful)

	return (
		<div className="container mx-auto min-h-screen max-w-7xl px-4 py-8">
			<Header />
			{apiIsHealthy ? (
				<MovieSearch genres={genresData?.data?.genres?.nodes?.map((genre) => genre.title) ?? []} />
			) : (
				<div className="text-center font-bold">
					<p className="text-2xl">Movies API is currently down</p>
					<p className="text-sm">Please try again later</p>
				</div>
			)}
		</div>
	)
}

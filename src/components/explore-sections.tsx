import { useQuery } from '@tanstack/react-query'
import type { ExploreGenre } from '@/features/movies/queries'
import { exploreGenresQuery } from '@/features/movies/queries'
import { MovieCard } from './movie-card'

const GENRE_ORDER: ExploreGenre[] = ['Action', 'Comedy', 'Documentary', 'Sci-Fi', 'Horror']

export function ExploreSections({
	onCardHover,
	onCardClick,
	onSelectGenre,
}: {
	onCardHover: (id: string) => void
	onCardClick: (id: string) => void
	onSelectGenre: (genre: string) => void
}) {
	const query = useQuery(exploreGenresQuery)

	if (query.isPending) {
		return (
			<div className="space-y-12 py-4">
				{GENRE_ORDER.map((genre) => (
					<div className="space-y-4" key={genre}>
						<div className="flex items-center justify-between">
							<h2 className="font-semibold text-2xl">{genre}</h2>
							<span className="text-muted-foreground text-xs">Loading…</span>
						</div>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									className="aspect-[2/3] h-full w-full animate-pulse rounded-xl border border-border bg-muted/40"
									key={i}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		)
	}

	if (!query.data) {
		return null
	}

	return (
		<div className="space-y-12 py-4">
			{GENRE_ORDER.map((genre) => {
				const movies = query.data[genre]
				if (!movies || movies.length === 0) {
					return null
				}
				return (
					<section aria-labelledby={`genre-${genre}`} className="space-y-4" key={genre}>
						<div className="flex items-center justify-between">
							<h2 className="font-semibold text-2xl" id={`genre-${genre}`}>
								{genre}
							</h2>
							<button
								className="rounded font-medium text-primary text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								onClick={() => onSelectGenre(genre)}
								type="button"
							>
								View more
							</button>
						</div>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{movies.map((movie) => (
								<MovieCard key={movie.id} movie={movie} onClick={onCardClick} onHover={onCardHover} />
							))}
						</div>
					</section>
				)
			})}
		</div>
	)
}

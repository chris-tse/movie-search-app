import { useQuery } from '@tanstack/react-query'
import { Film, Search } from 'lucide-react'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { lazy, Suspense } from 'react'
import { MovieCard } from '@/components/movie-card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { type Movie, moviesQuery, movieTotalsQuery } from '@/features/movies/queries'
import { LoadingShell } from './loading-shell'
import { useViewportWidth } from '@/hooks/use-viewport-width'

const SelectContent = lazy(() => import('../components/ui/select').then((mod) => ({ default: mod.SelectContent })))
const SelectItem = lazy(() => import('../components/ui/select').then((mod) => ({ default: mod.SelectItem })))

const RESULTS_PER_PAGE = 16
export function MovieSearch({ genres }: { genres: string[] }) {
	const viewportWidth = useViewportWidth()

	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))
	const [genre, setGenre] = useQueryState('genre', parseAsString.withDefault(''))

	const searchQuery = search === '' ? undefined : search
	const genreQuery = genre === '' ? undefined : genre

	const totalsQuery = useQuery(movieTotalsQuery({ search: searchQuery, genre: genreQuery }))
	const moviesDataQuery = useQuery(moviesQuery({ page, limit: RESULTS_PER_PAGE, where: { search: searchQuery, genre: genreQuery } }))

	const isPending = totalsQuery.isPending || moviesDataQuery.isPending
	const isError = totalsQuery.isError || moviesDataQuery.isError

	const totalResults = totalsQuery.data?.totalPages ?? 0
	const totalPages = Math.max(1, Math.ceil(totalResults / RESULTS_PER_PAGE))

	const isSearchEmpty = searchQuery ? searchQuery.trim() === '' : true

	console.log({data: moviesDataQuery.data})

	return (
		<div>
			{/* Search and Filters */}
			<div className="mb-8 space-y-4">
				<div className="flex flex-col gap-4 md:flex-row">
					<div className="relative flex-1">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
						<Input
							className="h-11 border-border bg-card pl-10"
							onChange={(e) => setSearch(e.target.value.trim())}
							placeholder="Search for movies..."
							type="text"
							value={searchQuery}
						/>
					</div>
					<Suspense
						fallback={
							<Select disabled>
								<SelectTrigger className="w-full border-border bg-card md:w-[200px]">
									<SelectValue placeholder="Loading..." />
								</SelectTrigger>
							</Select>
						}
					>
						{genres.length > 0 ? (
							<Select value={genre}>
								<SelectTrigger className="h-11 w-full border-border bg-card md:w-[200px]">
									<SelectValue placeholder="Select genre" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem key="all" onClick={() => setGenre('All Genres')} value="All Genres">
										All Genres
									</SelectItem>
									{genres.map((g) => (
										<SelectItem key={g} onClick={() => setGenre(g)} value={g}>
											{g}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<Select disabled>
								<SelectTrigger className="h-11 w-full border-border bg-card md:w-[200px]">
									<SelectValue placeholder="No genres found" />
								</SelectTrigger>
							</Select>
						)}
					</Suspense>
				</div>

				{!isSearchEmpty && (
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground text-sm">
							Showing{' '}
							<span className="font-medium text-foreground">
								{(page - 1) * RESULTS_PER_PAGE + 1}-{Math.min(page * RESULTS_PER_PAGE, totalResults)}
							</span>{' '}
							of <span className="font-medium text-foreground">{totalResults}</span> results
						</p>
					</div>
				)}
			</div>

			<MainBody
				isError={isError}
				isPending={isPending}
				isSearchEmpty={isSearchEmpty}
				movies={moviesDataQuery.data?.data?.movies?.nodes}
			/>

			{!isSearchEmpty && totalPages > 1 && (
				<Pagination className="mt-6">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href={page > 1 ? `?page=${page - 1}&search=${search}&genre=${genre}` : undefined}
								onClick={(e) => {
									if (page <= 1) {
										e.preventDefault()
										return
									}
									e.preventDefault()
									setPage(page - 1)
								}}
								aria-disabled={page <= 1}
								className={page <= 1 ? 'pointer-events-none opacity-50' : undefined}
							/>
						</PaginationItem>
						<PaginationItem>
							<span className="px-3 text-sm">Page {page} of {totalPages}</span>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext
								href={page < totalPages ? `?page=${page + 1}&search=${search}&genre=${genre}` : undefined}
								onClick={(e) => {
									if (page >= totalPages) {
										e.preventDefault()
										return
									}
									e.preventDefault()
									setPage(page + 1)
								}}
								aria-disabled={page >= totalPages}
								className={page >= totalPages ? 'pointer-events-none opacity-50' : undefined}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}

function MainBody({
	isSearchEmpty,
	isPending,
	isError,
	movies,
}: {
	isSearchEmpty: boolean
	isPending: boolean
	isError: boolean
	movies: Movie[] | undefined
}) {
	console.log({ isSearchEmpty, isPending, isError, movies })

	if (isSearchEmpty) {
		return (
			<div className="flex flex-col items-center justify-center px-4 py-24">
				<div className="mb-6 rounded-full bg-muted p-6">
					<Film className="h-12 w-12 text-muted-foreground" />
				</div>

				<h2 className="mb-2 text-balance text-center font-semibold text-2xl">Start Your Search</h2>
				<p className="max-w-md text-balance text-center text-muted-foreground">
					Enter a movie title in the search bar above to discover films and explore detailed information about each one.
				</p>
			</div>
		)
	}

	if (isPending) {
		return <LoadingShell />
	}

	if (isError) {
		return <div>Error loading movies</div>
	}

	return (
		<div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{movies?.map((movie) => (
				<MovieCard key={movie.id} movie={movie} />
			))}
		</div>
	)
}

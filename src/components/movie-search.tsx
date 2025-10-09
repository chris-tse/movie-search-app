import { startTransition, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Film } from 'lucide-react'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { MovieCard } from '@/components/movie-card'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { type Movie, moviesQuery, movieTotalsQuery } from '@/features/movies/queries'
import { usePrefetchPage } from '@/hooks/use-prefetch-page'
import { LoadingShell } from './loading-shell'
import { SearchBar } from './search-bar'

const RESULTS_PER_PAGE = 16

function getTotalPages(totalResults: number) {
	return Math.max(1, Math.ceil(totalResults / RESULTS_PER_PAGE))
}

export function MovieSearch({ genres }: { genres: string[] }) {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))
	const [genre, setGenre] = useQueryState('genre', parseAsString.withDefault(''))

	const searchQuery = search === '' ? undefined : search
	const genreQuery = genre === '' ? undefined : genre

	const totalsQuery = useQuery(movieTotalsQuery({ search: searchQuery, genre: genreQuery }))
	const moviesDataQuery = useQuery(
		moviesQuery({ page, limit: RESULTS_PER_PAGE, where: { search: searchQuery, genre: genreQuery } }),
	)

	const isPending = totalsQuery.isPending || moviesDataQuery.isPending
	const isError = totalsQuery.isError || moviesDataQuery.isError

	const totalResults = totalsQuery.data?.totalPages ?? 0
	const totalPages = getTotalPages(totalResults)

	const hasActiveFilter = Boolean((searchQuery && searchQuery !== '') || genreQuery)

	const prefetchNextPage = usePrefetchPage({
		page,
		totalPages,
		resultsPerPage: RESULTS_PER_PAGE,
		searchQuery,
		genreQuery,
		offset: 1,
	})

	const prefetchPrevPage = usePrefetchPage({
		page,
		totalPages,
		resultsPerPage: RESULTS_PER_PAGE,
		searchQuery,
		genreQuery,
		offset: -1,
	})

	const [isPrevHovered, setIsPrevHovered] = useState(false)
	const [isNextHovered, setIsNextHovered] = useState(false)

	useEffect(() => {
		if (isPrevHovered) {
			prefetchPrevPage()
		}
	}, [isPrevHovered, prefetchPrevPage])

	useEffect(() => {
		if (isNextHovered) {
			prefetchNextPage()
		}
	}, [isNextHovered, prefetchNextPage])

	return (
		<div>
			<div className="mb-8 space-y-4">
				<SearchBar
					genre={genre}
					genres={genres}
					search={search}
					setGenre={setGenre}
					setPage={setPage}
					setSearch={setSearch}
				/>

				{hasActiveFilter && (
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground text-sm">
							Showing{' '}
							<span className="font-medium text-foreground">
								{totalResults === 0 ? 0 : (page - 1) * RESULTS_PER_PAGE + 1}-
								{Math.min(page * RESULTS_PER_PAGE, totalResults)}
							</span>{' '}
							of <span className="font-medium text-foreground">{totalResults}</span> results
						</p>
					</div>
				)}
			</div>

			<MainBody
				hasActiveFilter={hasActiveFilter}
				isError={isError}
				isPending={isPending}
				movies={moviesDataQuery.data?.data?.movies?.nodes}
			/>

			{hasActiveFilter && totalPages > 1 && (
				<Pagination className="mt-6">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								aria-disabled={page <= 1}
								className={page <= 1 ? 'pointer-events-none opacity-50' : undefined}
								href={page > 1 ? `?page=${page - 1}&search=${search}&genre=${genre}` : undefined}
								onClick={(e) => {
									if (page <= 1) {
										e.preventDefault()
										return
									}
									e.preventDefault()
									startTransition(() => {
										setPage(page - 1)
									})
								}}
								onMouseEnter={() => {
									setIsPrevHovered(true)
									prefetchPrevPage()
								}}
								onMouseLeave={() => {
									setIsPrevHovered(false)
								}}
							/>
						</PaginationItem>
						<PaginationItem>
							<span className="px-3 text-sm">
								Page {page} of {totalPages}
							</span>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext
								aria-disabled={page >= totalPages}
								className={page >= totalPages ? 'pointer-events-none opacity-50' : undefined}
								href={page < totalPages ? `?page=${page + 1}&search=${search}&genre=${genre}` : undefined}
								onClick={(e) => {
									if (page >= totalPages) {
										e.preventDefault()
										return
									}
									e.preventDefault()
									startTransition(() => {
										setPage(page + 1)
									})
								}}
								onMouseEnter={() => {
									setIsNextHovered(true)
									prefetchNextPage()
								}}
								onMouseLeave={() => {
									setIsNextHovered(false)
								}}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}

function MainBody({
	hasActiveFilter,
	isPending,
	isError,
	movies,
}: {
	hasActiveFilter: boolean
	isPending: boolean
	isError: boolean
	movies: Movie[] | undefined
}) {
	if (!hasActiveFilter) {
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

	if (!movies || movies.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center px-4 py-24 text-center text-muted-foreground">
				<p className="text-sm">No results found. Try adjusting your search or filters.</p>
			</div>
		)
	}

	return (
		<div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{movies?.map((movie) => (
				<MovieCard key={movie.id} movie={movie} />
			))}
		</div>
	)
}

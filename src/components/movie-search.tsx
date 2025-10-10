import { startTransition, useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { ExploreSections } from '@/components/explore-sections'
import { MovieCard } from '@/components/movie-card'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { type MovieResult, movieDetailQuery, moviesQuery, movieTotalsQuery } from '@/features/movies/queries'
import { usePrefetchPage } from '@/hooks/use-prefetch-page'
import { LoadingShell } from './loading-shell'
import { MovieDetailDialog } from './movie-detail-dialog'
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

	const [activeMovieId, setActiveMovieId] = useState<string | null>(null)
	const lastActiveMovieIdRef = useRef<string | null>(null)
	const queryClient = useQueryClient()

	function handleCardHover(id: string) {
		queryClient.prefetchQuery(movieDetailQuery(id))
	}

	function handleCardClick(id: string) {
		lastActiveMovieIdRef.current = id
		setActiveMovieId(id)
		queryClient.fetchQuery(movieDetailQuery(id))
	}

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

			{hasActiveFilter ? (
				<MainBody
					isError={isError}
					isPending={isPending}
					movies={moviesDataQuery.data?.data?.movies?.nodes}
					onCardClick={handleCardClick}
					onCardHover={handleCardHover}
				/>
			) : (
				<ExploreSections
					onCardClick={handleCardClick}
					onCardHover={handleCardHover}
					onSelectGenre={(g) => {
						startTransition(() => {
							setGenre(g)
							setPage(1)
						})
						// focus search bar if present
						queueMicrotask(() => {
							const el = document.querySelector<HTMLInputElement>('input[name="search"]')
							el?.focus()
						})
					}}
				/>
			)}

			<MovieDetailDialog
				movieId={activeMovieId}
				onOpenChange={(open) => {
					if (!open) {
						setActiveMovieId(null)
						// Restore focus to the card that opened the dialog, if it still exists in DOM
						queueMicrotask(() => {
							const id = lastActiveMovieIdRef.current
							if (id) {
								const el = document.querySelector<HTMLButtonElement>(`button[data-movie-id="${id}"]`)
								el?.focus()
							}
						})
					}
				}}
				open={activeMovieId != null}
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
	isPending,
	isError,
	movies,
	onCardHover,
	onCardClick,
}: {
	isPending: boolean
	isError: boolean
	movies: MovieResult[] | undefined
	onCardHover: (id: string) => void
	onCardClick: (id: string) => void
}) {
	if (isPending) {
		return <LoadingShell heading="Searching for movies" subheading="Please wait." />
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
		<div className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
			{movies?.map((movie) => (
				<MovieCard key={movie.id} movie={movie} onClick={onCardClick} onHover={onCardHover} />
			))}
		</div>
	)
}

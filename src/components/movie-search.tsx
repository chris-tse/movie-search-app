import { ChevronLeft, ChevronRight, Film, Search } from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useState } from 'react'
import { MovieCard } from '@/components/movie-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

// Placeholder movie data
const PLACEHOLDER_MOVIES = [
	{
		id: 1,
		title: 'The Stellar Journey',
		rating: 8.5,
		duration: '2h 28m',
		year: 2024,
		genre: 'Sci-Fi',
		summary:
			'An epic adventure through the cosmos as a crew of explorers discovers a mysterious signal from the edge of the known universe.',
	},
	{
		id: 2,
		title: 'Midnight Chronicles',
		rating: 7.8,
		duration: '1h 55m',
		year: 2024,
		genre: 'Thriller',
		summary: 'A detective races against time to solve a series of interconnected crimes in a city that never sleeps.',
	},
	{
		id: 3,
		title: 'Echoes of Tomorrow',
		rating: 9.1,
		duration: '2h 15m',
		year: 2024,
		genre: 'Sci-Fi',
		summary: 'In a world where memories can be traded, one person fights to preserve the truth of the past.',
	},
	{
		id: 4,
		title: 'The Last Garden',
		rating: 8.2,
		duration: '2h 5m',
		year: 2023,
		genre: 'Drama',
		summary: 'A touching story about family, loss, and the healing power of nature in a rapidly changing world.',
	},
	{
		id: 5,
		title: 'Velocity',
		rating: 7.5,
		duration: '1h 48m',
		year: 2024,
		genre: 'Action',
		summary: 'High-octane thrills as underground racers compete in the most dangerous competition ever conceived.',
	},
	{
		id: 6,
		title: 'Whispers in the Dark',
		rating: 7.9,
		duration: '1h 42m',
		year: 2024,
		genre: 'Horror',
		summary: 'A psychological thriller that blurs the line between reality and nightmare in an isolated mansion.',
	},
	{
		id: 7,
		title: 'Heartstrings',
		rating: 8.0,
		duration: '1h 52m',
		year: 2024,
		genre: 'Romance',
		summary: 'Two musicians from different worlds find harmony in the most unexpected places.',
	},
	{
		id: 8,
		title: 'The Forgotten War',
		rating: 8.7,
		duration: '2h 35m',
		year: 2023,
		genre: 'Drama',
		summary: "An unflinching look at courage and sacrifice during one of history's most pivotal conflicts.",
	},
]

const GENRES = ['All Genres', 'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Romance']

export function MovieSearch() {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	// const [selectedGenre, setSelectedGenre] = useState('All Genres')
	const [searchQuery, setSearchQuery] = useState('')

	const totalResults = 247
	const resultsPerPage = 8
	const totalPages = Math.ceil(totalResults / resultsPerPage)

	const isSearchEmpty = searchQuery.trim() === ''

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			{/* Search and Filters */}
			<div className="mb-8 space-y-4">
				<div className="flex flex-col gap-4 md:flex-row">
					<div className="relative flex-1">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
						<Input
							className="h-11 border-border bg-card pl-10"
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search for movies..."
							type="text"
							value={searchQuery}
						/>
					</div>
					<Select>
						<SelectTrigger className="h-11 w-full border-border bg-card md:w-[200px]">
							<SelectValue placeholder="Select genre" />
						</SelectTrigger>
						<SelectContent>
							{GENRES.map((genre) => (
								<SelectItem key={genre} value={genre}>
									{genre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{!isSearchEmpty && (
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground text-sm">
							Showing{' '}
							<span className="font-medium text-foreground">
								{(currentPage - 1) * resultsPerPage + 1}-{Math.min(currentPage * resultsPerPage, totalResults)}
							</span>{' '}
							of <span className="font-medium text-foreground">{totalResults}</span> results
						</p>
					</div>
				)}
			</div>

			{isSearchEmpty ? (
				<div className="flex flex-col items-center justify-center px-4 py-24">
					<div className="mb-6 rounded-full bg-muted p-6">
						<Film className="h-12 w-12 text-muted-foreground" />
					</div>
					<h2 className="mb-2 text-balance text-center font-semibold text-2xl">Start Your Search</h2>
					<p className="max-w-md text-balance text-center text-muted-foreground">
						Enter a movie title in the search bar above to discover films and explore detailed information about each
						one.
					</p>
				</div>
			) : (
				<>
					{/* Movie Grid */}
					<div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{PLACEHOLDER_MOVIES.map((movie) => (
							<MovieCard key={movie.id} movie={movie} />
						))}
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-center gap-2">
						<Button
							className="h-9 w-9"
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							size="icon"
							variant="outline"
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="sr-only">Previous page</span>
						</Button>

						<div className="flex items-center gap-1">
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								let pageNum
								if (totalPages <= 5) {
									pageNum = i + 1
								} else if (currentPage <= 3) {
									pageNum = i + 1
								} else if (currentPage >= totalPages - 2) {
									pageNum = totalPages - 4 + i
								} else {
									pageNum = currentPage - 2 + i
								}

								return (
									<Button
										className="h-9 w-9"
										key={pageNum}
										onClick={() => setCurrentPage(pageNum)}
										size="icon"
										variant={currentPage === pageNum ? 'default' : 'outline'}
									>
										{pageNum}
									</Button>
								)
							})}
						</div>

						<Button
							className="h-9 w-9"
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							size="icon"
							variant="outline"
						>
							<ChevronRight className="h-4 w-4" />
							<span className="sr-only">Next page</span>
						</Button>
					</div>
				</>
			)}
		</div>
	)
}

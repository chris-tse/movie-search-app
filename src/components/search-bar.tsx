import { Search } from 'lucide-react'
import { Suspense, startTransition, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounce } from '@/hooks/use-debounce'

type SearchBarProps = {
	search: string
	genre: string
	genres: string[]
	setGenre: (genre: string) => void
	setSearch: (search: string) => void
	setPage: (page: number) => void
}

const DEBOUNCE_DELAY = 300

export function SearchBar({ search, genre, genres, setGenre, setSearch, setPage }: SearchBarProps) {
	const [localSearch, setLocalSearch] = useState(search)
	const debouncedSearch = useDebounce(localSearch, DEBOUNCE_DELAY)

	useEffect(() => {
		if (debouncedSearch === search) {
			return
		}
		startTransition(() => {
			setSearch(debouncedSearch)
			setPage(1)
		})
	}, [debouncedSearch, search, setSearch, setPage])

	return (
		<div className="flex flex-col gap-4 md:flex-row">
			<div className="relative flex-1">
				<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
				<Input
					className="h-11 border-border bg-card pl-10"
					onChange={(e) => setLocalSearch(e.target.value)}
					placeholder="Search for movies..."
					type="text"
					value={localSearch}
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
					<Select
						onValueChange={(v) => {
							startTransition(() => {
								setGenre(v === 'all' ? '' : v)
								setPage(1)
							})
						}}
						value={genre}
					>
						<SelectTrigger className="h-11 w-full border-border bg-card md:w-[200px]">
							<SelectValue placeholder="Select genre" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem key="all" value="all">
								All Genres
							</SelectItem>
							{genres.map((g) => (
								<SelectItem key={g} value={g}>
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
	)
}

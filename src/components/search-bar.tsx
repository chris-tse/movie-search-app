import { Suspense, startTransition, useEffect, useState } from 'react'
import { RefreshCcw, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { pushCurrentHistory } from '@/features/history'
import { Button } from './ui/button'

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

	useEffect(() => {
		setLocalSearch(search)
	}, [search])

	useEffect(() => {
		const timeout = setTimeout(() => {
		  if (localSearch !== search) {
			pushCurrentHistory({ search: localSearch, genre, page: 1 })
			startTransition(() => {
			  setSearch(localSearch)
			  setPage(1)
			})
		  }
		}, DEBOUNCE_DELAY)
	
		return () => clearTimeout(timeout)
	  }, [localSearch, genre, search, setPage, setSearch])

	return (
		<div className="flex flex-col gap-4 md:flex-row">
			<div className="relative flex-1">
				<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
				<Input
					className="h-11 border-border bg-card pl-10"
					onChange={(e) => setLocalSearch(e.target.value)}
					placeholder="Search for movies..."
					type="text"
					name="search"
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
							pushCurrentHistory({ search, genre: v === 'all' ? '' : v, page: 1 })
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
			<Button
				onClick={() => {
					setGenre('')
					setPage(1)
					setLocalSearch('')
					setSearch('')
				}}
				variant={'ghost'}
			>
				<RefreshCcw className="h-4 w-4" />
				Reset
			</Button>
		</div>
	)
}

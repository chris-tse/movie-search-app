import { useState } from 'react'
import { parse } from 'iso8601-duration'
import { ImageOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { MovieResult } from '@/features/movies/queries'

type MovieCardProps = {
	movie: MovieResult
	onClick?: (id: string) => void
	onHover?: (id: string) => void
}

export function MovieCard({ movie, onClick, onHover }: MovieCardProps) {
	const [imageError, setImageError] = useState(false)

	const posterUrl = !movie.posterUrl || movie.posterUrl === null || imageError ? null : movie.posterUrl

	const duration = movie.duration ? parse(movie.duration) : null
	const formattedDuration = duration ? `${duration.hours}h ${duration.minutes}m` : null

	return (
		<Card
			aria-haspopup="dialog"
			className="group cursor-pointer overflow-hidden border-border bg-card transition-all duration-300 hover:border-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
			data-movie-id={movie.id}
			onClick={() => onClick?.(movie.id)}
			onFocus={() => onHover?.(movie.id)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					onClick?.(movie.id)
				}
			}}
			onMouseEnter={() => onHover?.(movie.id)}
			role="button"
			tabIndex={0}
		>
			<div className="relative aspect-[2/3] overflow-hidden bg-muted">
				{posterUrl ? (
					<img
						alt={movie.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						height={457}
						onError={() => setImageError(true)}
						src={posterUrl}
						width={305}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-muted">
						<ImageOff className="h-10 w-10 text-muted-foreground" />
						<span className="sr-only">No poster available</span>
					</div>
				)}
				<div className="absolute top-3 right-3 text-right [&>*:nth-child(n+2)]:ml-2">
					{movie.genres.map((genre) => (
						<Badge className="bg-background/90 backdrop-blur-sm" key={genre.title} variant="secondary">
							{genre.title}
						</Badge>
					))}
				</div>
			</div>
			<CardContent className="space-y-4 p-3 md:p-4">
				<div>
					<h3 className="mb-1 line-clamp-1 font-semibold text-md leading-tight md:text-lg">{movie.title}</h3>
					<p className="text-muted-foreground text-sm">{movie.datePublished?.split('-')[0] ?? ''}</p>
				</div>

				<p className="line-clamp-2 hidden text-muted-foreground text-sm leading-relaxed md:block">{movie.summary}</p>
			</CardContent>
			<CardFooter className="mt-auto mb-4 px-5">
				<div className="md:mt-6 flex w-full items-center justify-between">
					<div className="flex items-center gap-1">
						<span className="font-medium text-sm">{movie.rating}</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<span className="text-sm">{formattedDuration ?? '-h -m'}</span>
					</div>
				</div>
			</CardFooter>
		</Card>
	)
}

import { useState } from 'react'
import { parse } from 'iso8601-duration'
import { ImageOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Movie } from '@/features/movies/queries'

type MovieCardProps = {
	movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
	const [imageError, setImageError] = useState(false)

	const posterUrl = !movie.posterUrl || movie.posterUrl === null || imageError ? null : movie.posterUrl

	const duration = movie.duration ? parse(movie.duration) : null
	const formattedDuration = duration ? `${duration.hours}h ${duration.minutes}m` : null

	return (
		<Card className="group overflow-hidden border-border bg-card transition-all duration-300 hover:border-muted-foreground/50">
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
				<div className="absolute top-3 right-3 [&>*:nth-child(n+2)]:ml-2">
					{movie.genres.map((genre) => (
						<Badge className="bg-background/90 backdrop-blur-sm" key={genre.title} variant="secondary">
							{genre.title}
						</Badge>
					))}
				</div>
			</div>
			<CardContent className="space-y-3 p-4">
				<div>
					<h3 className="mb-1 line-clamp-1 font-semibold text-lg leading-tight">{movie.title}</h3>
					<p className="text-muted-foreground text-sm">{movie.datePublished?.split('-')[0] ?? ''}</p>
				</div>

				<p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">{movie.summary}</p>

				<div className="mt-6 flex items-center justify-between">
					<div className="flex items-center gap-1">
						<span className="font-medium text-sm">{movie.rating}</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						{/* <Clock className="h-4 w-4" /> */}
						<span className="text-sm">{formattedDuration ?? '-h -m'}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

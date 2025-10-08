import { Clock, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

/**
 *     {
      "id": "017UwRkfdbbqWDQD99T7OL",
      "title": "12 Years a Slave",
      "posterUrl": "https://m.media-amazon.com/images/M/MV5BMjExMTEzODkyN15BMl5BanBnXkFtZTcwNTU4NTc4OQ@@._V1_.jpg",
      "rating": "14A"
    },
 */
type Movie = {
	id: string
	title: string
	posterUrl: string
	rating: string
	duration: string
	year: number
	genre: string
	summary: string
}

type MovieCardProps = {
	movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
	return (
		<Card className="group overflow-hidden border-border bg-card transition-all duration-300 hover:border-muted-foreground/50">
			<div className="relative aspect-[2/3] overflow-hidden bg-muted">
				<img
					alt={movie.title}
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					height={457}
					src={movie.posterUrl || 'https://placehold.co/305x457'}
					width={305}
				/>
				<div className="absolute top-3 right-3">
					<Badge className="bg-background/90 backdrop-blur-sm" variant="secondary">
						{movie.genre}
					</Badge>
				</div>
			</div>
			<CardContent className="space-y-3 p-4">
				<div>
					<h3 className="mb-1 line-clamp-1 font-semibold text-lg leading-tight">{movie.title}</h3>
					<p className="text-muted-foreground text-sm">{movie.year}</p>
				</div>

				<p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">{movie.summary}</p>

				<div className="flex items-center justify-between border-border border-t pt-2">
					<div className="flex items-center gap-1">
						<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
						<span className="font-medium text-sm">{movie.rating}</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<Clock className="h-4 w-4" />
						<span className="text-sm">{movie.duration}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

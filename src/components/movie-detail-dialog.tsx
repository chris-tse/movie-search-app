import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { parse } from 'iso8601-duration'
import { ImageOff } from 'lucide-react'
import { RatingStars } from '@/components/rating-stars'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { movieDetailQuery } from '@/features/movies/queries'

export function MovieDetailDialog({
	movieId,
	open,
	onOpenChange,
}: {
	movieId: string | null
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const queryOptions = useMemo(() => movieDetailQuery(movieId), [movieId])
	const { data, isPending, isError } = useQuery(queryOptions)

	if (isPending) {
		return (
			<div className="space-y-2">
				<div className="h-4 w-40 animate-pulse rounded bg-muted" />
				<div className="h-3 w-full animate-pulse rounded bg-muted" />
				<div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
			</div>
		)
	}

	if (isError) {
		return (
			<div className="space-y-2">
				<p className="text-destructive text-sm">Failed to load details.</p>
			</div>
		)
	}

	if (!data) {
		return (
			<div className="space-y-2">
				<p className="text-muted-foreground text-sm">No details found.</p>
			</div>
		)
	}

	const duration = data.duration ? parse(data.duration) : null
	const formattedDuration = duration ? `${duration.hours}h ${duration.minutes}m` : null
	const year = data.datePublished ? data.datePublished.split('-')[0] : null

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{data.title || 'Movie Details'}</DialogTitle>
					{data.summary && <DialogDescription className="line-clamp-3">{data.summary}</DialogDescription>}
				</DialogHeader>
				<div className="grid gap-6 md:grid-cols-[180px_1fr]">
					<div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-muted">
						<div className="flex h-full w-full items-center justify-center">
							<ImageOff className="h-8 w-8 text-muted-foreground" />
							<span className="sr-only">No poster available</span>
						</div>
					</div>
					<div className="space-y-4">
						<div className="space-y-4">
							<div className="flex flex-wrap gap-2">
								{data.genres.map((g) => (
									<Badge key={g.id} variant="secondary">
										{g.title}
									</Badge>
								))}
							</div>
							{data.ratingValue != null && (
								<div className="flex items-center gap-2">
									<RatingStars rating={data.ratingValue} />
									<span className="text-muted-foreground text-xs">({data.ratingValue})</span>
								</div>
							)}
							<div className="flex flex-wrap gap-2">
								{[year, data.rating, formattedDuration].filter(Boolean).map((item) => (
									<span
										className="inline-flex items-center rounded-sm border px-2 py-0.5 font-medium text-muted-foreground text-xs"
										key={item as string}
									>
										{item}
									</span>
								))}
							</div>
							{data.summary && <p className="text-sm leading-relaxed">{data.summary}</p>}
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="space-y-1">
									<p className="font-medium text-sm">Directors</p>
									<p className="text-muted-foreground text-xs">{data.directors?.join(', ') || '-'}</p>
								</div>
								<div className="space-y-1">
									<p className="font-medium text-sm">Writers</p>
									<p className="text-muted-foreground text-xs">{data.writers?.join(', ') || '-'}</p>
								</div>
								<div className="space-y-1 sm:col-span-2">
									<p className="font-medium text-sm">Main Cast</p>
									<p className="text-muted-foreground text-xs">{data.mainActors?.join(', ') || '-'}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

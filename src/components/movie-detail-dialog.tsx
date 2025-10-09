import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { parse } from 'iso8601-duration'
import { ImageOff } from 'lucide-react'
import { RatingStars } from '@/components/rating-stars'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { movieDetailQuery } from '@/features/movies/queries'

function formatDuration(iso: string | null) {
	if (!iso) return null
	try {
		const d = parse(iso)
		const h = d.hours ?? 0
		const m = d.minutes ?? 0
		if (!(h || m)) return null
		return `${h ? `${h}h` : ''} ${m ? `${m}m` : ''}`.trim()
	} catch (_) {
		return null
	}
}

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
	const { data, isPending, isError, refetch } = useQuery(queryOptions)

	const detail = data
	const duration = formatDuration(detail?.duration ?? null)
	const year = detail?.datePublished ? detail.datePublished.split('-')[0] : null

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{detail?.title || 'Movie Details'}</DialogTitle>
					{detail?.summary && <DialogDescription className="line-clamp-3">{detail.summary}</DialogDescription>}
				</DialogHeader>
				<div className="grid gap-6 md:grid-cols-[180px_1fr]">
					<div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-muted">
						{isPending ? (
							<div className="h-full w-full animate-pulse bg-muted" />
						) : detail?.posterUrl ? (
							<img alt={detail.title} className="h-full w-full object-cover" src={detail.posterUrl} />
						) : (
							<div className="flex h-full w-full items-center justify-center">
								<ImageOff className="h-8 w-8 text-muted-foreground" />
								<span className="sr-only">No poster available</span>
							</div>
						)}
					</div>
					<div className="space-y-4">
						{isPending && (
							<div className="space-y-2">
								<div className="h-4 w-40 animate-pulse rounded bg-muted" />
								<div className="h-3 w-full animate-pulse rounded bg-muted" />
								<div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
							</div>
						)}
						{isError && (
							<div className="space-y-2">
								<p className="text-destructive text-sm">Failed to load details.</p>
								<button
									className="rounded bg-primary px-3 py-1 text-primary-foreground text-sm"
									onClick={() => refetch()}
								>
									Retry
								</button>
							</div>
						)}
						{detail && !isPending && !isError && (
							<div className="space-y-4">
								<div className="flex flex-wrap gap-2">
									{detail.genres.map((g) => (
										<Badge key={g.id} variant="secondary">
											{g.title}
										</Badge>
									))}
								</div>
								{detail.ratingValue != null && (
									<div className="flex items-center gap-2">
										<RatingStars rating={detail.ratingValue} />
										<span className="text-muted-foreground text-xs">({detail.ratingValue})</span>
									</div>
								)}
								<div className="flex flex-wrap gap-2">
									{[year, detail.rating, duration].filter(Boolean).map((item) => (
										<span className="inline-flex items-center rounded-sm border px-2 py-0.5 font-medium text-muted-foreground text-xs">
											{item}
										</span>
									))}
								</div>
								{detail.summary && <p className="text-sm leading-relaxed">{detail.summary}</p>}
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-1">
										<p className="font-medium text-sm">Directors</p>
										<p className="text-muted-foreground text-xs">{detail.directors.join(', ') || '-'}</p>
									</div>
									<div className="space-y-1">
										<p className="font-medium text-sm">Writers</p>
										<p className="text-muted-foreground text-xs">{detail.writers.join(', ') || '-'}</p>
									</div>
									<div className="space-y-1 sm:col-span-2">
										<p className="font-medium text-sm">Main Cast</p>
										<p className="text-muted-foreground text-xs">{detail.mainActors.join(', ') || '-'}</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

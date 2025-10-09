import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type RatingStarsProps = {
	rating: number
	outOf?: number
	stars?: number
	size?: number
}

export function RatingStars({ rating, outOf = 10, stars = 5, size = 16 }: RatingStarsProps) {
	const normalized = (rating / outOf) * stars
	const rounded = Math.round(normalized * 2) / 2
	const fullStars = Math.floor(rounded)
	const hasHalf = rounded % 1 !== 0

	return (
		<div className="flex items-center gap-0.5">
			{Array.from({ length: stars }).map((_, i) => {
				const isFull = i < fullStars
				const isHalf = hasHalf && i === fullStars

				return (
					<div className="relative" key={`star-${i}`} style={{ width: size, height: size }}>
						<Star
							className={cn('absolute inset-0 text-muted-foreground', isFull || isHalf ? 'text-yellow-400' : '')}
							height={size}
							strokeWidth={1.5}
							width={size}
						/>

						{(isFull || isHalf) && (
							<Star
								className="absolute inset-0 fill-yellow-400 text-yellow-400"
								height={size}
								strokeWidth={1.5}
								style={
									isHalf
										? {
												maskImage: 'linear-gradient(to right, black 50%, transparent 50%)',
												WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 50%)',
											}
										: {}
								}
								width={size}
							/>
						)}
					</div>
				)
			})}
		</div>
	)
}

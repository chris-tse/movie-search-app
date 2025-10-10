import { cn } from '@/lib/utils'

export function LoadingShell({
	heading,
	subheading,
	className,
}: {
	heading: string
	subheading: string
	className?: string
}) {
	return (
		<div className={cn('flex flex-col items-center justify-center gap-4 py-16 text-center', className)}>
			<div
				aria-hidden="true"
				className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
			/>
			<div className="space-y-1">
				<h2 className="block font-medium">{heading}</h2>
				<p className="text-muted-foreground text-sm">{subheading}</p>
			</div>
		</div>
	)
}

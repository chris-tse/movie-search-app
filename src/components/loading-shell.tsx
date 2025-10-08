export function LoadingShell() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
			<div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
			<div className="space-y-1">
				<output className="block font-medium">Preparing your movie search experience</output>
				<p className="text-muted-foreground text-sm">Fetching genres, trending titles, and more…</p>
			</div>
		</div>
	)
}

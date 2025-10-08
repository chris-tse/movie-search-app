export function LoadingShell() {
	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4 py-16 text-center">
			<div
				aria-hidden="true"
				className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
			/>
			<div className="space-y-1">
				<output className="block font-medium">Preparing your movie search experience</output>
				<p className="text-muted-foreground text-sm">What will you watch next?</p>
			</div>
		</div>
	)
}

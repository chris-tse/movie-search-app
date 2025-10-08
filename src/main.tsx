import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { App } from './app.tsx'
import { rest } from './lib/api/rest.ts'
import { queryClient } from './lib/query/client'

async function checkHealth() {
	try {
		const healthCheckResponse = await rest<{ contentful: boolean }>('/healthcheck', { needsToken: false })
		return healthCheckResponse.contentful
	} catch (error) {
		console.error('Healthcheck failed', error)
		return false
	}
}

const isApiHealthy = await checkHealth()

createRoot(document.getElementById('root') || document.createElement('div')).render(
	<StrictMode>
		<NuqsAdapter>
			<QueryClientProvider client={queryClient}>
				<App isApiHealthy={isApiHealthy} />
			</QueryClientProvider>
		</NuqsAdapter>
	</StrictMode>,
)

import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app.tsx'
import { queryClient } from './lib/query/client'

import './index.css'

createRoot(document.getElementById('root') || document.createElement('div')).render(
	<StrictMode>
		<NuqsAdapter>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</NuqsAdapter>
	</StrictMode>,
)

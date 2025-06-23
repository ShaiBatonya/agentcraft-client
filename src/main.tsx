import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/context/query.context'
import './styles/global.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import { toastConfig } from '@/stores/toast.store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <div className="text-center">
              <p className="text-white font-medium">AgentCraft</p>
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          </div>
        </div>
      }>
        <App />
        
        {/* Professional Toast System */}
        <Toaster
          position={toastConfig.position}
          toastOptions={{
            ...toastConfig,
            className: 'react-hot-toast',
          }}
          containerStyle={{
            top: 80, // Account for header height
            right: 16,
            left: 16,
            zIndex: 9999,
          }}
        />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>,
)

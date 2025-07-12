import { FallbackProps } from 'react-error-boundary'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <pre className="text-sm text-red-600 bg-red-100 rounded p-2 mb-2 max-w-full overflow-x-auto">
        {error?.message || 'An unexpected error occurred.'}
      </pre>
      <button
        className="btn btn-primary"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  )
}

export default ErrorFallback 
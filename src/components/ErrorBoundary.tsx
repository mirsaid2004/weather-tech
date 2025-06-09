import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div
      role="alert"
      className="p-6 border border-red-500 rounded-lg bg-red-50 text-red-800 font-mono max-w-xl mx-auto my-8 shadow-md"
    >
      <h2 className="text-2xl font-bold mb-3">Something went wrong!</h2>
      <p className="font-semibold mb-2">Error Message:</p>
      <pre className="whitespace-pre-wrap break-words mb-4 text-red-700 bg-red-100 p-3 rounded overflow-auto text-sm">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md cursor-pointer
                   hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75
                   transition duration-200 ease-in-out"
      >
        Try again
      </button>
    </div>
  );
}

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const logError = (error: Error, info: React.ErrorInfo) => {
    console.error("Caught an error:", error, info);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
      onReset={(details) => {
        console.log("Error boundary was reset. Details:", details);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

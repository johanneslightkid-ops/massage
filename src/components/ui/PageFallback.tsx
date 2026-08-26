export function PageFallback() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-6 w-40 rounded-full" />
      <div className="skeleton mt-6 h-12 w-3/4 rounded-2xl" />
      <div className="skeleton mt-3 h-12 w-1/2 rounded-2xl" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton h-56 rounded-4xl" />
        ))}
      </div>
    </div>
  )
}

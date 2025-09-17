"use client"

export function Background() {
  return (
    <div data-testid="background">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
    </div>
  )

}
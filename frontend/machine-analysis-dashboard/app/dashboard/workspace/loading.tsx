export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4 text-center">
        <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm text-muted-foreground">Carregando ambiente de trabalho...</p>
      </div>
    </div>
  )
}

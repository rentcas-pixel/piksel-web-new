export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50/80">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#1329d4]"
          aria-hidden
        />
        <p className="text-sm text-gray-500">Kraunama...</p>
      </div>
    </div>
  );
}

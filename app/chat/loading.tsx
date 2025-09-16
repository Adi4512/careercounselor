export default function Loading() {
  return (
    <div className="min-h-screen bg-[#212121] flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-gray-600 border-t-white" />
        <p className="text-gray-200">Opening chat…</p>
      </div>
    </div>
  );
}



import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#090B0E] text-[#F0F6FC] font-mono text-center p-6 select-none">
      <div className="text-4xl font-bold text-[#58A6FF] mb-2">404</div>
      <h2 className="text-sm font-semibold mb-2">Environment Not Found</h2>
      <p className="text-xs text-[#8B949E] max-w-sm mb-6">
        The requested 3D component or laboratory route does not exist in the active catalog.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-xs font-medium text-[#F0F6FC] border border-[#30363D] transition-colors"
      >
        Return to 3D Lab
      </Link>
    </div>
  );
}

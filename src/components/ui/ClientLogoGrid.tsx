export default function ClientLogoGrid({ clients }: { clients: string[] }) {
  if (clients.length === 0) {
    return (
      <p className="text-white/50 text-sm">
        Client logos will appear here once approved for public display.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
      {clients.map((name) => (
        <div
          key={name}
          className="flex h-16 items-center justify-center rounded border border-white/10 text-white/40 text-sm font-semibold grayscale hover:grayscale-0 hover:text-white/70 transition-all"
        >
          {name}
        </div>
      ))}
    </div>
  );
}

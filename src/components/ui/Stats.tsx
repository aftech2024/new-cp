interface Stat {
  value: string;
  label: string;
}

export default function Stats({ items }: { items: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {items.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1">
          <dt className="sr-only">{stat.label}</dt>
          <dd className="font-display text-3xl md:text-4xl font-extrabold">{stat.value}</dd>
          <span className="text-sm text-muted">{stat.label}</span>
        </div>
      ))}
    </dl>
  );
}

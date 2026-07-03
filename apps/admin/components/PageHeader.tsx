export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>{description ? <p className="mt-1 max-w-2xl text-sm text-amlbt-text-muted">{description}</p> : null}</div>{action}</div>;
}

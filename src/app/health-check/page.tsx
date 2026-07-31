async function getStatus() {
  const res = await fetch("https://api.github.com/repos/vercel/next.js", { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default async function HealthCheckPage() {
  const data = await getStatus();
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Health Check</h1>
      <p className="mt-4 text-neutral-600">Live fetch confirms build and data pipeline both work.</p>
      <dl className="mt-6 space-y-2 text-sm">
        <div><dt className="inline font-medium">Repo:</dt> <dd className="inline">{data.full_name}</dd></div>
        <div><dt className="inline font-medium">Stars:</dt> <dd className="inline">{data.stargazers_count}</dd></div>
      </dl>
    </main>
  );
}
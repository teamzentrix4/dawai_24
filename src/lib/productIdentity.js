export async function lockProductCreation(tx) {
  await tx.$queryRaw`SELECT 1::int FROM pg_advisory_xact_lock(873421, 1)`;
}

// Both product creation paths reserve their IDs inside the write transaction.
export async function reserveProductIds(tx, count) {
  await lockProductCreation(tx);
  const [{ highest }] = await tx.$queryRaw`
    SELECT COALESCE(MAX(substring(id FROM 5)::numeric), 0)::text AS highest
    FROM "Product" WHERE id ~ '^PRX-[0-9]+$'
  `;
  const first = BigInt(highest) + 1n;
  return Array.from({ length: count }, (_, index) => "PRX-" + String(first + BigInt(index)).padStart(5, "0"));
}

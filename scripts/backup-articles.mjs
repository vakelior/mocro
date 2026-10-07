// Backup Mocro articles + categories from Supabase to JSON.
const SUPABASE_URL = 'https://attnhjjflhgrlvxjeyig.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dG5oampmbGhncmx2eGpleWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNzE1ODcsImV4cCI6MjEwNDY0NzU4N30.8kuaYRru0f-Asb2WBBlVr2bDUOawARb5-nQeJuQeJrs';

const headers = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` };

async function exportTable(table, out) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers });
  const data = await res.json();
  const { writeFileSync } = await import('node:fs');
  writeFileSync(out, JSON.stringify(data, null, 2));
  console.log(`✅ ${table}: ${data.length} rows -> ${out}`);
}

await exportTable('articles', 'backup/articles.json');
await exportTable('categories', 'backup/categories.json');

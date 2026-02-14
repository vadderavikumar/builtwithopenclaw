export function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://builtwithopenclaw.com";
  return new Response(
    `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /claim/
Disallow: /get-featured/success
Sitemap: ${base}/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain" } }
  );
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

    const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
    if (!match) return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });

    const [, owner, repo] = match;
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const [repoRes, readmeRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers }),
    ]);

    if (!repoRes.ok) return NextResponse.json({ error: "Repo not found" }, { status: 404 });

    const repoData = await repoRes.json();
    let readme = "";
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      if (readmeData.content) {
        readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
      }
    }

    return NextResponse.json({
      name: repoData.name,
      description: repoData.description ?? "",
      homepage: repoData.homepage ?? repoData.html_url,
      url: repoData.html_url,
      readme: readme.slice(0, 2000),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}

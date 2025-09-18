export default {
  async fetch(request) {
    const { searchParams } = new URL(request.url);
    const slug = (searchParams.get("slug") || "").trim();
    if (!slug) return new Response("missing slug", { status: 400 });

    // GitHub 本体へ HEAD。リダイレクトも追跡
    const target = `https://github.com/enterprises/${encodeURIComponent(slug)}`;
    let resp;
    try {
      resp = await fetch(target, { method: "HEAD", redirect: "follow" });
    } catch {
      return new Response(JSON.stringify({ ok: false, status: 0 }), {
        status: 200,
        headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      });
    }

    const exists = [200, 301, 302].includes(resp.status);
    return new Response(JSON.stringify({ ok: true, exists, status: resp.status }), {
      status: 200,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
    });
  }
}

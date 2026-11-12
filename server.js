const express = require("express");
const { spawn } = require("node:child_process");
const archiver = require("archiver");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");

const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const ALLOWED_HOSTS = new Set([
  "tiktok.com", "www.tiktok.com", "vm.tiktok.com", "vt.tiktok.com",
  "instagram.com", "www.instagram.com"
]);

function validPlatformUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && ALLOWED_HOSTS.has(u.hostname) &&
      (u.hostname.includes("tiktok.com") || u.hostname.includes("instagram.com"));
  } catch { return false; }
}

app.post("/api/download", async (req, res) => {
  const url = String(req.body?.url || "").trim();
  if (!validPlatformUrl(url)) {
    return res.status(400).json({ error: "Masukkan link TikTok atau Instagram HTTPS yang valid." });
  }

  // yt-dlp must be installed on the server. It does not bypass private accounts,
  // login walls, DRM, or other access controls.
  const workDir = path.join(os.tmpdir(), "gabuts-" + crypto.randomUUID());
  fs.mkdirSync(workDir, { recursive: true });
  const outputTemplate = path.join(workDir, "%(title).100B-%(id)s.%(ext)s");

  const child = spawn("yt-dlp", [
    "--no-playlist", "--restrict-filenames", "--no-warnings",
    "--output", outputTemplate, "--", url
  ], { stdio: ["ignore", "ignore", "pipe"] });

  let stderr = "";
  child.stderr.on("data", chunk => { stderr += chunk.toString(); });
  child.on("error", async () => {
    fs.rmSync(workDir, { recursive: true, force: true });
    if (!res.headersSent) res.status(503).json({ error: "yt-dlp belum terpasang di server." });
  });

  child.on("close", code => {
    if (code !== 0) {
      fs.rmSync(workDir, { recursive: true, force: true });
      if (!res.headersSent) res.status(422).json({
        error: "Media tidak dapat diambil. Pastikan konten publik dan kamu punya izin untuk menyimpannya."
      });
      return;
    }

    const items = fs.readdirSync(workDir).filter(name =>
      fs.statSync(path.join(workDir, name)).isFile()
    );
    if (!items.length) {
      fs.rmSync(workDir, { recursive: true, force: true });
      return res.status(404).json({ error: "Tidak ada file media yang ditemukan." });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="GABUTS-download.zip"');
    const archive = archiver("zip", { zlib: { level: 6 } });
    archive.on("error", () => {
      fs.rmSync(workDir, { recursive: true, force: true });
      if (!res.headersSent) res.status(500).end();
    });
    res.on("close", () => fs.rmSync(workDir, { recursive: true, force: true }));
    archive.pipe(res);
    for (const item of items) archive.file(path.join(workDir, item), { name: item });
    archive.finalize();
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`GABUTS berjalan di http://localhost:${port}`));

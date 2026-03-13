import fs from "fs"
import path from "path"
import https from "https"
import http from "http"

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http
    lib.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = ""
      res.on("data", (chunk) => (data += chunk))
      res.on("end", () => resolve(data))
    }).on("error", reject)
  })
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

function getDate() {
  const now = new Date()
  return now.toISOString().replace("Z", "").slice(0, 19)
}

function extractMeta(html, property) {
  const m = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`, "i"))
    || html.match(new RegExp(`<meta name="${property}" content="([^"]*)"`, "i"))
  return m ? m[1] : ""
}

function extractVideoUrl(html, quality) {
  const m = html.match(new RegExp(`<source src="([^"]+)" type="video/mp4" title="${quality}"`, "i"))
  return m ? m[1] : ""
}

function extractTags(html) {
  const tags = []
  const regex = /<a href='[^']*\/categories\/[^']*' class="tag">([^<]+)<\/a>/gi
  let m
  while ((m = regex.exec(html)) !== null) {
    tags.push(m[1].trim())
  }
  return [...new Set(tags)]
}

function extractVideoLinks(html, baseUrl) {
  const links = []
  const regex = /href="(https:\/\/www\.xerotica\.com\/video\/[^"]+\.html)"/gi
  let m
  while ((m = regex.exec(html)) !== null) {
    if (!links.includes(m[1])) links.push(m[1])
  }
  return links
}

async function processVideo(videoUrl, index, total, category) {
  console.log(`\n[${index + 1}/${total}] Fetching: ${videoUrl}`)
  const html = await fetchUrl(videoUrl)

  const title = extractMeta(html, "og:title")
  const poster = extractMeta(html, "og:image")
  const src720 = extractVideoUrl(html, "720p")
  const src360 = extractVideoUrl(html, "360p")
  const src180 = extractVideoUrl(html, "180p")
  const videoSrc = src720 || src360 || src180

  if (!title || !videoSrc) {
    console.log(`  ⚠️  Skipping — missing title or video source`)
    return false
  }

  const tags = extractTags(html)
  const slug = slugify(title)
  const postDir = path.join("./src/content/posts", slug)
  const postFile = path.join(postDir, "index.md")

  if (fs.existsSync(postFile)) {
    console.log(`  ⏭️  Already exists, skipping: ${slug}`)
    return false
  }

  fs.mkdirSync(postDir, { recursive: true })

  const tagsYaml = tags.map((t) => `"${t}"`).join(", ")

  const sources = [src720, src360, src180].filter(Boolean)
  const sourceLines = sources.map((s) => `  <source src="${s}" type="video/mp4">`).join("\n")

  const content = `---
title: "${title.replace(/"/g, '\\"')}"
description: ""
published: ${getDate()}
image: "${poster}"
category: "${category}"
tags: [${tagsYaml}]
draft: false
lang: ''
---

👉 [Join us on WhatsApp](https://vibesnestz.vercel.app/)  
👉 [Follow on Telegram](https://t.me/+62PxgSxDcZphZmFk)  
🔞 [Watch Her Live on Cam](https://redirecting-kappa.vercel.app/)  

<video controls width="100%" poster="${poster}">
${sourceLines}
  Your browser does not support the video tag.
</video>
`

  fs.writeFileSync(postFile, content)
  console.log(`  ✅ Created: ${postFile}`)
  return true
}

async function main() {
  const args = process.argv.slice(2)
  if (!args[0]) {
    console.error("Usage: node scripts/scrape-xerotica.js <category-page-url> [category-name]")
    console.error("Example: node scripts/scrape-xerotica.js https://www.xerotica.com/categories/20/ebony/page1.html Ebony")
    process.exit(1)
  }

  const pageUrl = args[0]
  const categoryName = args[1] || "Uncategorized"

  console.log(`\nFetching category page: ${pageUrl}`)
  const html = await fetchUrl(pageUrl)
  const videoLinks = extractVideoLinks(html)

  if (!videoLinks.length) {
    console.error("No video links found on that page.")
    process.exit(1)
  }

  console.log(`Found ${videoLinks.length} videos. Processing...\n`)

  let created = 0
  let skipped = 0

  for (let i = 0; i < videoLinks.length; i++) {
    const ok = await processVideo(videoLinks[i], i, videoLinks.length, categoryName)
    if (ok) created++
    else skipped++
    await new Promise((r) => setTimeout(r, 300))
  }

  console.log(`\n=== Done ===`)
  console.log(`Created: ${created} posts`)
  console.log(`Skipped: ${skipped} (already exist or missing data)`)
}

main()

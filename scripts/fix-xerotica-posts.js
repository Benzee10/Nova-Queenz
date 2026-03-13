import fs from "fs"
import path from "path"
import https from "https"
import http from "http"

function fetchUrl(url, retries = 4, delay = 2000) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http
    const req = lib.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = ""
      res.on("data", (chunk) => (data += chunk))
      res.on("end", () => resolve(data))
    })
    req.on("error", async (err) => {
      if (retries > 0) {
        console.log(`  ↩️  Retrying in ${delay / 1000}s... (${retries} left)`)
        await new Promise((r) => setTimeout(r, delay))
        fetchUrl(url, retries - 1, delay * 2).then(resolve).catch(reject)
      } else {
        reject(err)
      }
    })
    req.setTimeout(15000, () => {
      req.destroy()
    })
  })
}

function extractMeta(html, property) {
  const m = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`, "i"))
    || html.match(new RegExp(`<meta name="${property}" content="([^"]*)"`, "i"))
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

function extractVideoLinks(html) {
  const links = []
  const regex = /href="(https:\/\/www\.xerotica\.com\/video\/[^"]+\.html)"/gi
  let m
  while ((m = regex.exec(html)) !== null) {
    if (!links.includes(m[1])) links.push(m[1])
  }
  return links
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

function iframeBlock(videoUrl) {
  return `<div style="position:relative;padding-top:56.25%;width:100%;">
  <iframe
    src="${videoUrl}"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
    allowfullscreen
    scrolling="no"
  ></iframe>
</div>`
}

async function fixPost(videoUrl, index, total) {
  console.log(`\n[${index + 1}/${total}] Processing: ${videoUrl}`)
  const html = await fetchUrl(videoUrl)

  const title = extractMeta(html, "og:title")
  const poster = extractMeta(html, "og:image")
  const tags = extractTags(html)

  if (!title) {
    console.log(`  ⚠️  Skipping — could not fetch title`)
    return false
  }

  const slug = slugify(title)
  const postFile = path.join("./src/content/posts", slug, "index.md")

  if (!fs.existsSync(postFile)) {
    console.log(`  ⏭️  Post not found, skipping: ${slug}`)
    return false
  }

  const existing = fs.readFileSync(postFile, "utf-8")

  if (existing.includes("<iframe")) {
    console.log(`  ✓  Already using iframe, skipping`)
    return false
  }

  const linksBlock = `👉 [Join us on WhatsApp](https://vibesnestz.vercel.app/)  
👉 [Follow on Telegram](https://t.me/+62PxgSxDcZphZmFk)  
🔞 [Watch Her Live on Cam](https://redirecting-kappa.vercel.app/)  `

  const newContent = existing.replace(
    /<video[\s\S]*?<\/video>/i,
    iframeBlock(videoUrl)
  )

  if (newContent === existing) {
    console.log(`  ⚠️  No <video> tag found to replace`)
    return false
  }

  fs.writeFileSync(postFile, newContent)
  console.log(`  ✅ Fixed: ${postFile}`)
  return true
}

async function main() {
  const args = process.argv.slice(2)
  if (!args[0]) {
    console.error("Usage: node scripts/fix-xerotica-posts.js <category-page-url>")
    process.exit(1)
  }

  const pageUrl = args[0]
  console.log(`\nFetching category page: ${pageUrl}`)
  const html = await fetchUrl(pageUrl)
  const videoLinks = extractVideoLinks(html)

  if (!videoLinks.length) {
    console.error("No video links found on that page.")
    process.exit(1)
  }

  console.log(`Found ${videoLinks.length} videos. Fixing posts...\n`)

  let fixed = 0
  let skipped = 0

  for (let i = 0; i < videoLinks.length; i++) {
    try {
      const ok = await fixPost(videoLinks[i], i, videoLinks.length)
      if (ok) fixed++
      else skipped++
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`)
      skipped++
    }
    await new Promise((r) => setTimeout(r, 800))
  }

  console.log(`\n=== Done ===`)
  console.log(`Fixed: ${fixed} posts`)
  console.log(`Skipped: ${skipped}`)
}

main()

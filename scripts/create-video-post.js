import fs from "fs"
import path from "path"
import readline from "readline"

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((res) => rl.question(q, res))

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function getDate() {
  const now = new Date()
  return now.toISOString().replace("Z", "").slice(0, 19)
}

async function main() {
  console.log("\n=== Create Video Post ===\n")

  const videoUrl = (await ask("Video URL: ")).trim()
  if (!videoUrl) { console.error("Video URL is required."); process.exit(1) }

  const posterUrl = (await ask("Thumbnail/Poster URL (leave blank to use none): ")).trim()
  const title = (await ask("Post title: ")).trim()
  if (!title) { console.error("Title is required."); process.exit(1) }

  const description = (await ask("Description: ")).trim()
  const category = (await ask("Category (e.g. Nova Queenz): ")).trim()
  const tagsInput = (await ask("Tags (comma-separated, e.g. blowjob,latina,Big Ass): ")).trim()
  const tags = tagsInput ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean) : []

  const defaultSlug = slugify(title)
  const slugInput = (await ask(`Slug/folder name [${defaultSlug}]: `)).trim()
  const slug = slugInput || defaultSlug

  rl.close()

  const postDir = path.join("./src/content/posts", slug)
  const postFile = path.join(postDir, "index.md")

  if (fs.existsSync(postFile)) {
    console.error(`\nError: Post "${slug}" already exists at ${postFile}`)
    process.exit(1)
  }

  fs.mkdirSync(postDir, { recursive: true })

  const tagsYaml = tags.map((t) => `"${t}"`).join(", ")
  const posterLine = posterUrl ? `image: "${posterUrl}"` : `image: ""`

  const videoBlock = posterUrl
    ? `<video controls width="100%" poster="${posterUrl}">\n  <source src="${videoUrl}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>`
    : `<video controls width="100%">\n  <source src="${videoUrl}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>`

  const content = `---
title: "${title}"
description: "${description}"
published: ${getDate()}
${posterLine}
category: "${category}"
tags: [${tagsYaml}]
draft: false
lang: ''
---

👉 [Join us on WhatsApp](https://vibesnestz.vercel.app/)  
👉 [Follow on Telegram](https://t.me/+62PxgSxDcZphZmFk)  
🔞 [Watch Her Live on Cam](https://redirecting-kappa.vercel.app/)  

${videoBlock}
`

  fs.writeFileSync(postFile, content)
  console.log(`\n✅ Post created at: ${postFile}`)
}

main()

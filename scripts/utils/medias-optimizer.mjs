// import { log } from "console"
import fs from "fs"
import path from "path"
import sharp from "sharp"

const resizeAndConvertToWebp = async (filePath, folderPath) => {
  let width = 1920
  let height = null
  if (folderPath.includes("photographers")) {
    width = height = 200
  }
  const imageBuffer = await sharp(filePath).resize({ width, height, fit: "cover" }).webp().toBuffer()
  await fs.promises.writeFile(filePath.replace(/\.(jpg|jpeg|png)$/i, ".webp"), imageBuffer)
}

const generatePlaceholder = async (filePath) => {
  const imageBuffer = await sharp(filePath).resize({ width: 20 }).blur().toFormat("webp").toBuffer()
  await fs.promises.writeFile(filePath.replace(/\.(jpg|jpeg|png)$/i, ".min.webp"), imageBuffer)
}

const processFolder = async (folderPath) => {
  const files = await fs.promises.readdir(folderPath, { withFileTypes: true })
  let count = 0
  let total = files.filter((file) => !file.isDirectory() && /\.(jpg|jpeg|png)$/i.test(file.name)).length
  for (const file of files) {
    const filePath = path.join(folderPath, file.name)
    const webpFilePath = path.join(folderPath, file.name.replace(/\.(jpg|jpeg|png)$/i, ".webp"))
    const minWebpFilePath = path.join(folderPath, file.name.replace(/\.(jpg|jpeg|png)$/i, ".min.webp"))
    // Check if file is in directory and already processed
    if (file.isDirectory()) {
      console.log(`\nProcesse ${filePath} folder: ${total} images to process\n`)
      await processFolder(filePath)
    } else if (/\.(jpg|jpeg|png)$/i.test(file.name)) {
      try {
        await fs.promises.access(webpFilePath)
        await fs.promises.access(minWebpFilePath)
        console.log(`⏭️  Skipped already processed image: ${filePath}`)
      } catch (error) {
        await resizeAndConvertToWebp(filePath, folderPath)
        await generatePlaceholder(filePath)
        count++
        console.log(`✅ Processed image (${count}/${total}): ${filePath} => .webp | .min.webp`)
      }
    }
  }
}

const sourceFolder = "./assets/"

const run = async () => {
  try {
    console.log("\n=============================================\n")
    console.log("SHARP MEDIAS OPTIMIZER")
    console.log("\n=============================================\n")
    console.log("\nStarting image processing... 🚀\n")
    await processFolder(path.join(sourceFolder, "photographers"))
    console.log("\n")
    await processFolder(path.join(sourceFolder, "medias"))
    console.log("\n")
    await processFolder(path.join(sourceFolder, "images"))
    console.log("\n")
    console.log("Image processing complete ! 🎉")
    console.log("\n")
  } catch (error) {
    console.error(error)
    throw error
  }
}

run()

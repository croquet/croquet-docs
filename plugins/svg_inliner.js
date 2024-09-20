const fs = require('fs')
const path = require('path')

const templateName = 'multisynq'
const maxRetries = 5
const retryDelay = 1000 // 1 second

const docsDir = path.resolve(__dirname, `../dist/${templateName}/unity`)
const svgDir = path.resolve(__dirname, '../../croquet-for-unity-tutorials/docs/images')

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function inlineSvg(htmlFile) {
  console.log(`Processing ${htmlFile}`)
  let content

  try {
    content = fs.readFileSync(htmlFile, 'utf8')
  } catch (error) {
    console.warn(`Error reading file ${htmlFile}: ${error.message}`)
    return false
  }

  const imgRegex = /<img([^>]*)src=["']([^"']+\.svg)["']([^>]*)>/g

  content = content.replace(imgRegex, (match, before, src, after) => {
    const svgPath = path.join(svgDir, path.basename(src))

    if (fs.existsSync(svgPath)) {
      console.log(`Inlining SVG: ${svgPath}`)
      let svgContent
      try {
        svgContent = fs.readFileSync(svgPath, 'utf8')
      } catch (error) {
        console.warn(`Error reading SVG file ${svgPath}: ${error.message}`)
        return match
      }

      svgContent = svgContent.replace(/<\?xml[^>]*\?>/, '')

      const attributes = (before + ' ' + after).match(/(\w+)=["']([^"']*)["']/g) || []
      const attributesStr = attributes.map((attr) => attr.replace(/^src=/, '')).join(' ')

      svgContent = svgContent.replace('<svg', `<svg ${attributesStr}`)

      return svgContent
    } else {
      console.warn(`SVG not found: ${svgPath}`)
      return match
    }
  })

  try {
    fs.writeFileSync(htmlFile, content)
    return true
  } catch (error) {
    console.warn(`Error writing file ${htmlFile}: ${error.message}`)
    return false
  }
}

async function processDirectory(dir, retryCount = 0) {
  if (retryCount >= maxRetries) {
    console.error(`Max retries reached. Unable to process directory: ${dir}`)
    return
  }

  let files
  try {
    files = fs.readdirSync(dir)
  } catch (error) {
    console.warn(`Error reading directory ${dir}: ${error.message}`)
    console.log(`Retrying in ${retryDelay}ms...`)
    await sleep(retryDelay)
    return processDirectory(dir, retryCount + 1)
  }

  for (const file of files) {
    const fullPath = path.join(dir, file)
    try {
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        await processDirectory(fullPath)
      } else if (path.extname(file).toLowerCase() === '.html') {
        await inlineSvg(fullPath)
      }
    } catch (error) {
      console.warn(`Error processing ${fullPath}: ${error.message}`)
    }
  }
}

async function main() {
  console.log('Starting SVG inlining process...')
  await processDirectory(docsDir)
  console.log('SVG inlining complete')
}

main().catch((error) => {
  console.error('An error occurred during the SVG inlining process:', error)
})

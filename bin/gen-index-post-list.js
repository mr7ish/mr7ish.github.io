const fs = require('fs')
const path = require('path')

const rootDir = path.join(process.cwd(), 'docs')

function getDirFileList(url) {
    const absolutePath = path.resolve(rootDir, url)
    const stat = fs.statSync(absolutePath)
    let postList = []
    if (stat.isDirectory()) {
        const data = fs.readdirSync(absolutePath)
        postList = data.map((fileName) => {
            return {
                title: fileName.replace('.md', ''),
                fileName: `${url}/${fileName}`,
                filePath: path.resolve(absolutePath, fileName)
            }
        })
    }
    return postList
}

const snippetsLength = 200


function getPostSnippets(fileList) {
    return fileList.map((item) => {
        const fileSnippetsData = fs.readFileSync(item.filePath).toString().slice(0, 200)
        return {
            title: item.title,
            fileName:item.fileName,
            snippets: fileSnippetsData.replace(/#/g, '').replace(/[\n\r\-]/g, '')
        }
    })
}


function genMarkdownContent(postList) {
    return postList.map(item => {
        return `## ${item.title}

${item.snippets}

[阅读更多](./${item.fileName})
`
    }).join('\n')
}

fs.writeFileSync(path.resolve(rootDir, 'index.md'), genMarkdownContent(getPostSnippets(getDirFileList('notes'))))
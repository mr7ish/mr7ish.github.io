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
const tagReg = /%tag%(.+)%tag%/g


function getPostSnippets(fileList) {
    return fileList.map((item) => {
        const fileSnippetsData = fs.readFileSync(item.filePath).toString().slice(0, 200)
        return {
            title: item.title,
            fileName: item.fileName,
            tags: getTag(fileSnippetsData),
            snippets: fileSnippetsData.replace(/#/g, '').replace(/[\n\r\-]/g, '')
        }
    })
}

// %tag%<React,JavaScript>%tag%



function getTag(content) {
    const res = tagReg.exec(content)
    let tags = []
    if (res) {
        tagStr = res[1] || ''
        tags = tagStr.split(/[\, ]/g)
    }
    // console.log(tags); 
    return tags
}

function genMarkdownContent(postList) {
    return postList.map(item => {
        const tag = item.tags.map(tag => {
            return `<Tag type="info" text="${tag}" />`
        }).join('')
        

        return `## ${item.title}

${item.snippets}
${tag}

[阅读更多](./${item.fileName})
`
    }).join('\n')
}

fs.writeFileSync(path.resolve(rootDir, 'index.md'), genMarkdownContent(getPostSnippets(getDirFileList('notes'))))
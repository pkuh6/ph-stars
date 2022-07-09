function createElement<T extends keyof HTMLElementTagNameMap>(tag: T, ...children: (string | Node)[]) {
    const element = document.createElement(tag)
    element.append(...children)
    return element
}
function createDiv(classes: string[] = [], ...children: (string | Node)[]) {
    const element = createElement('div')
    element.classList.add(...classes)
    element.append(...children)
    return element
}
const startInput = createElement('input')
const endInput = createElement('input')
const input = createElement('input')
const button = createElement('button', '爬取')
const printButton = createElement('button', '下载 PDF')
const jsonA = createElement('a', '下载 JSON')
const container = createElement('div')
document.body.append(
    createElement('span', '开始日期'), startInput,
    createElement('span', '结束日期'), endInput,
    createElement('span', 'Token'), input,
    button, printButton, jsonA,
    container
)
startInput.type = 'date'
endInput.type = 'date'
jsonA.download = 'hole.json'
printButton.addEventListener('click', () => {
    print()
})
export interface HoleData {
    hidden: '1' | '0' | 1 | 0 | boolean | undefined
    likenum: number | string
    pid: number | string
    reply: number | string
    tag: string | null | undefined
    text: string | null | undefined
    timestamp: number | string
    type: string | null | undefined
    url: string | null | undefined
}
export interface CommentData {
    cid: number | string
    name: string | null | undefined
    pid: number | string
    text: string | null | undefined
    tag: string | null | undefined
    timestamp: number | string
}
async function getStars(): Promise<HoleData[]> {
    const url = new URL('https://pkuhelper.pku.edu.cn/services/pkuhole/api.php')
    url.searchParams.set('action', 'getattention')
    url.searchParams.set('PKUHelperAPI', '3.0')
    url.searchParams.set('jsapiver', `201027113050-${2 * Math.floor(Date.now() / 72e5)}`)
    url.searchParams.set('user_token', input.value)
    try {
        const res = await fetch(url)
        if (!res.ok) {
            return []
        }
        const {code, data} = await res.json()
        if (code === 0) {
            return data
        }
    } catch (err) {
        console.error(err)
    }
    return []
}
async function getRoughComments(id: number): Promise<CommentData[]> {
    await new Promise(r => setTimeout(r, 250))
    for (let i = 0; i < 100; i++) {
        const url = new URL('https://pkuhelper.pku.edu.cn/services/pkuhole/api.php')
        url.searchParams.set('action', 'getcomment')
        url.searchParams.set('pid', id.toString())
        url.searchParams.set('PKUHelperAPI', '3.0')
        url.searchParams.set('jsapiver', `201027113050-${2 * Math.floor(Date.now() / 72e5)}`)
        url.searchParams.set('user_token', input.value)
        try {
            const res = await fetch(url)
            if (!res.ok) {
                await new Promise(r => setTimeout(r, 3000))
                continue
            }
            const {code, data} = await res.json()
            if (code === 0) {
                return data
            }
            await new Promise(r => setTimeout(r, 3000))
            continue
        } catch (err) {
            console.error(err)
        }
    }
    alert('过于频繁')
    return []
}
async function getComments(id: number) {
    const comments = await getRoughComments(id)
    if (comments.length > 1 && Number(comments[0].cid) > Number(comments[1].cid)) {
        comments.reverse()
    }
    return comments
}
async function listener() {
    if (button.classList.contains('pushing')) {
        return
    }
    button.classList.add('pushing')
    let end: number
    const {value: endValue} = endInput
    if (endValue.length === 0) {
        end = Math.ceil((Date.now() / 1000 + 28800) / 86400) * 86400 - 28800
    } else {
        end = Math.floor(new Date(`${endValue} 23:59:59`).getTime() / 1000) + 1
    }
    let start = end - 86400
    const {value: startValue} = startInput
    if (startValue.length > 0) {
        start = Math.min(start, Math.floor(new Date(`${startValue} `).getTime() / 1000))
    }
    container.innerHTML = ''
    const array: {
        hole: HoleData
        comments: CommentData[]
    }[] = []
    for (const hole of await getStars()) {
        const time = Number(hole.timestamp)
        if (time < start || time > end) {
            continue
        }
        const element = createElement('div')
        const main = createElement('div')
        const commentsEle = createElement('div')
        container.append(element)
        element.append(main)
        const id = Number(hole.pid)
        const date = new Date(time * 1000)
        main.textContent = `#${id}  ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}  ${hole.likenum} 收藏  ${hole.reply} 回复  ${hole.tag ?? ''}\n${hole.text ?? ''}`
        if (hole.type === 'image' && typeof hole.url === 'string') {
            const img = createElement('img')
            element.append(img)
            if (id > 3218523) {
                img.src = `https://pkuhelper.pku.edu.cn/services/pkuhole/images/${hole.url}`
            } else {
                img.src = `https://ewr1.vultrobjects.com/ph-static/images/${hole.url}`
            }
        }
        element.append(commentsEle)
        const comments = await getComments(id)
        for (const comment of comments) {
            const element = createElement('div')
            commentsEle.append(element)
            const date = new Date(Number(comment.timestamp) * 1000)
            element.textContent = `#${comment.cid}  ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}  ${comment.tag ?? ''}\n${comment.text ?? ''}`
        }
        array.push({
            hole,
            comments
        })
    }
    URL.revokeObjectURL(jsonA.href)
    jsonA.href = URL.createObjectURL(new Blob([JSON.stringify(array, undefined, 4)]))
    alert('完成')
    button.classList.remove('pushing')
}
input.addEventListener('keydown', async e => {
    if (e.key === 'Enter') {
        await listener()
    }
})
button.addEventListener('click', listener)
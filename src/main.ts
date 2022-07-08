const span = document.createElement('span')
const input = document.createElement('input')
const button = document.createElement('button')
const printButton = document.createElement('button')
const container = document.createElement('div')
document.body.append(span, input, button, printButton, container)
span.textContent = 'Token'
button.textContent = '爬取'
printButton.textContent = '下载 PDF'
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
    await new Promise(r => setTimeout(r, 500))
    for (let i = 0; i < 10; i++) {
        const url = new URL('https://pkuhelper.pku.edu.cn/services/pkuhole/api.php')
        url.searchParams.set('action', 'getcomment')
        url.searchParams.set('pid', id.toString())
        url.searchParams.set('PKUHelperAPI', '3.0')
        url.searchParams.set('jsapiver', `201027113050-${2 * Math.floor(Date.now() / 72e5)}`)
        url.searchParams.set('user_token', input.value)
        try {
            const res = await fetch(url)
            if (!res.ok) {
                alert('过于频繁')
                await new Promise(r => setTimeout(r, 1000))
                continue
            }
            const {code, data} = await res.json()
            if (code === 0) {
                return data
            }
            alert('错误')
            await new Promise(r => setTimeout(r, 1000))
            continue
        } catch (err) {
            console.error(err)
        }
    }
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
    container.innerHTML = ''
    for (const hole of await getStars()) {
        const element = document.createElement('div')
        const main = document.createElement('div')
        const comments = document.createElement('div')
        container.append(element)
        element.append(main)
        const id = Number(hole.pid)
        const date = new Date(Number(hole.timestamp) * 1000)
        main.textContent = `#${id}  ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}  ${hole.likenum} 收藏  ${hole.reply} 回复  ${hole.tag ?? ''}\n${hole.text ?? ''}`
        if (hole.type === 'image' && typeof hole.url === 'string') {
            const img = document.createElement('img')
            element.append(img)
            if (id > 3218523) {
                img.src = `https://pkuhelper.pku.edu.cn/services/pkuhole/images/${hole.url}`
            } else {
                img.src = `https://ewr1.vultrobjects.com/ph-static/images/${hole.url}`
            }
        }
        element.append(comments)
        for (const comment of await getComments(id)) {
            const element = document.createElement('div')
            comments.append(element)
            const date = new Date(Number(comment.timestamp) * 1000)
            element.textContent = `#${comment.cid}  ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}  ${comment.tag ?? ''}\n${comment.text ?? ''}`
        }
    }
    alert('完成')
    button.classList.remove('pushing')
}
input.addEventListener('keydown', async e => {
    if (e.key === 'Enter') {
        await listener()
    }
})
button.addEventListener('click', listener)
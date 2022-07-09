var h=(t,e,n)=>new Promise((r,d)=>{var l=i=>{try{m(n.next(i))}catch(s){d(s)}},o=i=>{try{m(n.throw(i))}catch(s){d(s)}},m=i=>i.done?r(i.value):Promise.resolve(i.value).then(l,o);m((n=n.apply(t,e)).next())});function a(t,...e){let n=document.createElement(t);return n.append(...e),n}var L=a("input"),P=a("input"),y=a("input"),g=a("button","\u722C\u53D6"),U=a("button","\u4E0B\u8F7D PDF"),f=a("a","\u4E0B\u8F7D HTML"),b=a("a","\u4E0B\u8F7D JSON"),w=a("div");document.body.append(a("span","\u5F00\u59CB\u65E5\u671F"),L,a("span","\u7ED3\u675F\u65E5\u671F"),P,a("span","Token"),y,g,U,f,b,w);L.type="date";P.type="date";f.download="hole.html";b.download="hole.json";U.addEventListener("click",()=>{print()});function H(){return h(this,null,function*(){let t=new URL("https://pkuhelper.pku.edu.cn/services/pkuhole/api.php");t.searchParams.set("action","getattention"),t.searchParams.set("PKUHelperAPI","3.0"),t.searchParams.set("jsapiver",`201027113050-${2*Math.floor(Date.now()/72e5)}`),t.searchParams.set("user_token",y.value);try{let e=yield fetch(t);if(!e.ok)return[];let{code:n,data:r}=yield e.json();if(n===0)return r}catch(e){console.error(e)}return[]})}function R(t){return h(this,null,function*(){yield new Promise(e=>setTimeout(e,250));for(let e=0;e<100;e++){let n=new URL("https://pkuhelper.pku.edu.cn/services/pkuhole/api.php");n.searchParams.set("action","getcomment"),n.searchParams.set("pid",t.toString()),n.searchParams.set("PKUHelperAPI","3.0"),n.searchParams.set("jsapiver",`201027113050-${2*Math.floor(Date.now()/72e5)}`),n.searchParams.set("user_token",y.value);try{let r=yield fetch(n);if(!r.ok){yield new Promise(o=>setTimeout(o,3e3));continue}let{code:d,data:l}=yield r.json();if(d===0)return l;yield new Promise(o=>setTimeout(o,3e3));continue}catch(r){console.error(r)}}return alert("\u8FC7\u4E8E\u9891\u7E41"),[]})}function N(t){return h(this,null,function*(){let e=yield R(t);return e.length>1&&Number(e[0].cid)>Number(e[1].cid)&&e.reverse(),e})}function j(){return h(this,null,function*(){var l,o,m,i;if(g.classList.contains("pushing"))return;g.classList.add("pushing"),URL.revokeObjectURL(f.href),f.href="",URL.revokeObjectURL(b.href),b.href="",w.innerHTML="";let t,{value:e}=P;e.length===0?t=Math.ceil((Date.now()/1e3+28800)/86400)*86400-28800:t=Math.floor(new Date(`${e} 23:59:59`).getTime()/1e3)+1;let n=t-86400,{value:r}=L;r.length>0&&(n=Math.min(n,Math.floor(new Date(`${r} `).getTime()/1e3)));let d=[];for(let s of yield H()){let $=Number(s.timestamp);if($<n||$>t)continue;let v=a("div"),D=a("div"),M=a("div");w.append(v),v.append(D);let k=Number(s.pid),u=new Date($*1e3);if(D.textContent=`#${k}  ${u.getFullYear()}/${u.getMonth()+1}/${u.getDate()} ${u.getHours()}:${u.getMinutes()}:${u.getSeconds()}  ${s.likenum} \u6536\u85CF  ${s.reply} \u56DE\u590D  ${(l=s.tag)!=null?l:""}
${(o=s.text)!=null?o:""}`,s.type==="image"&&typeof s.url=="string"){let c=a("img");v.append(c),k>3218523?c.src=`https://pkuhelper.pku.edu.cn/services/pkuhole/images/${s.url}`:c.src=`https://ewr1.vultrobjects.com/ph-static/images/${s.url}`}v.append(M);let T=yield N(k);for(let c of T){let x=a("div");M.append(x);let p=new Date(Number(c.timestamp)*1e3);x.textContent=`#${c.cid}  ${p.getFullYear()}/${p.getMonth()+1}/${p.getDate()} ${p.getHours()}:${p.getMinutes()}:${p.getSeconds()}  ${(m=c.tag)!=null?m:""}
${(i=c.text)!=null?i:""}`}d.push({hole:s,comments:T})}f.href=URL.createObjectURL(new Blob([`<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    
    <body>
        <style>
            body>div>div {
                border-bottom: 1px solid;
                padding-top: 1em;
                white-space: pre-wrap;
            }
            
            body>div>div>:last-child {
                padding: .5em 0;
                margin-left: 2em;
            }
            
            body>div>div>:last-child>div {
                border-top: 1px solid;
                padding: .5em 0;
            }
            
            img {
                display: block;
                margin-top: .5em;
                max-width: 100%;
            }
        </style>
        <div>${w.innerHTML}</div>
    </body>
    
    </html>`])),b.href=URL.createObjectURL(new Blob([JSON.stringify(d,void 0,4)])),alert("\u5B8C\u6210"),g.classList.remove("pushing")})}y.addEventListener("keydown",t=>h(void 0,null,function*(){t.key==="Enter"&&(yield j())}));g.addEventListener("click",j);

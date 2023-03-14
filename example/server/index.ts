import path from "path"
import Koa from "koa"
import KoaRouter from "koa-router"
import KoaViews from "koa-views"
import KoaStatic from "koa-static"
import { readFileSync } from "fs"


function sleep(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

function resolve(dir: string) {
  return path.join(__dirname, dir)
}

const port = 3500
const app = new Koa()
const router = new KoaRouter()

app.use(KoaStatic(resolve("../../node_modules")))
app.use(KoaStatic(resolve("../../dist")))
app.use(KoaStatic(resolve("../static")))

app.use(KoaViews(resolve("../client"), { extension: "html" }))

// 注册路由
app.use(router.routes())
app.use(router.allowedMethods())

router.get('/', async ctx => {
  await ctx.render("index")
})

router.get('/mock-url', ctx => {
  ctx.body = {
    errcode: 0,
    errmsg: "Hello World",
    data: {}
  }
})

router.get('/mock-delay', async ctx => {
  await sleep(1000)

  ctx.body = {
    errcode: 0,
    errmsg: "Hello World",
    data: {}
  }
})

router.get('/mock-error', ctx => {
  ctx.status = 500
  ctx.body = {
    errcode: 500,
    errmsg: "登录失败",
    data: {}
  }
})

router.get('/mock-download', ctx => {
  const file = readFileSync(resolve("../static/test.txt"))
  
  ctx.type = 'text/plain; charset=utf-8';
  ctx.append('fileName', 'test.txt');

  ctx.body = file
})

app.listen(port, () => {
  console.log(`The server is running in http://localhost:${port}`)
})
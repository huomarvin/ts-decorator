import * as Koa from "koa";
import * as bodify from "koa-body";
import * as serve from "koa-static";
import * as timing from "koa-xtime";
import { load } from "./utils/route-decorator";
import { resolve } from "path";
import { Sequelize } from "sequelize-typescript";

const database = new Sequelize({
  port: 3306,
  database: "test",
  username: "root",
  password: "123456",
  dialect: "mysql",
  modelPaths: [`${__dirname}/model`],
});

database.sync({ force: true });

const app = new Koa();
app.use(timing());
app.use(serve(`${__dirname}/public`));

app.use(
  bodify({
    multipart: true,
    strict: false,
  })
);
const router = load(resolve(__dirname, "./routes"));

app.use(router.routes());
// app.use(router.routes).use(router.allowedMethods);
// app.use((ctx: Koa.Context) => {
//   ctx.body = "hello";
// });

app.listen(3000, () => {
  console.log("服务器启动成功");
});

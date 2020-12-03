import * as Koa from "koa";
import { auth, get, post, authGet } from "../utils/route-decorator";
const users = [
  { name: "tom", age: 20 },
  { name: "jerry", age: 11 },
];

// @auth([
//   async (ctx, next) => {
//     if (ctx.header.token) {
//       await next();
//     } else {
//       throw "请登录";
//     }
//   },
// ])
// @loginAuth
class User {
  @authGet("/auth/user")
  public list(ctx: Koa.Context) {
    ctx.body = { ok: 1, data: users };
  }
  public add(ctx: Koa.Context) {
    users.push(ctx.request.body);
    ctx.body = { ok: 1 };
  }
}

export default User;

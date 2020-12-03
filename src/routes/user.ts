import * as Koa from "koa";
import { body, get, post, querystring } from "../utils/route-decorator";
import model from "../model/user";

class User {
  @get("/user")
  @querystring({
    age: { type: "int", required: false, max: 200, convertType: "int" },
  })
  public list(ctx: Koa.Context) {
    const users = model.findAll();
    ctx.body = { ok: 1, data: users };
  }
  @body({
    name: { type: "string", required: true },
  })
  @post(
    "/user"
    //   {
    //     middlewares: [
    //       async function validation(ctx: Koa.Context, next: () => Promise<any>) {
    //         // ⽤用户名必填
    //         const name = ctx.request.body.name;
    //         if (!name) {
    //           throw "请输⼊用户名";
    //         }
    //         // ⽤用户名不不能重复
    //         try {
    //           await api.findByName(name); // 校验通过
    //           await next();
    //         } catch (error) {
    //           throw error;
    //         }
    //       },
    //     ],
    //   }
  )
  public async add(ctx: Koa.Context) {
    // users.push(ctx.request.body);
    await model.create(ctx.request.body);
    ctx.body = { ok: 1 };
  }
}

export default User;

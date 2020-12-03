# 一个简单实现Rest接口的模板项目

通过装饰器封装请求类型、授权、参数校验、数据库字段同步和DAO方法包装


- Restful请求封装基于koa-router

```js
// @get @post @del @put @patch
@get("/user")
public list(ctx: Koa.Context) {
	const users = model.findAll();
	ctx.body = { ok: 1, data: users };
}
```

- 授权基于Koa middleware机制

```js
// @authGet @authPost @authDel @authPut @authPatch 内部实现了简单的校验，判断header中是否含有token
@authGet("/auth/user")
public list(ctx: Koa.Context) {
    ctx.body = { ok: 1, data: users };
}
```

- 参数校验基于Parameter组件

```js
// 参数校验有两种，针对get和post的不同传值方式
// get
@get('/user')
@querystring({
    age: { type: "int", required: false, max: 200, convertType: "int" },
})
public list(ctx: Koa.Context) {
    const users = model.findAll();
    ctx.body = { ok: 1, data: users };
}

@body({name: { type: "string", required: true }})
@post('/user')
public async add(ctx: Koa.Context) {
    await model.create(ctx.request.body);
    ctx.body = { ok: 1 };
}

```

- 数据库字段同步和包装基于sequelize

```js
// 在项目的入口文件中插入数据库连接和model同步逻辑
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

// 在模型文件中定义表结构
// model/user.ts
import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ modelName: "users" })
class User extends Model<User> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  public id: number;

  @Column({ type: DataType.CHAR })
  public name: string;
}

export default User;

```


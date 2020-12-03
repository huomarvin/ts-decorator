import * as Router from "koa-router";
import * as glob from "glob";
import * as Koa from "koa";
import * as Parameter from "parameter";

type HTTPMETHOD = "get" | "post" | "del" | "put" | "patch";
type LoadOptions = {
  extname?: string;
};
type RouteOptions = {
  middlewares?: Array<any>;
  prefix?: string;
};
const router = new Router();

const restMethod = (method: HTTPMETHOD) => (authMiddles?: Koa.MiddleWare[]) => (
  url: string,
  options: RouteOptions = {}
) => {
  /**
   * @param {Object} target 被装饰器的类的原型
   * @param {string} name 被装饰的类、属性、方法的名字
   * @param {Object} descriptor 被装饰的类、属性、方法的descriptor
   */
  return (target, property, descriptor) => {
    process.nextTick(() => {
      const middlewares = [];
      if (authMiddles) {
        middlewares.push(...authMiddles);
      }
      if (options.middlewares) {
        middlewares.push(...options.middlewares);
      }
      if (target.middlewares) {
        middlewares.push(...target.middlewares);
      }
      console.log("middlewares", middlewares);
      middlewares.push(target[property]);
      if (options.prefix) {
        url = `${options.prefix}${url}`;
      }
      router[method](url, ...middlewares);
      console.log("target", target);
      console.log("property", property);
      console.log("descriptor", descriptor);
      console.log("a", target[property]);
    });
  };
};

export const get = restMethod("get")();
export const post = restMethod("post")();
export const del = restMethod("del")();
export const put = restMethod("put")();
export const patch = restMethod("patch")();

export const auth = (middlewares: Koa.MiddleWare[]) => {
  return function (target) {
    target.prototype.middlewares = middlewares;
  };
};

const authMethod = (method: HTTPMETHOD) =>
  restMethod(method)([
    async (ctx, next) => {
      if (ctx.header.token) {
        await next();
      } else {
        throw "请先授权";
      }
    },
  ]);

export const authGet = authMethod("get");
export const authPost = authMethod("post");
export const authDel = authMethod("del");
export const authPut = authMethod("put");
export const authPatch = authMethod("patch");

export const load = (folder, options: LoadOptions = {}) => {
  const extname = options.extname || ".{js,ts}";
  glob
    .sync(require("path").join(folder, `./**/*${extname}`))
    .forEach((item) => require(item));
  console.log("router", router);
  return router;
};

const validateRule = (paramPart) => (rule) => {
  return function (target, name, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = function () {
      const ctx = arguments[0];
      const p = new Parameter();
      const data = ctx.request[paramPart];
      const errors = p.validate(rule, data);
      console.log("error", errors);
      if (errors) throw new Error(JSON.stringify(errors));
      return oldValue.apply(null, arguments);
    };
    return descriptor;
  };
};

export const querystring = validateRule("query");
export const body = validateRule("body");

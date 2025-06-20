import fastify from "fastify";
import * as Routes from "./infra/web/routes";
import "dotenv/config";
import * as Swagger from "./infra/web/config/swagger";
import * as Database from "./infra/database/";
import * as Cors from "./infra/web/config/cors";
import * as Schema from "./infra/web/config/schema";
import * as ErrorHandler from "./infra/web/config/error-handler";
import fastifyStatic from "@fastify/static";
import path = require("path");
import multipart from "@fastify/multipart";

(async () => {
  const app = fastify();

  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, //
      files: 1,
    },
    attachFieldsToBody: false,
  });

  ErrorHandler.configure(app);

  Schema.configure(app);

  await Swagger.configure(app);

  await Cors.register(app);

  await Database.connect();

  Routes.register(app);

  app.register(fastifyStatic, {
    root: path.join(process.cwd(), "src/assets"),
    prefix: "/assets/",
  });

  app.listen(
    {
      port: 3001,
    },
    () => {
      console.log("Api rodando na porta 3001");
    }
  );
})();

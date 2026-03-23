import { createSwaggerSpec } from "next-swagger-doc";
import { existsSync } from "node:fs";

export function getApiDocs() {
  const apiFolder = existsSync("app/api") ? "app/api" : "src/app/api";

  return createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Pokemon Card API",
        version: "1.0.0",
        description: "API documentation for Pokemon Card Collection",
      },
      servers: [{ url: "http://localhost:3000" }],
    },
    apiFolder,
  });
}

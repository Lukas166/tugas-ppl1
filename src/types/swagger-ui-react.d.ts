declare module "swagger-ui-react" {
  import type { ComponentType } from "react";

  type SwaggerOperation = {
    get(key: string): unknown;
  };

  export type SwaggerUIProps = {
    spec?: object;
    url?: string;
    docExpansion?: "list" | "full" | "none";
    operationsSorter?: (
      a: SwaggerOperation,
      b: SwaggerOperation,
    ) => number;
  };

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}

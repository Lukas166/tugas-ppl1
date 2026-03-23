"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const pathOrder: Record<string, number> = {
  "/api/pokemon": 0,
  "/api/pokemon/{id}": 1,
};

const methodOrder: Record<string, number> = {
  get: 0,
  post: 1,
  put: 2,
  delete: 3,
  patch: 4,
};

type OpenApiPathItem = Record<string, unknown>;

type OpenApiSpec = {
  paths?: Record<string, OpenApiPathItem>;
} & Record<string, unknown>;

function sortMethods(pathItem: OpenApiPathItem): OpenApiPathItem {
  const sortedMethodEntries = Object.entries(pathItem).sort(([a], [b]) => {
    const aRank = methodOrder[a.toLowerCase()] ?? Number.MAX_SAFE_INTEGER;
    const bRank = methodOrder[b.toLowerCase()] ?? Number.MAX_SAFE_INTEGER;
    return aRank - bRank;
  });

  return Object.fromEntries(sortedMethodEntries);
}

function sortSpec(spec: OpenApiSpec): OpenApiSpec {
  if (!spec.paths) {
    return spec;
  }

  const sortedPathEntries = Object.entries(spec.paths)
    .sort(([a], [b]) => {
      const aRank = pathOrder[a] ?? Number.MAX_SAFE_INTEGER;
      const bRank = pathOrder[b] ?? Number.MAX_SAFE_INTEGER;

      if (aRank !== bRank) {
        return aRank - bRank;
      }

      return a.localeCompare(b);
    })
    .map(([path, pathItem]) => [path, sortMethods(pathItem)]);

  return {
    ...spec,
    paths: Object.fromEntries(sortedPathEntries),
  };
}

export default function DocsPage() {
  const [spec, setSpec] = useState<OpenApiSpec | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSpec = async () => {
      const response = await fetch("/api/docs");
      const data = (await response.json()) as OpenApiSpec;
      const sortedSpec = sortSpec(data);

      if (mounted) {
        setSpec(sortedSpec);
      }
    };

    void loadSpec();

    return () => {
      mounted = false;
    };
  }, []);

  if (!spec) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-900">
        <p className="text-base font-medium">Loading API documentation...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-4 text-slate-900 sm:px-6 sm:py-6 lg:px-10">
      <div className="mx-auto w-full max-w-300 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
        <SwaggerUI
          spec={spec}
          docExpansion="list"
          operationsSorter={(a, b) => {
            const aPath = String(a.get("path") ?? a.get("pathName"));
            const bPath = String(b.get("path") ?? b.get("pathName"));
            const aMethod = String(a.get("method")).toLowerCase();
            const bMethod = String(b.get("method")).toLowerCase();

            const byPath =
              (pathOrder[aPath] ?? Number.MAX_SAFE_INTEGER) -
              (pathOrder[bPath] ?? Number.MAX_SAFE_INTEGER);

            if (byPath !== 0) {
              return byPath;
            }

            return (
              (methodOrder[aMethod] ?? Number.MAX_SAFE_INTEGER) -
              (methodOrder[bMethod] ?? Number.MAX_SAFE_INTEGER)
            );
          }}
        />
      </div>
    </main>
  );
}

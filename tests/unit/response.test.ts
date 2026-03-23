import { describe, expect, it } from "vitest";

import { errorResponse, successResponse } from "@/lib/response";

describe("response helper", () => {
  it("returns success response payload and status", async () => {
    const payload = { id: 1, name: "Pikachu" };

    const response = successResponse(payload, "Fetched", 200);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      message: "Fetched",
      data: payload,
    });
  });

  it("returns error response payload and status", async () => {
    const response = errorResponse("Invalid id", 400, {
      field: "id",
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      message: "Invalid id",
      errors: {
        field: "id",
      },
    });
  });
});

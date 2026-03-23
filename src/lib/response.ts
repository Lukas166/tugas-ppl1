import { NextResponse } from "next/server";

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
};

export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200,
) {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  return NextResponse.json(payload, { status });
}

export function errorResponse(message: string, status = 500, errors?: unknown) {
  const payload: ApiErrorResponse = {
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {}),
  };

  return NextResponse.json(payload, { status });
}

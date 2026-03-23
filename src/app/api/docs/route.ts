import { getApiDocs } from "@/lib/swagger";

export async function GET() {
  return Response.json(getApiDocs());
}

import { prisma, CONDITION_VALUES, RARITY_VALUES } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseRequiredString(
  body: Record<string, unknown>,
  field: string,
): string | null {
  const value = body[field];
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isRarity(value: unknown): value is (typeof RARITY_VALUES)[number] {
  return (
    typeof value === "string" &&
    (RARITY_VALUES as readonly string[]).includes(value)
  );
}

function isCondition(value: unknown): value is (typeof CONDITION_VALUES)[number] {
  return (
    typeof value === "string" &&
    (CONDITION_VALUES as readonly string[]).includes(value)
  );
}

function validateAndNormalizePayload(body: unknown) {
  if (!isRecord(body)) {
    return {
      ok: false as const,
      message: "Invalid JSON body",
    };
  }

  const name = parseRequiredString(body, "name");
  if (!name) {
    return {
      ok: false as const,
      message: "name is required",
    };
  }

  const type = parseRequiredString(body, "type");
  if (!type) {
    return {
      ok: false as const,
      message: "type is required",
    };
  }

  const setName = parseRequiredString(body, "setName");
  if (!setName) {
    return {
      ok: false as const,
      message: "setName is required",
    };
  }

  const cardNumber = parseRequiredString(body, "cardNumber");
  if (!cardNumber) {
    return {
      ok: false as const,
      message: "cardNumber is required",
    };
  }

  const artist = parseRequiredString(body, "artist");
  if (!artist) {
    return {
      ok: false as const,
      message: "artist is required",
    };
  }

  if (!isRarity(body.rarity)) {
    return {
      ok: false as const,
      message: "rarity is invalid",
    };
  }

  if (!isCondition(body.condition)) {
    return {
      ok: false as const,
      message: "condition is invalid",
    };
  }

  const hp = Number(body.hp);
  const attack = Number(body.attack);
  const price = Number(body.price);

  if (!Number.isFinite(hp) || hp <= 0) {
    return {
      ok: false as const,
      message: "hp must be a positive number",
    };
  }

  if (!Number.isFinite(attack) || attack <= 0) {
    return {
      ok: false as const,
      message: "attack must be a positive number",
    };
  }

  if (!Number.isFinite(price) || price < 0) {
    return {
      ok: false as const,
      message: "price must be a non-negative number",
    };
  }

  const descriptionValue = body.description;
  const description =
    typeof descriptionValue === "string" && descriptionValue.trim().length > 0
      ? descriptionValue.trim()
      : undefined;

  return {
    ok: true as const,
    data: {
      name,
      type,
      hp,
      attack,
      rarity: body.rarity,
      condition: body.condition,
      setName,
      cardNumber,
      artist,
      price,
      description,
    },
  };
}

export async function GET() {
  try {
    const pokemonCards = await prisma.pokemonCard.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(pokemonCards, "Pokemon cards fetched", 200);
  } catch (error) {
    return errorResponse("Failed to fetch pokemon cards", 500, error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = validateAndNormalizePayload(body);

    if (!parsedBody.ok) {
      return errorResponse(parsedBody.message, 400);
    }

    const pokemonCard = await prisma.pokemonCard.create({
      data: parsedBody.data,
    });

    return successResponse(pokemonCard, "Pokemon card created", 201);
  } catch (error) {
    return errorResponse("Failed to create pokemon card", 500, error);
  }
}

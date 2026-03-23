import { prisma, CONDITION_VALUES, RARITY_VALUES } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";

/**
 * @swagger
 * /api/pokemon/{id}:
 *   get:
 *     summary: Get pokemon card by ID
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiPokemonCardResponse'
 *       400:
 *         description: Invalid id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: Pokemon card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *   put:
 *     summary: Update pokemon card
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PokemonCardInput'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiPokemonCardResponse'
 *       400:
 *         description: Invalid id or request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: Pokemon card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *   delete:
 *     summary: Delete pokemon card
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   nullable: true
 *       400:
 *         description: Invalid id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: Pokemon card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */

type RouteContext = {
	params: Promise<{ id: string }>;
};

function parseId(id: string) {
	const parsedId = Number(id);
	if (!Number.isInteger(parsedId) || parsedId <= 0) {
		return null;
	}
	return parsedId;
}

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

export async function GET(_: Request, context: RouteContext) {
	try {
		const { id } = await context.params;
		const parsedId = parseId(id);

		if (!parsedId) {
			return errorResponse("Invalid id", 400);
		}

		const pokemonCard = await prisma.pokemonCard.findUnique({
			where: {
				id: parsedId,
			},
		});

		if (!pokemonCard) {
			return errorResponse("Pokemon card not found", 404);
		}

		return successResponse(pokemonCard, "Pokemon card fetched", 200);
	} catch (error) {
		return errorResponse("Failed to fetch pokemon card", 500, error);
	}
}

export async function PUT(request: Request, context: RouteContext) {
	try {
		const { id } = await context.params;
		const parsedId = parseId(id);

		if (!parsedId) {
			return errorResponse("Invalid id", 400);
		}

		const body = await request.json();
		const parsedBody = validateAndNormalizePayload(body);

		if (!parsedBody.ok) {
			return errorResponse(parsedBody.message, 400);
		}

		const existingPokemonCard = await prisma.pokemonCard.findUnique({
			where: {
				id: parsedId,
			},
		});

		if (!existingPokemonCard) {
			return errorResponse("Pokemon card not found", 404);
		}

		const pokemonCard = await prisma.pokemonCard.update({
			where: {
				id: parsedId,
			},
			data: parsedBody.data,
		});

		return successResponse(pokemonCard, "Pokemon card updated", 200);
	} catch (error) {
		return errorResponse("Failed to update pokemon card", 500, error);
	}
}

export async function DELETE(_: Request, context: RouteContext) {
	try {
		const { id } = await context.params;
		const parsedId = parseId(id);

		if (!parsedId) {
			return errorResponse("Invalid id", 400);
		}

		const existingPokemonCard = await prisma.pokemonCard.findUnique({
			where: {
				id: parsedId,
			},
		});

		if (!existingPokemonCard) {
			return errorResponse("Pokemon card not found", 404);
		}

		await prisma.pokemonCard.delete({
			where: {
				id: parsedId,
			},
		});

		return successResponse(null, "Pokemon card deleted", 200);
	} catch (error) {
		return errorResponse("Failed to delete pokemon card", 500, error);
	}
}

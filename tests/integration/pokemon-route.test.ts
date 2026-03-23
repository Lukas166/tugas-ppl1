import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    pokemonCard: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
  RARITY_VALUES: [
    "COMMON",
    "UNCOMMON",
    "RARE",
    "HOLO_RARE",
    "DOUBLE_RARE",
    "ULTRA_RARE",
    "ILLUSTRATION_RARE",
    "SPECIAL_ILLUSTRATION_RARE",
    "HYPER_RARE",
    "SECRET_RARE",
  ],
  CONDITION_VALUES: [
    "MINT",
    "NEAR_MINT",
    "LIGHT_PLAYED",
    "HEAVILY_PLAYED",
    "DAMAGED",
  ],
}));

import { GET, POST } from "@/app/api/pokemon/route";

describe("integration /api/pokemon", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET should return pokemon cards sorted by createdAt desc", async () => {
    const cards = [
      {
        id: 1,
        name: "Pikachu",
        type: "Electric",
        hp: 60,
        attack: 55,
        rarity: "COMMON",
        condition: "MINT",
        setName: "Base",
        cardNumber: "25",
        artist: "Ken",
        price: "10000",
        description: "Starter",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    ];

    mockPrisma.pokemonCard.findMany.mockResolvedValue(cards);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockPrisma.pokemonCard.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
    expect(body.success).toBe(true);
    expect(body.data).toEqual([
      {
        ...cards[0],
        createdAt: cards[0].createdAt.toISOString(),
      },
    ]);
  });

  it("GET should return 500 when database throws error", async () => {
    mockPrisma.pokemonCard.findMany.mockRejectedValue(new Error("db down"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Failed to fetch pokemon cards");
  });

  it("POST should create pokemon card with normalized number fields", async () => {
    const request = new Request("http://localhost:3000/api/pokemon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Charizard",
        type: "Fire",
        hp: "120",
        attack: "90",
        rarity: "RARE",
        condition: "MINT",
        setName: "Base",
        cardNumber: "4",
        artist: "Mitsuhiro Arita",
        price: "250000",
        description: "Legendary",
      }),
    });

    const created = {
      id: 2,
      name: "Charizard",
      type: "Fire",
      hp: 120,
      attack: 90,
      rarity: "RARE",
      condition: "MINT",
      setName: "Base",
      cardNumber: "4",
      artist: "Mitsuhiro Arita",
      price: "250000",
      description: "Legendary",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    mockPrisma.pokemonCard.create.mockResolvedValue(created);

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockPrisma.pokemonCard.create).toHaveBeenCalledWith({
      data: {
        name: "Charizard",
        type: "Fire",
        hp: 120,
        attack: 90,
        rarity: "RARE",
        condition: "MINT",
        setName: "Base",
        cardNumber: "4",
        artist: "Mitsuhiro Arita",
        price: 250000,
        description: "Legendary",
      },
    });
    expect(body.success).toBe(true);
    expect(body.data).toEqual({
      ...created,
      createdAt: created.createdAt.toISOString(),
    });
  });

  it("POST should return 400 for invalid rarity", async () => {
    const request = new Request("http://localhost:3000/api/pokemon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bulbasaur",
        type: "Grass",
        hp: 45,
        attack: 49,
        rarity: "INVALID",
        condition: "MINT",
        setName: "Base",
        cardNumber: "1",
        artist: "Ken",
        price: 15000,
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe("rarity is invalid");
    expect(mockPrisma.pokemonCard.create).not.toHaveBeenCalled();
  });
});

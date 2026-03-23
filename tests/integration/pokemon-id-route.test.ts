import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    pokemonCard: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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

import { DELETE, GET, PUT } from "@/app/api/pokemon/[id]/route";

const routeContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe("integration /api/pokemon/{id}", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET should return 400 for invalid id", async () => {
    const response = await GET(new Request("http://localhost"), routeContext("abc"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Invalid id");
    expect(mockPrisma.pokemonCard.findUnique).not.toHaveBeenCalled();
  });

  it("GET should return 404 when card not found", async () => {
    mockPrisma.pokemonCard.findUnique.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost"), routeContext("99"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("Pokemon card not found");
  });

  it("GET should return card for valid id", async () => {
    const card = {
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
    };

    mockPrisma.pokemonCard.findUnique.mockResolvedValue(card);

    const response = await GET(new Request("http://localhost"), routeContext("1"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockPrisma.pokemonCard.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(body.data).toEqual({
      ...card,
      createdAt: card.createdAt.toISOString(),
    });
  });

  it("PUT should return 400 for invalid payload", async () => {
    const request = new Request("http://localhost", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Pikachu",
        type: "Electric",
        hp: 0,
        attack: 55,
        rarity: "COMMON",
        condition: "MINT",
        setName: "Base",
        cardNumber: "25",
        artist: "Ken",
        price: 10000,
      }),
    });

    const response = await PUT(request, routeContext("1"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("hp must be a positive number");
    expect(mockPrisma.pokemonCard.update).not.toHaveBeenCalled();
  });

  it("PUT should return 404 when card not found", async () => {
    mockPrisma.pokemonCard.findUnique.mockResolvedValue(null);

    const request = new Request("http://localhost", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Pikachu",
        type: "Electric",
        hp: 60,
        attack: 55,
        rarity: "COMMON",
        condition: "MINT",
        setName: "Base",
        cardNumber: "25",
        artist: "Ken",
        price: 10000,
      }),
    });

    const response = await PUT(request, routeContext("1"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("Pokemon card not found");
    expect(mockPrisma.pokemonCard.update).not.toHaveBeenCalled();
  });

  it("DELETE should return 404 when card not found", async () => {
    mockPrisma.pokemonCard.findUnique.mockResolvedValue(null);

    const response = await DELETE(new Request("http://localhost"), routeContext("1"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("Pokemon card not found");
    expect(mockPrisma.pokemonCard.delete).not.toHaveBeenCalled();
  });

  it("DELETE should remove card and return 200", async () => {
    mockPrisma.pokemonCard.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.pokemonCard.delete.mockResolvedValue({ id: 1 });

    const response = await DELETE(new Request("http://localhost"), routeContext("1"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockPrisma.pokemonCard.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(body.message).toBe("Pokemon card deleted");
  });
});

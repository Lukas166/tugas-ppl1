-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('MINT', 'NEAR_MINT', 'LIGHT_PLAYED', 'HEAVILY_PLAYED', 'DAMAGED');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'HOLO_RARE', 'DOUBLE_RARE', 'ULTRA_RARE', 'ILLUSTRATION_RARE', 'SPECIAL_ILLUSTRATION_RARE', 'HYPER_RARE', 'SECRET_RARE');

-- CreateTable
CREATE TABLE "PokemonCard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "condition" "Condition" NOT NULL,
    "setName" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PokemonCard_pkey" PRIMARY KEY ("id")
);

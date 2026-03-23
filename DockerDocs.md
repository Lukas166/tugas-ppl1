# Docker Setup Guide

## 1. Description

This project provides a complete Docker setup for both development and production-like runtime.
The setup includes:

1. Next.js application container
2. PostgreSQL database container
3. Prisma client generation during image build
4. Prisma Studio web UI container

The environment is designed so the app can run on any laptop with Docker installed, without local installation of Node.js, pnpm, PostgreSQL, or other runtime dependencies.

## 2. Prerequisites

1. Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose plugin (Linux)
2. Verify installation:

```bash
docker --version
docker compose version
```

## 3. Environment Setup

Copy `.env.example` to `.env` at the project root:

```bash
cp .env.example .env
```

Example `.env` content:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=pokemon_db
POSTGRES_HOST=db
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@db:5432/pokemon_db?schema=public
```

## 4. Run Commands

Run from project root.

### Development

```bash
docker-compose -f docker_dev/docker-compose.yml up --build
```

### Production-like

```bash
docker-compose -f docker_prod/docker-compose.yml up --build
```

To stop:

### Development

```bash
docker-compose -f docker_dev/docker-compose.yml down
```

### Production-like

```bash
docker-compose -f docker_prod/docker-compose.yml down
```

## 5. Port Mapping

| Service | Host Port | Container Port |
|---|---:|---:|
| App (dev) | 3000 | 3000 |
| DB (dev) | 5432 | 5432 |
| Prisma Studio (dev) | 51212 | 51212 |
| App (prod-like) | 3000 | 3000 |
| DB (prod-like) | 5432 | 5432 |
| Prisma Studio (prod-like) | 51212 | 51212 |

Note:

1. Do not run dev and prod-like stacks at the same time because they map to the same host ports.
2. Access app at `http://localhost:3000`.
3. Access Prisma Studio at `http://localhost:51212`.

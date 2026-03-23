# API Documentation

## 1. API Summary

This API is built to manage a Pokemon Card Collection using CRUD operations.

Base URL (local):

- http://localhost:3000

## 2. Endpoint List

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/pokemon | Get all Pokemon cards |
| POST | /api/pokemon | Create a new Pokemon card |
| GET | /api/pokemon/{id} | Get Pokemon card details by id |
| PUT | /api/pokemon/{id} | Update Pokemon card by id |
| DELETE | /api/pokemon/{id} | Delete Pokemon card by id |

## 3. Standard Response Format

All endpoints use this JSON envelope:

### Success Response

```json
{
   "success": true,
   "message": "Pokemon cards fetched",
   "data": []
}
```

### Error Response

```json
{
   "success": false,
   "message": "Invalid id",
   "errors": {
      "example": "optional, only returned when available"
   }
}
```

Notes:

1. `errors` field is optional and only returned when available.
2. `price` can be serialized as number or string depending on Decimal serialization.

## 4. Swagger (Primary Source of Truth)

Swagger access:

1. Start the project first (local run or Docker).
2. Open documentation URLs:
   - UI: http://localhost:3000/docs
   - Raw OpenAPI JSON: http://localhost:3000/api/docs

Notes:

- If running with Docker, ensure the app container is running and port 3000 is exposed.
- Swagger documentation is the primary source of truth for API response formats.

## 5. Endpoint Details (Complete)

### 5.1 GET /api/pokemon

Description:

- Returns all Pokemon cards sorted by `createdAt` descending.

Success:

- Status: `200`

```json
{
   "success": true,
   "message": "Pokemon cards fetched",
   "data": [
      {
         "id": 1,
         "name": "Pikachu",
         "type": "Electric",
         "hp": 60,
         "attack": 45,
         "rarity": "COMMON",
         "condition": "NEAR_MINT",
         "setName": "Base Set",
         "cardNumber": "58/102",
         "artist": "Ken Sugimori",
         "price": 12.5,
         "description": "Starter electric card",
         "createdAt": "2026-03-24T10:00:00.000Z"
      }
   ]
}
```

Error:

- Status: `500`

```json
{
   "success": false,
   "message": "Failed to fetch pokemon cards"
}
```

### 5.2 POST /api/pokemon

Description:

- Creates a new Pokemon card.

Request body:

```json
{
   "name": "Charizard",
   "type": "Fire",
   "hp": 120,
   "attack": 100,
   "rarity": "ULTRA_RARE",
   "condition": "MINT",
   "setName": "Base Set",
   "cardNumber": "4/102",
   "artist": "Mitsuhiro Arita",
   "price": 250,
   "description": "First edition"
}
```

Success:

- Status: `201`

```json
{
   "success": true,
   "message": "Pokemon card created",
   "data": {
      "id": 2,
      "name": "Charizard",
      "type": "Fire",
      "hp": 120,
      "attack": 100,
      "rarity": "ULTRA_RARE",
      "condition": "MINT",
      "setName": "Base Set",
      "cardNumber": "4/102",
      "artist": "Mitsuhiro Arita",
      "price": 250,
      "description": "First edition",
      "createdAt": "2026-03-24T10:05:00.000Z"
   }
}
```

Validation errors:

- Status: `400`

```json
{
   "success": false,
   "message": "rarity is invalid"
}
```

```json
{
   "success": false,
   "message": "hp must be a positive number"
}
```

Server error:

- Status: `500`

```json
{
   "success": false,
   "message": "Failed to create pokemon card"
}
```

### 5.3 GET /api/pokemon/{id}

Description:

- Returns one Pokemon card by id.

Success:

- Status: `200`

```json
{
   "success": true,
   "message": "Pokemon card fetched",
   "data": {
      "id": 1,
      "name": "Pikachu",
      "type": "Electric",
      "hp": 60,
      "attack": 45,
      "rarity": "COMMON",
      "condition": "NEAR_MINT",
      "setName": "Base Set",
      "cardNumber": "58/102",
      "artist": "Ken Sugimori",
      "price": 12.5,
      "description": "Starter electric card",
      "createdAt": "2026-03-24T10:00:00.000Z"
   }
}
```

Errors:

- Status: `400`

```json
{
   "success": false,
   "message": "Invalid id"
}
```

- Status: `404`

```json
{
   "success": false,
   "message": "Pokemon card not found"
}
```

- Status: `500`

```json
{
   "success": false,
   "message": "Failed to fetch pokemon card"
}
```

### 5.4 PUT /api/pokemon/{id}

Description:

- Updates an existing Pokemon card by id.

Request body:

```json
{
   "name": "Charizard",
   "type": "Fire",
   "hp": 130,
   "attack": 110,
   "rarity": "ULTRA_RARE",
   "condition": "NEAR_MINT",
   "setName": "Base Set",
   "cardNumber": "4/102",
   "artist": "Mitsuhiro Arita",
   "price": 300,
   "description": "Updated price"
}
```

Success:

- Status: `200`

```json
{
   "success": true,
   "message": "Pokemon card updated",
   "data": {
      "id": 2,
      "name": "Charizard",
      "type": "Fire",
      "hp": 130,
      "attack": 110,
      "rarity": "ULTRA_RARE",
      "condition": "NEAR_MINT",
      "setName": "Base Set",
      "cardNumber": "4/102",
      "artist": "Mitsuhiro Arita",
      "price": 300,
      "description": "Updated price",
      "createdAt": "2026-03-24T10:05:00.000Z"
   }
}
```

Errors:

- Status: `400`

```json
{
   "success": false,
   "message": "Invalid id"
}
```

```json
{
   "success": false,
   "message": "condition is invalid"
}
```

- Status: `404`

```json
{
   "success": false,
   "message": "Pokemon card not found"
}
```

- Status: `500`

```json
{
   "success": false,
   "message": "Failed to update pokemon card"
}
```

### 5.5 DELETE /api/pokemon/{id}

Description:

- Deletes a Pokemon card by id.

Success:

- Status: `200`

```json
{
   "success": true,
   "message": "Pokemon card deleted",
   "data": null
}
```

Errors:

- Status: `400`

```json
{
   "success": false,
   "message": "Invalid id"
}
```

- Status: `404`

```json
{
   "success": false,
   "message": "Pokemon card not found"
}
```

- Status: `500`

```json
{
   "success": false,
   "message": "Failed to delete pokemon card"
}
```

## 6. Running the API

### Option A: Local Run

1. Install dependencies:

```bash
pnpm install
```

2. Run the application:

```bash
pnpm dev
```

3. Open:

- API: http://localhost:3000/api/pokemon
- Docs: http://localhost:3000/docs

### Option B: Docker

1. Development stack:

```bash
docker compose -f docker_dev/docker-compose.yml up --build
```

2. Production-like stack:

```bash
docker compose -f docker_prod/docker-compose.yml up --build
```

3. Open:

- API: http://localhost:3000/api/pokemon
- Docs: http://localhost:3000/docs

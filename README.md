[![CI](https://github.com/Lukas166/tugas-ppl1/actions/workflows/ci.yml/badge.svg)](https://github.com/Lukas166/tugas-ppl1/actions/workflows/ci.yml)
[![CS](https://github.com/Lukas166/tugas-ppl1/actions/workflows/cs.yml/badge.svg)](https://github.com/Lukas166/tugas-ppl1/actions/workflows/cs.yml)

# Pokemon Card Collection API

## 1. Project Description

This project is a REST API for managing a Pokemon card collection. The API supports full CRUD operations (Create, Read, Update, Delete), request validation, Prisma + PostgreSQL integration, and OpenAPI/Swagger documentation.

## 2. API Documentation

[API_Docs.md](API_Docs.md)

## 3. Docker Installation Guide

[DockerDocs.md](DockerDocs.md)

## 4. Git Workflow

The branch usage can be seen at:

- [Branch List](https://github.com/Lukas166/tugas-ppl1/branches)

Branch types used in this project:

1. `main`
2. `develop`
3. `chore/setup-project`
4. `feat/ci-cd-cs`
5. `feat/docker`
6. `feat/pokemon-api`
7. `feat/swagger`
8. `feat/testing`

Conventional Commit usage can be verified at:

- [Commit History Main](https://github.com/Lukas166/tugas-ppl1/commits/main/)

## 5. Automation Status (GitHub Actions)

Workflows implemented:

1. `CI`: installs dependencies, runs lint, Prisma migrate deploy, Prisma generate, tests, and build.
2. `CS`: runs security scanning with dependency audit and Snyk (when token is available).
3. `CD`: builds and pushes Docker images after CI succeeds.


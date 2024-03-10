# What is Prisma?
Prisma is an Object Relational Mapping (ORMs) build to easily to interact, optimize, grow with database. Prisma used to build many servers like RESTful API, microservice,... Prisma is a layer between Webserver and Database.

## Prisma
- Prisma Client: Auto-generated and type-safe query builder for Node.js & TypeScript

- Prisma Migrate: Migration system

- Prisma Studio: GUI to view and edit data in your database.

## Schema
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
```
In this schema, you configure three things:

- Data source: Specifies your database connection (via an environment variable)
- Generator: Indicates that you want to generate Prisma Client
- Data model: Defines your application models

## Install Prisma to project
### Accessing your database with Prisma Client
#### Generating Prisma Client
Install Prisma Client by npm
```sh
npm install @prisma/client
```

#### Import and instantiate Prisma Client

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
```


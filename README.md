# Hotel Digital Menu

This is a mono-repo structure with separate client and server applications.

## Structure

- `client/`: Next.js frontend application.
- `server/`: Express backend application with Prisma and Supabase integration.

## Getting Started

### Prerequisites

- Node.js installed
- Database configured in `.env` files

### Installation

Run `npm install` in the root directory to install dependencies for both workspaces.

```bash
npm install
```

### Running the Application

You can run both client and server simultaneously from the root:

```bash
npm run dev
```

Or run them individually:

```bash
# Run client only
npm run client:dev

# Run server only
npm run server:dev
```

## Database

The Prisma schema is located in `server/prisma/schema.prisma`.

To generate the Prisma client for the server:
```bash
npm run generate --workspace=server
```

To generate the Prisma client for the client:
```bash
npm run prisma:generate --workspace=client
```

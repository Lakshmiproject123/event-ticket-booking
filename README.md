# Event Ticket Booking System with Seat Lock

## Overview

This is the backend service for the Event Ticket Booking System, built using the NestJS framework.
It provides APIs for event management, seat selection, a 2-minute seat lock mechanism, user authentication, and ticket booking.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Development](#development)
4. [Database Management](#database-management)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [API Documentation](#api-documentation)
8. [Project Structure](#project-structure)
9. [Contributing Guidelines](#contributing-guidelines)

## Prerequisites
```bash
Node.js (v16 or higher)
PostgreSQL
Docker (optional)
npm or yarn

## Project Setup

### Installation
npm install
npm install --legacy-peer-deps

### Environment Setup
1. Copy the appropriate .env file for your environment:
   cp .env
   ```
2. Update the environment variables as needed

### Database Setup
#### Using Docker (Recommended)
```bash
docker run --name event-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=eventdb -p 5433:5432  -d postgres

## Development

### Running the Application
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod

### Code Style and Linting
- We use ESLint and Prettier for code formatting
- Run linting: `npm run lint`
- Fix linting issues: `npm run lint:fix`

## Database Management

### Migration Commands
# Create a new migration
npx sequelize-cli migration:generate --name create-table --config src/config/config.js

# Run all migrations
npx sequelize-cli db:migrate --config src/config/config.js

# Undo last migration
npx sequelize-cli db:migrate:undo --config src/config/config.js

# Undo all migrations
npx sequelize-cli db:migrate:undo:all --config src/config/config.js

 ### Seeding Data
 # Run all seeders
npx sequelize-cli db:seed:all --config src/config/config.js

## Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

## Project Structure
```
event-ticket-booking/
├── migrations/               # Sequelize migrations
├── src/
│   ├── auth/                 # Authentication module (JWT)
│   ├── aws/
│   │    └── s3/              # AWS S3 file upload service
│   ├── bookings/             # Booking & seat confirmation
│   ├── config/               # DB & environment config
│   ├── events/               # Event CRUD
│   ├── roles/                # Role management (admin/user)
│   ├── seats/                # Seat creation, lock, availability
│   ├── users/                # User module + seeders
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/                     # Test files
├── .env
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md

## API Documentation
Swagger documentation is available at `http://localhost:3000/api/docs` when running in development mode
- API endpoints are documented using OpenAPI/Swagger decorators

## Contributing Guidelines
1. Create a new branch for each feature/bugfix
2. Follow the coding standards and naming conventions
3. Write unit tests for new features
4. Update documentation as needed
5. Submit pull requests for review

## Support and Resources
- [NestJS Documentation](https://docs.nestjs.com)
- [Sequelize Documentation](https://sequelize.org)
- Internal team documentation (contact team lead)

## License
[MIT licensed](LICENSE)

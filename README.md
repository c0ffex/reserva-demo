``´markdown
# Restaurant Reservation API

**Version:** 1.0.0

A RESTful API to manage restaurant reservations, built with Node.js, TypeScript, Express, and Drizzle ORM, backed by PostgreSQL and containerized with Docker Compose.

---

## 📦 Tech Stack

- **Runtime & Language:** Node.js, TypeScript
- **Web Framework:** Express
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Package Manager:** pnpm
- **Testing:** Vitest
- **Containerization:** Docker & Docker Compose

---

## 🚀 Prerequisites

1. **Node.js** (v16+)
2. **pnpm** (v7+)
3. **Docker** & **Docker Compose**

---

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>.git
   cd <repo-directory>
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment variables**
   Create a `.env` file in the project root with:
   ```dotenv
   DATABASE_URL=postgres://youruser:yourpassword@localhost:5432/yourdb
   ```

---

## 🐳 Database Setup (Docker Compose)

Bring up the PostgreSQL service:

```bash
# From project root
docker-compose up -d
```

Once the database is ready, run Drizzle ORM migrations:

```bash
pnpm run migrate:push
```

> **Note:** This runs the command defined in `package.json`:
> ```json
> "migrate:push": "drizzle-kit push --config ./drizzle.config.ts"
> ```

---

## ⚙️ Running the Application

Start the development server with hot-reloading:

```bash
pnpm run dev
```

The API will be available at `http://localhost:3000` by default.

---

## 🧪 Testing

Run the test suite (powered by Vitest):

```bash
pnpm run test
```

> *Note:* Not all tests may be written yet; contributions are welcome!

---

## 📚 API Endpoints

### Reservations

- **Create a new reservation**  
  `POST /api/reservations`  
  **Request Body:**
  ```json
  {
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "partySize": 4,
    "startTime": "2025-04-02T12:00:00Z",
    "endTime": "2025-04-02T14:00:00Z"
  }
  ```
  **Responses:**
  - `201 Created` (returns created reservation)
  - `400 Bad Request` (invalid input)

- **List all reservations**  
  `GET /api/reservations`  
  **Responses:**
  - `200 OK` (array of reservations)

### Operating Hours

- **Get available time slots**  
  `GET /api/operating-hours/available?date=YYYY-MM-DD&threshold=60`  
  **Query Parameters:**
  - `date` (required): Date to check availability (format: `YYYY-MM-DD`)
  - `threshold` (optional): Slot duration in minutes (default: `60`)
  
  **Responses:**
  - `200 OK` (array of available `TimeSlot` objects)
  - `400 Bad Request` (missing/invalid `date`)

---

## 📜 Package Scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "test": "vitest run",
    "migrate:push": "drizzle-kit push --config ./drizzle.config.ts"
  }
}
```

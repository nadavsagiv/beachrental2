# הרפסודה - Rental Management System

A rental management system for water sports equipment and beach beds.

## Features

- Track rentals for SUPs, beach beds, and snorkeling equipment
- Real-time pricing calculations
- Customer management
- Payment tracking
- Daily summaries
- Responsive web interface

## Tech Stack

- Frontend: Next.js with TypeScript
- Backend: Express.js with TypeScript
- Database: SQLite with Prisma ORM
- Styling: Tailwind CSS

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up the database:
```bash
cd server
npx prisma generate
npx prisma db push
```

4. Create environment files:

Server (.env in server directory):
```
PORT=3001
DATABASE_URL="file:../rental.db"
```

Client (.env.local in client directory):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## API Endpoints

- `GET /api/rentals` - List all rentals
- `POST /api/rentals` - Create new rental
- `PATCH /api/rentals/:id` - Update rental
- `POST /api/rentals/:id/end` - End rental
- `DELETE /api/rentals/:id` - Delete rental

## Pricing

- Beach Beds: 150₪ base (up to 3 people), +50₪ per additional person
- SUP: 60₪/30min, 100₪/hour
- Snorkeling: 35₪ fixed price for 2 hours 
# Schedule Planner API

Production-oriented NestJS backend for uploading, parsing, and querying university timetable PDFs.

## Stack

- NestJS
- Prisma ORM
- PostgreSQL
- `pdf-parse` for full-text extraction
- `pdfjs-dist` for positional grid parsing

## Modules

- `parser`: PDF parsing and structured session extraction
- `timetable`: upload and ingestion workflow
- `schedule`: batch schedule retrieval
- `user`: user registration and lookup
- `prisma`: database access layer

## Quick Start

```bash
npm install
copy .env.example .env
npx prisma migrate dev --name init
npm run start:dev
```

Swagger UI is exposed at `http://localhost:3000/docs`.

## Upload Flow

`POST /api/timetable/upload`

Form-data:

- `file`: timetable PDF
- `universityName`: string
- `departmentName`: string
- `semesterNumber`: number
- `academicYear`: string

The upload endpoint:

1. Stores the original PDF
2. Parses the timetable grid
3. Extracts batches dynamically
4. Replaces existing semester sessions
5. Persists normalized schedule data

## Auth Placeholder

`GET /api/schedule/me` uses mock middleware that reads `x-user-id` and exposes it as `req.user.id`.
In a real deployment, replace this with a Nest auth guard and JWT/session-based identity.

## Example Response

```json
{
  "batch": "25EE3",
  "schedule": {
    "Monday": [
      {
        "course": "ESS-102",
        "courseName": "Environmental Science",
        "type": "LECTURE",
        "start": "08:00",
        "end": "08:55",
        "room": "GB-202",
        "faculty": "FacultyNames"
      }
    ],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": []
  }
}
```

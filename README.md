# Ella Cloud Solutions Website

This project now includes a static multi-page website and a backend API for contact form submissions.

## Stack

- Frontend: Static HTML/CSS/JS
- Backend: Node.js + Express
- Database: PostgreSQL
- Email notifications: Nodemailer (optional)

For the live site, use a hosted PostgreSQL provider such as Neon or Supabase instead of local Docker.

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

Copy `.env.example` to `.env` and update values.

Recommended for live deployment:

- `DATABASE_URL`
- optionally `PGSSL=true` if your provider requires it

If you are testing locally with a local PostgreSQL install, you can use the individual PG variables instead.

Optional for email notifications:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_TO`

## 3) Run server

```bash
npm start
```

Server starts on `http://localhost:3000` by default.

## Hosted PostgreSQL Setup

1. Create a PostgreSQL database in Neon or Supabase.
2. Copy the connection string they provide.
3. Paste it into `.env` as `DATABASE_URL=...`.
4. Keep `PGSSL=true` if your provider requires SSL.
5. Run `npm start`.

The app will create the `contact_messages` table automatically on startup.

## Railway Deployment

### Deploy the backend

1. Create a new Railway project.
2. Connect your GitHub repository.
3. Add a Railway PostgreSQL database service to the project.
4. Copy the Railway database connection string into the backend environment as `DATABASE_URL`.
5. Set `PGSSL=true` if Railway requires SSL for your database connection.
6. Deploy the Node service using the `start` script from `package.json`.

### Point the contact form to the live backend

If the frontend is deployed separately from the backend, set the API base URL in `contact.html` using either:

- the `<meta name="api-base-url" content="https://your-railway-app.up.railway.app" />` tag, or
- a global `window.API_BASE_URL = 'https://your-railway-app.up.railway.app';`

If the frontend is served by the same Railway Node app, you can leave the API base URL empty and the form will use the relative `/api/contact` path.

### Live verification

1. Open the live frontend page.
2. Submit the contact form.
3. Check the Railway PostgreSQL table `contact_messages`.
4. Confirm the row appears with the submitted data.

## API Endpoints

- `GET /api/health` - checks API and DB connectivity
- `POST /api/contact` - saves contact form submissions

### `POST /api/contact` body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "service": "cloud",
  "message": "I need a cloud migration quote"
}
```

Required fields:

- `firstName`
- `email`
- `message`

## Frontend Integration

`contact.html` now submits to `/api/contact` using `fetch` and displays success/error feedback in the page.

Important:

Open pages via the running Node server (for example `http://localhost:3000/contact.html`), not by double-clicking HTML files, so API calls work correctly.

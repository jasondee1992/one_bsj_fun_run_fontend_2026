# OneBSJ Fun Run Registration Frontend

Local MVP frontend for the OneBSJ Fun Run Registration System.

## Stack

- Next.js 16 App Router
- TypeScript
- Plain CSS
- Browser `fetch` API client
- `qrcode.react` for local QR rendering

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Make sure the backend is running and matches:

   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

5. Open:

   - Public registration: `http://localhost:3000`
   - Admin login: `http://localhost:3000/admin/login`

## Pages

- `/` and `/register` - public runner registration form
- `/payment/[registrationId]` - pending payment instructions and status refresh
- `/status/[registrationId]` - registration confirmation and bib display
- `/admin/login` - local admin login
- `/admin/dashboard` - registration totals
- `/admin/registrations` - searchable, filterable registration list
- `/admin/registrations/[registrationId]` - admin registration detail

## Backend Coordination

The frontend expects the API contract documented in
[`docs/backend-api-contract.md`](docs/backend-api-contract.md).

I inspected `/home/udot/PROJECTS/one_bsj_fun_run_backend_2026` on April 17, 2026.
The frontend is aligned to the FastAPI routes present there:

- `POST /api/registrations`
- `GET /api/registrations/:registration_id`
- `POST /api/payments/:registration_id/create`
- `GET /api/payments/:registration_id`
- `POST /api/payments/:registration_id/simulate-paid`
- `POST /api/payments/webhook`
- `POST /api/admin/login`
- `GET /api/admin/dashboard/summary`
- `GET /api/admin/registrations`
- `GET /api/admin/registrations/:registration_id`

Default local admin credentials from the backend env example are
`admin` / `admin123`.

## Useful Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Local Payment Test

1. Start the backend at `http://127.0.0.1:8000`.
2. Start this frontend with `npm run dev`.
3. Register a runner from `/register`.
4. The app redirects to `/payment/:registration_id`.
5. The payment page creates or loads a backend payment session and renders a QR
   code from `qr_code_payload`.
6. In development mode, click `Simulate payment success`.
7. The backend marks payment as paid, assigns a bib, sends mock SMS, and the
   page refreshes to the confirmed state.

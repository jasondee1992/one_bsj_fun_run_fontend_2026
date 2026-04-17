# Backend API Contract

This document describes the backend routes the frontend currently calls.

Inspection note: `/home/udot/PROJECTS/one_bsj_fun_run_backend_2026` was checked
on April 17, 2026. The frontend is aligned to the FastAPI routes and Pydantic
schemas present in that backend checkout.

## Base URL

Frontend env:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

All paths below are relative to that base URL.

## Public Registration

### Create registration

`POST /registrations`

Request JSON:

```json
{
  "first_name": "Juan",
  "middle_name": "Santos",
  "last_name": "Dela Cruz",
  "suffix": "",
  "address": "123 Main St",
  "city": "Butuan",
  "province": "Agusan del Norte",
  "cellphone_number": "09171234567",
  "email": "runner@example.com",
  "birthday": "1995-03-20",
  "sex": "male",
  "emergency_contact_name": "Maria Dela Cruz",
  "emergency_contact_number": "09181234567",
  "race_category": "5K",
  "shirt_size": "M",
  "medical_conditions": "",
  "notes": "",
  "waiver_accepted": true,
  "privacy_consent_accepted": true
}
```

Expected response JSON can be either the registration object directly or wrapped
as `{ "data": registration }` / `{ "registration": registration }`.

The backend returns `registration_id` as the public identifier. The response
must include at least:

```json
{
  "registration_id": "REG-000001",
  "first_name": "Juan",
  "middle_name": "Santos",
  "last_name": "Dela Cruz",
  "cellphone_number": "09171234567",
  "email": "runner@example.com",
  "race_category": "5K",
  "shirt_size": "M",
  "payment_status": "PENDING_PAYMENT",
  "payment_reference": "PAY-000001",
  "bib_number": null
}
```

### Get registration

`GET /registrations/:registration_id`

Used by:

- pending payment page
- public status page

Expected fields:

- all registration fields from create response
- `payment_status`: `PENDING_PAYMENT`, `PAID`, `PAYMENT_FAILED`, `CANCELLED`
- `bib_number`: string or number when paid
- `sms_sent`, `sms_sent_at`: optional SMS confirmation status
- `payment_reference`, `provider_transaction_id`, `paid_at`
- `created_at`, `updated_at`

## Admin Authentication

### Login

`POST /admin/login`

Request:

```json
{
  "username": "admin",
  "password": "password"
}
```

Expected response:

```json
{
  "access_token": "local-dev-token",
  "token_type": "bearer"
}
```

The frontend also accepts `{ "token": "..." }`.

Authenticated admin requests send:

```http
Authorization: Bearer <token>
```

## Admin Registrations

### Summary

`GET /admin/dashboard/summary`

Expected response:

```json
{
  "total_registrations": 120,
  "paid": 80,
  "pending": 35,
  "failed": 3,
  "cancelled": 2
}
```

### List

`GET /admin/registrations`

Query params:

- `search`: name, cellphone, email, or bib number
- `status`: PENDING_PAYMENT, PAID, PAYMENT_FAILED, CANCELLED
- `category`: 3K, 5K, 10K
- `page`: number
- `page_size`: number

Expected response:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "page_size": 20
}
```

The frontend also accepts an array response for local MVP testing.

### Detail

`GET /admin/registrations/:id`

Expected response: one registration object with public, payment, bib, SMS, and
timestamp fields.

## Backend Notes

- The backend already provides local CORS for `http://localhost:3000`.
- The backend default admin credentials are `admin` / `admin123`.
- The frontend maps friendly UI statuses to backend status values:
  `pending` -> `PENDING_PAYMENT`, `paid` -> `PAID`,
  `failed` -> `PAYMENT_FAILED`, `cancelled` -> `CANCELLED`.
- The backend shirt size enum currently supports `XS`, `S`, `M`, `L`, `XL`,
  `2XL`, and `3XL`.

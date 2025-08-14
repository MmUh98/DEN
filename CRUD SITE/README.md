# Minimal PHP 8.2 + MySQL CRUD "Items" App

## Prerequisites

- PHP 8.2+
- MySQL 8+
- Composer

## Setup

1. **Clone and install dependencies:**
   ```sh
   composer install
   ```

2. **Create database and user:**
   - Import `db/schema.sql` in MySQL (adjust user/password as needed).

3. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in DB credentials.

4. **Run the app:**
   ```sh
   php -S localhost:8000 -t public
   ```
   - Or use Apache with `public/.htaccess`.

5. **Open the frontend:**
   - Go to [http://localhost:8000/views/index.html](http://localhost:8000/views/index.html)

6. **Test API:**
   - See cURL and Postman examples below.

## Troubleshooting

- **PDO errors:** Check DB credentials and user grants.
- **CORS issues:** Adjust allowed origins in `public/index.php`.
- **Permissions:** Ensure DB user has only CRUD on `items_app.items`.
- **CSRF errors:** Ensure cookies/session are enabled and token is sent.
- **Production:** Set `APP_ENV=production` to hide error details.

## Security Checklist

- All DB access uses prepared statements (no string concatenation).
- Input is validated and output is escaped.
- CSRF protection for same-origin POST/PUT/DELETE.
- 405 for unsupported methods; 415 for wrong content-type.
- DB user has only CRUD, no SUPER/FILE grants.
- No stack traces in production (`APP_ENV=production`).

## Manual Test Checklist

- [ ] Create, edit, delete item via frontend.
- [ ] Create, edit, delete via cURL/Postman.
- [ ] Validation errors (empty/long title).
- [ ] 404 for missing item.
- [ ] CSRF error for missing/invalid token.
- [ ] CORS preflight (OPTIONS) works.
- [ ] No stack traces in production.

## License

MIT

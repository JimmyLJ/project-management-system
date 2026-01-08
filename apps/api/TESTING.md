# API Testing

1. Copy `apps/api/.env.test.example` to `apps/api/.env.test` and update credentials.
2. Run migrations on the test database:
   `pnpm -C apps/api test:db:migrate`
3. Run tests:
   `pnpm -C apps/api test`

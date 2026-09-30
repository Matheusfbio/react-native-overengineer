# Payment backend

This Express API creates a hosted AbacatePay checkout for the product configured on the server. The API key and product ID are never accepted from the mobile app.

## Run locally

```sh
cd backend
npm install
cp .env.example .env
# Set ABACATEPAY_API_KEY in .env
npm run dev
```

The checkout endpoint is `POST http://localhost:3333/api/payments/checkout`. It returns `{ "url": "https://..." }`; the app should open that URL with `expo-web-browser`.

For an Android emulator, use `http://10.0.2.2:3333` as the app's API host. For a physical device, use the development computer's LAN IP. In production, deploy this backend behind HTTPS and set `CORS_ORIGINS` to the allowed web origins.

The checkout follows the billing cycle configured for the product in AbacatePay. Do not treat returning from the hosted page as proof of payment; payment confirmation should be implemented using a verified AbacatePay webhook before unlocking paid features.
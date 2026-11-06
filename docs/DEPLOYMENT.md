# Deployment guide

Target setup: **MongoDB Atlas** (database) → **Render** or **Railway** (API) → **Vercel** (client).
All three have free tiers. Deploy in this order, because each step needs a URL from the previous one.

## 1. Database — MongoDB Atlas

1. Create a free **M0** cluster at <https://cloud.mongodb.com>.
2. **Database Access** → add a database user with a strong generated password
   (role: *Read and write to any database*).
3. **Network Access** → allow your host. Render/Railway free tiers have no fixed outbound IP,
   so for a student project use `0.0.0.0/0`; tighten this if you move to a paid plan with static IPs.
4. **Connect → Drivers** → copy the connection string and add a database name, e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority`.
   URL-encode special characters in the password.

## 2. API — Render (recommended)

### Option A: Blueprint (uses `render.yaml`)

1. Push the repo to GitHub.
2. Render dashboard → **New → Blueprint** → select the repository.
3. Fill in the values Render asks for:
   - `MONGO_URI` — the Atlas string from step 1
   - `CLIENT_URL` — leave as `http://localhost:5173` for now; update after step 3
   `JWT_SECRET` is generated automatically; `NODE_ENV=production` and `TRUST_PROXY=1` are preset.
4. Deploy, then open `https://<service>.onrender.com/api/v1/health` — expect
   `"status":"ok","database":"connected"`.

### Option B: Manual web service

| Setting | Value |
| --- | --- |
| Root directory | `server` |
| Runtime | Node |
| Build command | `npm ci --omit=dev` |
| Start command | `npm start` |
| Health check path | `/api/v1/health` |

Environment variables: `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET` (long random string),
`JWT_EXPIRES_IN=7d`, `CLIENT_URL`, `TRUST_PROXY=1`. Render provides `PORT` automatically.

> Free Render instances sleep after ~15 minutes idle; the first request afterwards takes
> 30–60 seconds while it wakes up.

### Railway alternative

New project → **Deploy from GitHub repo** → set the service **Root Directory** to `server`.
Railway detects Node and runs `npm start`. Add the same environment variables as above
(`TRUST_PROXY=1`), then **Settings → Networking → Generate Domain**.

## 3. Client — Vercel

1. Vercel dashboard → **Add New → Project** → import the repository.
2. Settings:

   | Setting | Value |
   | --- | --- |
   | Root directory | `client` |
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Output directory | `dist` |

3. Environment variable: `VITE_API_URL=https://<your-api-domain>/api/v1`.
   Vite inlines it at build time, so **redeploy** after changing it.
4. `client/vercel.json` rewrites every path to `index.html`, so refreshing on routes like
   `/transactions` works.

## 4. Connect the two (CORS)

Set `CLIENT_URL` on the API to the Vercel URL, e.g. `https://trackexpense.vercel.app`
(no trailing slash), and redeploy the API. Several origins can be comma-separated, e.g.
`https://trackexpense.vercel.app,https://trackexpense-git-main-you.vercel.app`.

## 5. Smoke test

1. Open the Vercel URL → register a new account.
2. Add an expense and an income → the dashboard cards and charts update.
3. Set a budget, export CSV, reload a deep link such as `/budgets`.
4. Log out and back in.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| "Cannot reach the server" in the app | Wrong `VITE_API_URL`, API asleep (wait and retry), or `CLIENT_URL` does not exactly match the site origin (CORS) |
| API logs `Missing required environment variables` | `MONGO_URI` or `JWT_SECRET` not set |
| API logs `MongoServerSelectionError` | Atlas Network Access does not allow the host, or wrong credentials in `MONGO_URI` |
| Everyone gets `429 Too many requests` together | `TRUST_PROXY` not set to `1`, so all users share the proxy's IP |
| 404 when refreshing a page on Vercel | Root directory is not `client`, so `vercel.json` is not applied |

## Production checklist

- [ ] `JWT_SECRET` is long, random and different from development
- [ ] `.env` files are not committed (`git ls-files | grep .env` shows only `.env.example`)
- [ ] Atlas database user has a strong password; rotate it if it was ever shared
- [ ] `CLIENT_URL` lists only your real frontend origins
- [ ] `TRUST_PROXY=1` on Render/Railway
- [ ] CI is green on `main`

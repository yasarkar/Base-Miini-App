# Shelby's Ledger: Birmingham Escape

A 2D infinite runner game built as a **Farcaster Mini App** featuring Thomas Shelby. Dodge factory pipes and police blockades through the streets of Birmingham while competing for the top spot on the Garrison Leaderboard.

## 🎮 Features

- **2D Canvas Engine** — Continuous side-scrolling runner with parallax backgrounds
- **Thomas Shelby Character** — Pixel-art style with running animation, jump physics, and signature flat cap
- **Dynamic Obstacles** — Factory pipes and police blockades with increasing speed
- **Farcaster Mini App SDK** — Full lifecycle integration with `sdk.actions.ready()` on mount
- **Base Web3 Integration** — 0.5 USDC micro-payment to unlock the Pixel Flat Cap cosmetic
- **Garrison Leaderboard** — Top 10 scores via Spring Boot backend
- **Farcaster Sharing** — One-click cast intent to share scores on Warpcast

## 🏗 Architecture

```
shelbys-ledger-birmingham-escape/
├── frontend/          # Next.js (App Router, TypeScript, Tailwind)
│   ├── src/
│   │   ├── app/       # Pages, API routes, Frame endpoint
│   │   ├── engine/    # 2D Canvas game engine
│   │   ├── components/# React components (UI, overlays)
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # SDK helpers, config, Wagmi setup
│   │   └── providers/ # Wagmi + React Query providers
│   └── public/        # Static assets
├── backend/           # Spring Boot API
│   └── src/main/java/com/garrison/leaderboard/
│       ├── controller/ # REST endpoints
│       ├── service/    # Business logic
│       ├── model/      # JPA entity
│       ├── repository/ # Data access
│       ├── dto/        # Request/response objects
│       └── config/     # CORS, security
└── vercel.json        # Deployment config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Java 17+ (for backend)
- Maven (for backend)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at [http://localhost:8080](http://localhost:8080).

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Deployed app URL |
| `NEXT_PUBLIC_BACKEND_URL` | Spring Boot backend URL |
| `BACKEND_API_KEY` | Shared API key for backend auth |
| `NEXT_PUBLIC_CHAIN_ID` | Base chain ID (84532 = Sepolia, 8453 = Mainnet) |
| `NEXT_PUBLIC_USDC_ADDRESS` | USDC contract address |
| `NEXT_PUBLIC_PAYMENT_RECIPIENT` | Wallet to receive payments |
| `NEXT_PUBLIC_PAYMASTER_URL` | Base Paymaster URL for sponsored gas |

## 🧪 Game Controls

- **SPACE** or **↑** — Jump
- **Click/Tap** — Jump (mobile)
- **Click/Tap on Start** — Begin game

## 📡 API Endpoints

### Frontend (Next.js API Routes)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/score` | Submit a score (proxies to backend) |
| GET | `/api/score/leaderboard?limit=10` | Get top scores |
| POST | `/api/frame` | Farcaster Frame v2 handler |

### Backend (Spring Boot)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/scores` | Submit a score |
| GET | `/api/scores/leaderboard?limit=10` | Get top 10 leaderboard |

## 🧩 Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS, HTML5 Canvas
- **Web3:** Wagmi, Viem, @farcaster/miniapp-sdk
- **Backend:** Spring Boot 3.2, JPA, H2/PostgreSQL
- **Deployment:** Vercel (frontend), Railway/Render (backend)

## 📄 License

MIT
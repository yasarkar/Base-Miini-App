import type { GameConfig } from "@/engine/types";

export const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 400,
  gravity: 1800,
  jumpForce: -650,
  baseSpeed: 300,
  maxSpeed: 800,
  speedIncrement: 0.5,
  obstacleSpawnInterval: 1.5,
  groundHeight: 60,
};

export const PLAYER = {
  width: 40,
  height: 50,
  x: 80,
  y: 0, // calculated as canvasHeight - groundHeight - height
};

export const OBSTACLE = {
  pipeWidth: 30,
  pipeHeight: 50,
  barricadeWidth: 50,
  barricadeHeight: 40,
  minGap: 300,
  maxGap: 600,
};

export const SCORE = {
  pointsPerSecond: 10,
  comboMultiplier: 1.5,
};

export const COLORS = {
  sky: "#1a1a2e",
  skyTop: "#0f3460",
  skyBottom: "#1a1a2e",
  ground: "#2d1f0e",
  groundLine: "#4a3728",
  playerBody: "#c9a84c",
  playerHead: "#e8d5a3",
  playerEye: "#1a1a2e",
  playerCoat: "#3d2b1f",
  playerHat: "#2d1f0e",
  pipe: "#7f8c8d",
  pipeHighlight: "#95a5a6",
  barricade: "#c0392b",
  barricadeStripe: "#e74c3c",
  text: "#e0e0e0",
  textAccent: "#c9a84c",
  textShadow: "#000000",
  overlay: "rgba(0, 0, 0, 0.7)",
  buttonBg: "#c9a84c",
  buttonText: "#1a1a2e",
  buttonHover: "#d4b85a",
};

export const FARCASTER_CONFIG = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://shelbys-ledger.vercel.app",
  castIntent: (score: number) =>
    `I just scored ${score} in Shelby's Ledger: Birmingham Escape! 🏃💨 Can you beat my score? Play now:`,
};

export const API_CONFIG = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
};

export const BASE_CONFIG = {
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "84532"), // Base Sepolia default
  usdcAddress: process.env.NEXT_PUBLIC_USDC_ADDRESS || "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
  payAmount: "0.5", // 0.5 USDC
  paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL || "",
};
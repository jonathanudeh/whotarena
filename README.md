# 🃏 Whot Arena

**Whot Arena** is a vibrant, multiplayer web-based card gaming platform built for Nigerians to **play, compete, and win real cash** through live Whot matches and tournaments.

Players can join rooms, stake entry fees, and face off in 2–4 player games — with automated matchmaking, live gameplay, leaderboards, and referral rewards.

---

## 🚀 Tech Stack

**Frontend**

- ⚛️ React (with React Router)
- 🎨 Tailwind CSS (custom theme + Prettier plugin for Tailwind sorting)
- 🧭 Framer Motion (smooth UI animations)
- 🪶 Prettier + ESLint (for consistent, clean code)

**Backend & Database**

- 🧩 Supabase (for authentication, data storage, and admin panel)
- 🌐 WebSockets (for live multiplayer gameplay & state sync)
- 🔒 Supabase Auth (manual top-ups & withdrawals via admin dashboard)

**Hosting & Deployment**

- Vercel (frontend)
- Custom domain (e.g., `whotarena.app` or `whotarena.com`)

---

## 💡 Core Features

### 🎮 Game Modes

- **Live Whot Matches** (2, 3, or 4 players)
- Real-time gameplay synced via WebSockets
- Animated player turns, card drops, and winner screens

### 💰 Cash Play & Rewards

- Join rooms with specific **entry fees** and **prize pools**
- **Automatic pairing** with available opponents
- **deposits & withdrawals** (pilot stage)

### 🏆 Tournaments

- Scheduled events with thousands of participants
- Time-bound play (start & end windows)
- Tiered prize distribution and leaderboard rankings

### 🧑‍🤝‍🧑 Referral System

- “Refer & Earn ₦500 per friend” program
- Shareable referral link inside the dashboard
- Referral bonuses credited directly to wallet

### 👤 User Profiles

- Upload profile picture and edit details
- View balance, total games, and win history
- Manage deposits and withdrawals

### 🧠 Admin Dashboard

- Manage users, deposits, withdrawals, and tournaments
- Control room creation and prize distributions
- Monitor live games and player activity

---

1. if user is leaving a room without players in it the status should be finished so another player dont join that room while the user is out

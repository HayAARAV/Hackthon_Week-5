# HackBattle 2026 🚀

**Official Hackathon Website & Registration Portal**  
Organised by **Ignite Club** · Vishveshwarya Group of Institutions  
Built by **Team BugByte**

---

## Tech Stack — MERN
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Styling | Vanilla CSS (Dark Theme) |
| Email | Nodemailer (Gmail SMTP) |

---

## Project Structure
```
hackbattle-2026/
  client/         ← React frontend (Vite)
  server/         ← Node.js + Express API
  package.json    ← Root (concurrently scripts)
```

---

## Getting Started

### 1. Configure Environment

```bash
# Copy the example file and fill in your secrets
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/hackbattle
ADMIN_SECRET_TOKEN=a8f3k2p9xq7zlmno4rbvduse
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=bugbytex@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

### 2. Install Dependencies

```bash
# From project root
cd server && npm install
cd ../client && npm install
```

### 3. Run in Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | — | Health check |
| GET | `/api/check-roll/:rollNo` | — | Check roll number uniqueness |
| POST | `/api/register` | — | Team registration |
| GET | `/api/admin/:token` | Secret token | All registrations |
| GET | `/api/admin/:token/stats` | Secret token | Stats summary |
| GET | `/api/admin/:token/export` | Secret token | CSV download |

---

## Admin Dashboard

Access at: `http://localhost:5173/admin/a8f3k2p9xq7zlmno4rbvduse`

> ⚠️ Never share the admin URL publicly. Store the token only in `.env`.

---

## Event Details

| | |
|--|--|
| **Event** | HackBattle 2026 |
| **Start** | 18th March 2026, 11:00 AM |
| **End** | 19th March 2026, 11:00 AM |
| **Registration** | 13th–17th March 2026 |
| **Tracks** | Healthcare · Agriculture · Finance · AI · Student Innovation |

---

## Deployment

| Layer | Platform |
|-------|---------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas (M0 free) |
| Email | Gmail App Password |

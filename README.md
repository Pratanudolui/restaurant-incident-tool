# 🍕 Restaurant Incident Reporting Tool

An AI-powered web application for QSR/restaurant operations teams to report, track, and manage operational incidents in real time.

## 🌐 Live Demo
[View Deployed App](https://restaurant-incident-tool-lemon.vercel.app)

## ✨ Features
- **Incident Submission** — Structured form with title, description, category, severity, store location, and date/time
- **Smart Dashboard** — Filter by category, severity, status; search by keyword; real-time stats
- **Status Management** — Update incident lifecycle (Open → In Progress → Resolved → Closed)
- **AI Summaries** — Claude AI auto-generates concise summaries on every submission
- **Delete Incidents** — Remove resolved or erroneous reports

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes (Node.js) |
| Database | SQLite via better-sqlite3 |
| AI | Anthropic Claude API (claude-sonnet-4) |
| Deployment | Vercel |
| Icons | Lucide React |

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm

### Local Development
```bash
git clone https://github.com/YOUR-USERNAME/restaurant-incident-tool.git
cd restaurant-incident-tool
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 📐 Assumptions
- Single-store and multi-store submissions are both supported via free-text location field
- SQLite is used for simplicity and portability; easily swappable for PostgreSQL
- AI summary generation is non-blocking — incidents save even if AI call fails
- No authentication implemented; designed as an internal ops tool

## 📦 External Libraries
- `better-sqlite3` — synchronous SQLite driver for Node.js
- `lucide-react` — icon library
- `@anthropic-ai/sdk` (via fetch) — Claude AI for summaries

<div align="center">

# 💸 TrackVault

### Your Personal Finance Command Center

**Track smarter. Spend wiser. Save faster.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.16-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)](https://github.com/ayan2ko5/trackvault/pulls)
[![GitHub Stars](https://img.shields.io/github/stars/ayan2ko5/trackvault?style=for-the-badge&logo=github&color=gold)](https://github.com/ayan2ko5/trackvault)

<br />

> 🚀 A modern, full-stack personal finance management application built with **React 19 + TypeScript + Express 5 + Prisma ORM**. Take complete control of your income, expenses, budgets, savings goals, subscriptions, and more — all from one beautifully designed dashboard.

<br />

</div>

---

## 📑 Table of Contents

- [✨ Overview](#-overview)
- [🌟 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture](#-architecture)
- [⚡ Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📈 Performance & Optimization](#-performance--optimization)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## ✨ Overview

**TrackVault** is a comprehensive personal finance management platform designed for anyone who wants to take charge of their money. Whether you're tracking daily expenses, managing monthly budgets, planning savings goals, or monitoring recurring subscriptions — TrackVault puts everything inside one beautiful, intuitive dashboard.

Built from the ground up with **modern web technologies**, clean architecture, and a focus on performance and developer experience.

### 🎯 Why TrackVault?

| Problem | TrackVault Solution |
|---|---|
| Scattered expenses across apps | **Unified dashboard** with all financial data |
| No budget visibility | **Real-time budget tracking** with progress bars & alerts |
| Forgotten subscriptions | **Subscription tracker** with renewal notifications |
| No savings discipline | **Goal-based savings** with visual progress tracking |
| Lack of financial insights | **AI-powered insights engine** with spending analysis |
| Hard to export data | **One-click exports** to PDF, Excel, and CSV |

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- ✅ JWT-based secure authentication
- ✅ User registration & login
- ✅ Password hashing with Bcrypt
- ✅ Protected API routes & pages
- ✅ Persistent sessions
- ✅ Profile & security settings
- ✅ Rate limiting with Express Rate Limit

</td>
<td width="50%">

### 💳 Transaction Management
- ✅ Add income & expense transactions
- ✅ Edit & delete transactions
- ✅ Filter by month, category, and type
- ✅ Search transactions with keywords
- ✅ Payment method tracking
- ✅ Notes & descriptions support
- ✅ Transaction categorization

</td>
</tr>
<tr>
<td width="50%">

### 📊 Dashboard & Analytics
- ✅ Real-time financial summary
- ✅ Total balance overview
- ✅ Monthly income vs expenses
- ✅ Savings rate calculation
- ✅ Expense breakdown by category
- ✅ Recent transactions feed
- ✅ Interactive charts with Recharts

</td>
<td width="50%">

### 💰 Budget Management
- ✅ Category-wise budget allocation
- ✅ Visual progress bars
- ✅ Spending percentage tracking
- ✅ Remaining budget display
- ✅ ⚠️ Warning alerts at threshold
- ✅ 🚨 Exceeded budget notifications
- ✅ Monthly budget reset

</td>
</tr>
<tr>
<td width="50%">

### 🎯 Savings Goals
- ✅ Create custom savings goals
- ✅ Track progress visually
- ✅ Set target amounts & deadlines
- ✅ Current savings tracking
- ✅ Completion percentage
- ✅ Deadline countdown
- ✅ Goal completion celebrations

</td>
<td width="50%">

### 🔄 Subscription Tracker
- ✅ Monthly & yearly subscription plans
- ✅ Upcoming renewal alerts
- ✅ Total cost tracking
- ✅ Renewal date monitoring
- ✅ Active subscription management
- ✅ Cancel & edit subscriptions
- ✅ Spending by subscription category

</td>
</tr>
<tr>
<td width="50%">

### 🧠 Smart Insights
- ✅ AI-powered spending analysis
- ✅ Financial health score
- ✅ Spending pattern detection
- ✅ Personalized recommendations
- ✅ Monthly comparison trends
- ✅ Category-wise deep dive
- ✅ Savings optimization tips

</td>
<td width="50%">

### 📅 Calendar & Reports
- ✅ Calendar view of transactions
- ✅ Monthly financial reports
- ✅ Export to PDF, Excel, CSV
- ✅ Category breakdown reports
- ✅ Income vs expense trends
- ✅ Printable report formats
- ✅ Custom date range filtering

</td>
</tr>
</table>

### 🎨 User Experience

> 💡 Designed with a focus on usability, aesthetics, and responsiveness

- 🌗 **Dark & Light Mode** — seamless theme switching
- 📱 **Fully Responsive** — works on desktop, tablet, and mobile
- ✨ **Animated Components** — smooth transitions & micro-interactions
- 🔔 **Toast Notifications** — instant feedback on actions
- 💀 **Loading Skeletons** — polished loading states
- 🎨 **Premium UI** — modern glassmorphism & gradient design

---

## 🛠 Tech Stack

<div align="center">

### Frontend

| Technology | Version | Purpose |
|:---:|:---:|:---|
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | `19.2` | UI library with latest concurrent features |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | `6.0` | Type-safe JavaScript superset |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | `8.1` | Lightning-fast build tool & dev server |
| ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | `3.4` | Utility-first CSS framework |
| ![React Router](https://img.shields.io/badge/-React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) | `7.18` | Client-side routing & navigation |
| ![TanStack Query](https://img.shields.io/badge/-TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) | `5.x` | Async state management & data fetching |
| ![Zustand](https://img.shields.io/badge/-Zustand-453F39?style=flat-square&logo=npm&logoColor=white) | `5.0` | Lightweight global state management |
| ![React Hook Form](https://img.shields.io/badge/-React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white) | `7.80` | Performant form handling & validation |
| ![Zod](https://img.shields.io/badge/-Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) | `4.4` | Schema validation for forms & API |
| ![Recharts](https://img.shields.io/badge/-Recharts-22B5BF?style=flat-square&logo=npm&logoColor=white) | `3.9` | Interactive data visualization charts |
| ![Axios](https://img.shields.io/badge/-Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | `1.18` | HTTP client for API requests |
| ![Lucide](https://img.shields.io/badge/-Lucide_React-F56565?style=flat-square&logo=lucide&logoColor=white) | `1.22` | Beautiful & consistent icon set |

### Backend

| Technology | Version | Purpose |
|:---:|:---:|:---|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | `LTS` | JavaScript runtime environment |
| ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white) | `5.2` | Minimal & fast web framework |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | `6.0` | Type-safe backend development |
| ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) | `6.16` | Next-gen ORM for database access |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | `16+` | Powerful relational database |
| ![Neon](https://img.shields.io/badge/-Neon-00E699?style=flat-square&logo=neon&logoColor=black) | `Serverless` | Serverless Postgres platform |
| ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | `9.0` | Stateless authentication tokens |
| ![Helmet](https://img.shields.io/badge/-Helmet-000000?style=flat-square&logo=npm&logoColor=white) | `8.2` | HTTP security headers |
| ![Cloudinary](https://img.shields.io/badge/-Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white) | `2.10` | Cloud-based image management |
| ![Multer](https://img.shields.io/badge/-Multer-FF6600?style=flat-square&logo=npm&logoColor=white) | `2.2` | File upload handling middleware |
| ![Bcrypt](https://img.shields.io/badge/-Bcrypt-003A70?style=flat-square&logo=letsencrypt&logoColor=white) | `6.0` | Secure password hashing |

### Developer Tools

| Tool | Purpose |
|:---:|:---|
| ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) | Code linting & quality enforcement |
| ![Prettier](https://img.shields.io/badge/-Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black) | Automatic code formatting |
| ![Git](https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white) | Version control system |
| ![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white) | Repository hosting & collaboration |
| ![VS Code](https://img.shields.io/badge/-VS_Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white) | Primary code editor |
| ![Nodemon](https://img.shields.io/badge/-Nodemon-76D04B?style=flat-square&logo=nodemon&logoColor=white) | Auto-restarting dev server |
| ![PostCSS](https://img.shields.io/badge/-PostCSS-DD3A0A?style=flat-square&logo=postcss&logoColor=white) | CSS transformations & plugins |

</div>

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React 19)                         │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Pages   │  │Components│  │  Hooks   │  │  State (Zustand) │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │
│       │              │             │                  │             │
│       └──────────────┴─────────────┴──────────────────┘             │
│                              │                                      │
│                     Axios + TanStack Query                          │
│                              │                                      │
├──────────────────────────────┼──────────────────────────────────────┤
│                          REST API                                   │
├──────────────────────────────┼──────────────────────────────────────┤
│                                                                     │
│                        SERVER (Express 5)                           │
│                                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Routes  │→ │  Middleware   │→ │Controllers│→ │  Services    │   │
│  └──────────┘  │ (Auth, Zod)  │  └──────────┘  └──────┬───────┘   │
│                └──────────────┘                         │           │
│                                                         │           │
│                                              ┌──────────┴───────┐  │
│                                              │   Prisma ORM     │  │
│                                              └──────────┬───────┘  │
│                                                         │           │
├─────────────────────────────────────────────────────────┼──────────┤
│                                                         │           │
│                     PostgreSQL (Neon Serverless)         │           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|---|---|---|
| **Node.js** | `>=18.x` | [nodejs.org](https://nodejs.org) |
| **npm** | `>=9.x` | Comes with Node.js |
| **Git** | `Latest` | [git-scm.com](https://git-scm.com) |
| **PostgreSQL** | `16+` *(or use Neon)* | [neon.tech](https://neon.tech) |

---

### 📥 Step 1 — Clone the Repository

```bash
git clone https://github.com/ayan2ko5/trackvault.git
cd trackvault
```

### 📦 Step 2 — Install Dependencies

**Install server dependencies:**

```bash
cd server
npm install
```

**Install client dependencies:**

```bash
cd ../client
npm install
```

> 💡 **Tip:** Run `cd ..` to go back to the root before switching directories.

### 🔧 Step 3 — Database Setup

1. **Create a Neon account** at [neon.tech](https://neon.tech)
2. **Create a new project** and copy the connection string
3. **Navigate to the server directory** and generate the Prisma client:

```bash
cd server
npx prisma generate
npx prisma db push
```

> This will create all the tables in your Neon PostgreSQL database based on the Prisma schema.

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` directory:

```bash
touch server/.env
```

Add the following variables:

```env
# ═══════════════════════════════════════════
#          🗄️  DATABASE CONFIGURATION
# ═══════════════════════════════════════════
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

# ═══════════════════════════════════════════
#          🔑  AUTHENTICATION
# ═══════════════════════════════════════════
JWT_SECRET="your-super-secret-jwt-key-here"

# ═══════════════════════════════════════════
#          🌐  SERVER
# ═══════════════════════════════════════════
PORT=5000
```
---


## 📈 Performance & Optimization

| Feature | Implementation |
|---|---|
| ⚡ **Lightning Fast Builds** | Vite 8 with optimized HMR and code splitting |
| 🔄 **Smart Data Fetching** | TanStack Query with automatic caching & revalidation |
| 📦 **Lazy Loading** | Route-level code splitting for smaller bundles |
| 💾 **State Management** | Zustand for minimal re-renders & efficient state updates |
| 🖼 **Optimized Rendering** | React 19 concurrent features for smooth UI |
| 🗃 **Database Queries** | Prisma with optimized queries |
| 📉 **Bundle Size** | Tree-shaking & dead code elimination via Vite |

---

## 🔒 Security

| Layer | Implementation |
|---|---|
| 🔑 **Authentication** | JWT tokens with secure expiration policies |
| 🔐 **Password Security** | Bcrypt hashing with salt rounds |
| 🛡 **HTTP Security** | Helmet.js for secure HTTP headers |
| 🚦 **Rate Limiting** | Express Rate Limit to prevent brute-force attacks |
| ✅ **Input Validation** | Zod schema validation on both client & server |
| 🔒 **Protected Routes** | Middleware-based auth guard on all API endpoints |
| 🌐 **CORS** | Configured Cross-Origin Resource Sharing |
| 📁 **Environment Vars** | Sensitive config via `.env` (never committed) |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ayan2ko5/trackvault/issues).

### How to Contribute

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/your-username/trackvault.git

# 3. Create a feature branch
git checkout -b feature/amazing-feature

# 4. Make your changes and commit
git add .
git commit -m "feat: add amazing feature"

# 5. Push to your fork
git push origin feature/amazing-feature

# 6. Open a Pull Request 🎉
```

> 💡 Please follow the [Conventional Commits](https://www.conventionalcommits.org) specification for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License © 2026 Ayan Sheikh
```

---

## 👨‍💻 Author

<div align="center">

### **Ayan Sheikh**

[![GitHub](https://img.shields.io/badge/GitHub-ayan2ko5-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ayan2ko5)

</div>

---

<div align="center">

### ⭐ Support

**If you found this project helpful, please give it a ⭐ on GitHub!**

It motivates future development and helps others discover the project.

<br />

---

<br />

**💙 Built with Passion using Modern Web Technologies**

**Track • Save • Grow • Repeat**

<br />

⭐ **Happy Coding!** ⭐

<br />

</div>
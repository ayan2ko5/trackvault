<div align="center">

# ⚛️ TrackVault — Client

### The Frontend Experience

**Beautiful. Performant. Type-safe.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-453F39?style=for-the-badge&logo=npm&logoColor=white)](https://zustand-demo.pmnd.rs)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)

<br />

> The React 19 frontend powering TrackVault — featuring 12 page modules, 20+ reusable components, smart data fetching, a custom insight engine, and a premium dark/light theme UI.

</div>

---

## 📑 Table of Contents

- [✨ Overview](#-overview)
- [🛠 Tech Stack](#-tech-stack)
- [📈 Performance](#-performance)

---

## ✨ Overview

The **client** directory contains the entire React frontend for TrackVault. It is a fully independent single-page application that communicates with the Express backend via REST APIs.

### Key Highlights

- 🏗 **12 page modules** — Dashboard, Expenses, Income, Budgets, Goals, Subscriptions, Insights, Reports, Calendar, Categories, Settings (Profile + Security)
- 🧩 **20+ reusable components** — organized into `ui`, `cards`, `charts`, `forms`, `modals`, `tables`, and `layout`
- 🪝 **8 custom hooks** — encapsulating auth, CRUD operations, exports, and AI-driven insights
- 📡 **7 service files** — clean API abstraction layer with Axios interceptors
- 🧠 **Smart utilities** — insight engine, health score calculator, export helpers, and more
- 🛡 **Route guards** — `ProtectedRoute` & `GuestRoute` wrappers for auth-based access control

---

## 🛠 Tech Stack

<div align="center">

| Technology | Version | Role |
|:---:|:---:|:---|
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | `19.2` | UI library with concurrent rendering |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | `6.0` | Static type checking across the codebase |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | `8.1` | Dev server, HMR, and optimized production builds |
| ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | `3.4` | Utility-first styling with dark mode support |
| ![React Router](https://img.shields.io/badge/-React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) | `7.18` | Declarative routing with `createBrowserRouter` |
| ![TanStack Query](https://img.shields.io/badge/-TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) | `5.x` | Server state, caching, and background re-fetching |
| ![Zustand](https://img.shields.io/badge/-Zustand-453F39?style=flat-square&logo=npm&logoColor=white) | `5.0` | Minimal global state (auth, UI preferences) |
| ![React Hook Form](https://img.shields.io/badge/-React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white) | `7.80` | Performant, uncontrolled form management |
| ![Zod](https://img.shields.io/badge/-Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) | `4.4` | Runtime schema validation for forms |
| ![Axios](https://img.shields.io/badge/-Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | `1.18` | HTTP client with JWT interceptors |
| ![Recharts](https://img.shields.io/badge/-Recharts-22B5BF?style=flat-square&logo=npm&logoColor=white) | `3.9` | Composable chart components (Pie, Line, Bar) |
| ![Lucide React](https://img.shields.io/badge/-Lucide-F56565?style=flat-square&logo=lucide&logoColor=white) | `1.22` | Modern icon library |
| ![React Hot Toast](https://img.shields.io/badge/-React_Hot_Toast-E15D44?style=flat-square&logo=npm&logoColor=white) | `2.6` | Lightweight toast notifications |
| ![jsPDF](https://img.shields.io/badge/-jsPDF-D9534F?style=flat-square&logo=npm&logoColor=white) | `4.2` | Client-side PDF generation |
| ![SheetJS](https://img.shields.io/badge/-SheetJS_(xlsx)-217346?style=flat-square&logo=microsoftexcel&logoColor=white) | `0.18` | Excel & CSV export support |
| ![clsx](https://img.shields.io/badge/-clsx-888?style=flat-square&logo=npm&logoColor=white) | `2.1` | Conditional className composition |
| ![tailwind-merge](https://img.shields.io/badge/-tailwind--merge-06B6D4?style=flat-square&logo=npm&logoColor=white) | `3.6` | Intelligent Tailwind class merging |

</div>

---

## 📈 Performance

| Optimization | How |
|---|---|
| ⚡ **Instant HMR** | Vite 8 with sub-50ms hot module replacement |
| 📦 **Code Splitting** | Route-level splitting via React Router |
| 💾 **Smart Caching** | TanStack Query automatic caching & stale-while-revalidate |
| 🖼 **Skeleton Loading** | Content placeholders prevent layout shift |
| 🎨 **CSS Optimization** | Tailwind purges unused styles in production |
| 📉 **Tree Shaking** | Vite eliminates dead code from bundles |
| 🔄 **Minimal Re-renders** | Zustand's selective subscriptions + React 19 concurrent features |

---

<div align="center">

**Part of the [TrackVault](../README.md) monorepo**

💙 **Built with React 19 + TypeScript + Vite**

</div>

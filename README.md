# 🎟️ Capstone Event Management - Frontend

The client-side interface for the Event Management & Ticketing Platform. Built with **React**, **Vite**, and **TypeScript**, this application provides a seamless experience for users to browse events, organizations to manage their listings, and admins to oversee the platform.

---

## 📌 Features

* **🎭 Dynamic Event Discovery:** Browse latest events by category and venue.
* **🔐 Multi-Role Access:** Dedicated layouts and protected routes for **Users**, **Organizations**, and **Admins**.
* **📁 Component-Driven UI:** Modular architecture with reusable components like `Navbar`, `Footer`, and `Category`.
* **🔄 Context API:** Centralized state management for event data using `EventContext`.
* **🛡️ Protected Routing:** Secure route guards to prevent unauthorized access.
* **⚡ Modern Tooling:** Blazing fast development and builds powered by **Vite**.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | React 18+ |
| **Build Tool** | Vite |
| **Language** | TypeScript |
| **Styling** | CSS3 / Tailwind (Standard CSS in `App.css`) |
| **Routing** | React Router DOM |
| **State Management** | React Context API |
| **Linting** | ESLint |

---

## 📁 Project Structure

```text
capstone-frontend/
│── public/             # Static assets (favicons, manifest)
│── src/
│   ├── assets/         # Images, icons, and global styles
│   ├── components/     # UI Building blocks (Category, Navbar, etc.)
│   ├── context/        # Global state management (EventContext)
│   ├── Layout/         # Multi-role dashboard layouts (Admin, Org, User)
│   ├── pages/          # Full-page route components
│   ├── utility/        # Helper functions and constants
│   ├── App.tsx         # Main application component & routing
│   └── main.tsx        # React entry point
│
│── .gitignore          # Git exclusion rules
│── tsconfig.json       # TypeScript configuration
│── vite.config.ts      # Vite bundler configuration
└── package.json        # Dependencies and scripts
# Webmark - Modern Bookmark Management Platform

![Webmark Banner](https://github.com/user-attachments/assets/4603d5ce-63dd-41a5-b1ed-a1d33a3cebf1)

[![Project Status](https://img.shields.io/badge/status-active-brightgreen.svg)](https://webmark.site)
[![Render](https://img.shields.io/badge/deployed-Render-blue?logo=render)](https://webmark.site)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
![GitHub issues](https://img.shields.io/github/issues/chahatkesh/webmark)
![GitHub pull requests](https://img.shields.io/github/issues-pr/chahatkesh/webmark)

## Table of Contents

1. [Project Overview](#project-overview-)
2. [Key Features](#key-features-)
3. [Technology Stack](#technology-stack-)
4. [Installation](#installation-%EF%B8%8F)
5. [Usage Guide](#usage-guide-%EF%B8%8F)
6. [Documentation](#documentation-)
7. [Development Journey](#development-journey-%EF%B8%8F)
8. [Contributing](#contributing-)
9. [Acknowledgments](#acknowledgments-)
10. [Contact & Support](#contact--support-)

## Project Overview 📚

### The Bookmark Management Crisis

In today's digital landscape, users face critical challenges:

- 📌 73% of users lose important links due to poor organization
- ⏳ Average user spends 12 minutes daily searching for saved links
- 📱 68% struggle with cross-device bookmark synchronization
- 🔒 82% express concerns about bookmark security

### Webmark's Solution 💡

Webmark revolutionizes bookmark management with:

- **Centralized Hub**: Unified platform for all bookmarks
- **Smart Organization**: AI-powered categorization (coming soon)
- **Military-Grade Security**: End-to-end encryption
- **Cross-Platform Sync**: Instant access across devices

```mermaid
graph TD
    A[User Problem] --> B{Webmark Solution}
    B --> C[Centralized Storage]
    B --> D[Smart Organization]
    B --> E[Advanced Security]
    B --> F[Cross-Platform Sync]
```

## Key Features 🚀

### Core Functionality

| Feature               | Description                           | Tech Used           |
| --------------------- | ------------------------------------- | ------------------- |
| Drag & Drop Interface | Intuitive bookmark organization       | React Beautiful DnD |
| Smart Collections     | Automatic category suggestions        | Machine Learning    |
| Secure Sharing        | Encrypted collection sharing          | AES-256             |
| Advanced Search       | Full-text search across all bookmarks | ElasticSearch       |

### Upcoming Features

- 🧠 AI-Powered Insights (Q4 2024)
- 🌐 Browser Extension (Q1 2025)
- 👥 Team Collaboration (Q2 2025)

## Technology Stack 💻

### Frontend Architecture

```mermaid
graph TD;
    A[React.js] -->|Routing| B[React Router];
    A -->|Type Safety| C[TypeScript];
    A -->|State Management| D[React Query];
    D -->|Global State| E[Context API];
    A -->|Styling| F[Tailwind CSS];
    F -->|Accessible Components| G[Radix UI];
    A -->|Icons| H[Lucide React];
    A -->|Animations| I[Framer Motion];
    A -->|Drag & Drop| J[React Beautiful DnD];
    A -->|Development Tool| K[Vite];
    A -->|Notifications| L[React Toastify];
```

### Backend Architecture

```mermaid
graph TD;
    M[Node.js & Express.js] -->|Database| N[MongoDB];
    N -->|Modeling| O[Mongoose];
    M -->|Authentication| P[JWT];
    P -->|Password Hashing| Q[Bcrypt];
    M -->|Email Service| R[Nodemailer];
    M -->|Scheduled Tasks| S[Node-cron];
    M -->|Environment Variables| T[Dotenv];
```

### Technology Stack Table - Frontend

| Component        | Technology                                                                                                       | Purpose                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Framework        | ![React.js](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)                    | Modular UI components              |
| Routing          | ![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat&logo=react-router&logoColor=white) | SPA Navigation                     |
| Type Safety      | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)         | Static typing for fewer bugs       |
| State Management | ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat&logo=react-query&logoColor=white)      | Optimized data fetching            |
| UI Styling       | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)   | Utility-first CSS                  |
| UI Components    | ![Radix UI](https://img.shields.io/badge/Radix_UI-0078D7?style=flat)                                             | Accessible and unstyled components |
| Icons            | ![Lucide React](https://img.shields.io/badge/Lucide_React-000000?style=flat)                                     | Modern icon library                |
| Animations       | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)       | Smooth UI transitions              |
| Drag & Drop      | ![React DnD](https://img.shields.io/badge/React_DnD-F2315D?style=flat)                                           | Easy drag-and-drop interactions    |
| Development Tool | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)                           | Fast development builds            |
| Notifications    | ![React Toastify](https://img.shields.io/badge/React_Toastify-FFDD44?style=flat)                                 | User-friendly notifications        |

### Technology Stack Table - Backend

| Component             | Technology                                                                                                                                                                                              | Purpose                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Server Framework      | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white) | Backend framework                  |
| Database              | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)                                                                                                         | NoSQL storage                      |
| ORM                   | ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat)                                                                                                                                    | Elegant MongoDB modeling           |
| Authentication        | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)                                                                                                           | Secure token-based authentication  |
| Password Hashing      | ![Bcrypt](https://img.shields.io/badge/Bcrypt-FFC107?style=flat)                                                                                                                                        | Encrypts user passwords            |
| Email Service         | ![Nodemailer](https://img.shields.io/badge/Nodemailer-0078D7?style=flat)                                                                                                                                | Sends email notifications          |
| Task Scheduling       | ![Node-cron](https://img.shields.io/badge/Node_Cron-6D6875?style=flat)                                                                                                                                  | Automates tasks at scheduled times |
| Environment Variables | ![Dotenv](https://img.shields.io/badge/Dotenv-4CAF50?style=flat)                                                                                                                                        | Manages app secrets securely       |

### Technology Stack Table - DevOps & Configuration

| Component       | Technology                                                                                   | Purpose                       |
| --------------- | -------------------------------------------------------------------------------------------- | ----------------------------- |
| Version Control | ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)          | Collaborative code versioning |
| Code Quality    | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white) | Linting and formatting        |

### UI/UX Design Approach

The dashboard was meticulously designed to provide an optimal user experience across different devices.

#### Key UI/UX Focus Areas:

- **Navbar:** Compact, accessible design with an integrated welcome message and profile toggle.
- **Search and Category Management:** Adaptive positioning based on screen size and intuitive interactions.
- **Category Layout:** Structured to maintain readability and hierarchy across different device sizes.
- **Bookmark Display:** Consistent design ensuring readability and accessibility.
- **Drag-and-Drop Functionality:** Seamless and responsive interactions for both desktop and mobile.
- **Edit and Delete Options:** Accessible yet unobtrusive design to prevent accidental deletions.

## Installation ⚙️

### Prerequisites

- Node.js v16+
- MongoDB Atlas account
- Redis server

### Setup Guide

1. Clone repository:

```bash
git clone https://github.com/chahatkesh/webmark.git
cd webmark
```

2. Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

3. Configure environment:

```bash
# Create .env files
cp server/.env.example server/.env
cp client/.env.example client/.env
```

4. Start development servers:

```bash
# In separate terminals
cd server && npm run dev
cd client && npm run dev
```

## Usage Guide 🖥️

### Basic Commands

| Command         | Action                   |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Create production build  |
| `npm run test`  | Run test suite           |
| `npm run lint`  | Check code quality       |

### Project Structure 🗂️

```
webmark/
├── client/
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Third-party integrations
│       └── styles/       # Global CSS configurations
└── server/
    ├── config/           # Environment configurations
    ├── controllers/      # Business logic
    ├── middleware/       # Authentication layers
    └── models/           # MongoDB schemas
```

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '#242F40', 'primaryTextColor': '#FAFAFA', 'primaryBorderColor': '#556E8A', 'lineColor': '#85A3C2', 'secondaryColor': '#334F6C', 'tertiaryColor': '#1A2639' }}}%%

graph TD;
    subgraph "Frontend"
        FE["Frontend Client (React Application)"]:::frontendNode
        FE_Pages["UI Pages & Routing"]:::frontendNode
        FE_Components["Reusable UI Components"]:::frontendNode
        FE_Hooks["Custom Hooks"]:::frontendNode
        FE_Context["Global State Management"]:::frontendNode
    end
    subgraph "Backend"
        BE["Backend Server (Node.js/Express)"]:::backendNode
        BE_Config["Server Configuration (Database & Email)"]:::backendNode
        BE_Controllers["API Controllers"]:::backendNode
        BE_Middleware["Authentication Middleware"]:::backendNode
        BE_Models["Data Models (Mongoose Schemas)"]:::backendNode
        BE_Tasks["Scheduled Tasks (node-cron)"]:::backendNode
    end
    DB["Database (MongoDB)"]:::databaseNode

    %% Frontend internal relationships
    FE -->|"contains"|FE_Pages
    FE -->|"contains"|FE_Components
    FE -->|"contains"|FE_Hooks
    FE -->|"contains"|FE_Context
    FE_Pages -->|"renders"|FE_Components
    FE_Components -->|"uses"|FE_Hooks
    FE_Hooks -->|"updates"|FE_Context

    %% Interaction from Frontend to Backend
    FE_Components -->|"triggers API call"|BE_Controllers
    FE_Context -->|"supplies state"|BE_Controllers

    %% Backend internal flow
    BE -->|"routes request to"|BE_Controllers
    BE_Controllers -->|"invokes"|BE_Middleware
    BE_Controllers -->|"queries"|BE_Models
    BE_Models -->|"persists to"|DB
    BE_Controllers -->|"utilizes"|BE_Config
    BE_Config -->|"configures"|BE_Controllers
    BE_Tasks -->|"executes jobs on"|BE_Controllers

    %% Click Events for Frontend Components
    click FE "https://github.com/chahatkesh/webmark/tree/main/client" "Browse Frontend Code"
    click FE_Pages "https://github.com/chahatkesh/webmark/tree/main/client/src/pages" "Browse Pages"
    click FE_Components "https://github.com/chahatkesh/webmark/tree/main/client/src/components" "Browse Components"
    click FE_Hooks "https://github.com/chahatkesh/webmark/tree/main/client/src/hooks" "Browse Hooks"
    click FE_Context "https://github.com/chahatkesh/webmark/blob/main/client/src/context/StoreContext.jsx" "View Context Code"

    %% Click Events for Backend Components
    click BE "https://github.com/chahatkesh/webmark/tree/main/server" "Browse Backend Code"
    click BE_Config "https://github.com/chahatkesh/webmark/tree/main/server/config" "Browse Config"
    click BE_Controllers "https://github.com/chahatkesh/webmark/tree/main/server/controllers" "Browse Controllers"
    click BE_Middleware "https://github.com/chahatkesh/webmark/blob/main/server/middleware/authmiddleware.js" "View Middleware"
    click BE_Models "https://github.com/chahatkesh/webmark/tree/main/server/models" "Browse Models"
    click BE_Tasks "https://github.com/chahatkesh/webmark/blob/main/server/utils/cronJobs.js" "View Cron Jobs"

    %% Styling classes with better dark mode colors
    classDef frontendNode fill:#6366F1,color:#F8FAFC,stroke:#818CF8,stroke-width:2px,rx:5,ry:5;
    classDef backendNode fill:#10B981,color:#F8FAFC,stroke:#34D399,stroke-width:2px,rx:5,ry:5;
    classDef databaseNode fill:#F59E0B,color:#F8FAFC,stroke:#FBBF24,stroke-width:2px,rx:5,ry:5;

    %% Style the subgraphs
    style Frontend fill:#1F2937,color:#E5E7EB,stroke:#374151,stroke-width:2px;
    style Backend fill:#1F2937,color:#E5E7EB,stroke:#374151,stroke-width:2px;
```

## Development Journey 🛠️

### Milestones

1. **Phase 1: Foundation (4 weeks)**

   - Core bookmark CRUD operations
   - Basic user authentication
   - Initial UI components

2. **Phase 2: Enhancement (6 weeks)**

   - Advanced search implementation
   - Drag & drop functionality
   - Cross-device synchronization

3. **Phase 3: Optimization (2 weeks)**
   - Performance improvements
   - Security enhancements
   - Automated testing suite

## Contributing 🤝

### Development Workflow

1. Create feature branch:

```bash
git checkout -b feature/amazing-feature
```

2. Commit changes:

```bash
git commit -m "feat: add amazing feature"
```

3. Push to remote:

```bash
git push origin feature/amazing-feature
```

### Code Standards

- **Testing**: 90%+ test coverage required
- **Documentation**: JSDoc for all functions
- **Style Guide**: Airbnb JavaScript Style

## Documentation 📑

Webmark's codebase and features are documented to help developers and users understand the project better.

### Project Documentation

| Document | Description |
|---------|-------------|
| [Google Authentication Setup](./doc/GOOGLE_AUTH_SETUP.md) | Details on implementing Google OAuth authentication |
| [Error Handling System](./doc/ERROR_HANDLING_README.md) | Overview of application's error handling architecture |
| [API Documentation](./doc/API_DOCUMENTATION.md) | Complete reference for all API endpoints |
| [Bookmark Categorization](./doc/BOOKMARK_CATEGORIZATION.md) | Explanation of the bookmark categorization system |
| [Drag & Drop Functionality](./doc/DRAG_DROP_FUNCTIONALITY.md) | Details on drag and drop implementation |
| [Search Capabilities](./doc/SEARCH_FUNCTIONALITY.md) | Overview of search architecture and features |
| [User Onboarding](./doc/USER_ONBOARDING.md) | User registration and initial setup process |
| [Developer Setup Guide](./doc/DEVELOPER_SETUP.md) | Comprehensive guide for setting up development environment |

### Technical Documentation

- **Component Structure**: Detailed in the Project Structure section above
- **Code Comments**: Inline documentation within source code
- **Contributing Guidelines**: Explained in the Contributing section

## Acknowledgments 🙏

**Created with gratitude by**  
[![Chahat Kesharwani](https://img.shields.io/badge/Author-@chahatkesh-%2300ACEE?style=flat&logo=github)](https://github.com/chahatkesh)

**Special Thanks**  
• [Mehtab Sir](https://www.linkedin.com/in/mehtab-singh-00945b250/) - Mentor & Guide  
• Open Source Community - For endless inspiration

**Inspiration**  
Personal productivity challenges that sparked this solution

[![Say Thanks](https://img.shields.io/badge/Say%20Thanks-!-%231DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/intent/tweet?text=Thanks%20@chahatkesh%20for%20Webmark!)

## Contact & Support 📬

Need help? Reach out to us:

- 📧 Email: [ckesharwani4@gmail.com](mailto:ckesharwani4@gmail.com)
- 🌐 Website: [https://webmark.site](https://www.webmark.site)

---

<p align="center">🚀 Webmark - Modern Bookmark Management Platform 🚀</p>

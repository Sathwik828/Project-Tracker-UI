# Project Tracker UI: High-Performance Multi-View Task Dashboard

A professional-grade, highly interactive project management dashboard built with **React 19**, **TypeScript**, and **Tailwind CSS v4**. This project showcases advanced frontend engineering patterns, including zero-dependency drag-and-drop and custom high-performance virtualization.

## 📸 Screenshot

![Project Tracker UI](https://raw.githubusercontent.com/Sathwik828/Project-Tracker-UI/main/screenshot.png)

## 🚀 Key Features

### 1. Three Synchronized Views
- **Kanban Board**: A dynamic board with custom-built **native drag-and-drop** (zero external libraries).
- **List View**: A data-dense table with **custom virtual scrolling** to handle 500+ tasks at a constant 60fps.
- **Timeline View**: A monthly Gantt chart visualizing task durations and dependencies.

### 2. Advanced State & Filters
- **Zustand State Management**: Centralized store with atomic updates for lightning-fast UI state changes.
- **URL Synchronization**: Real-time syncing of view modes and filters (Status, Priority, Assignee, Date Range) with browser URL parameters.
- **Dynamic Task Management**: Full CRUD (Create, Read, Update, Delete) capabilities via a modal-based form UI.

### 3. Modern Technical Architecture
- **Tailwind CSS v4**: Utilizes the latest generation of Tailwind for high-performance styling and a premium glassmorphic UI.
- **Native DND Pattern**: Implements a robust "Placeholder & Transition" pattern for a smooth drag experience without the overhead of heavy libraries.
- **Virtualization Engine**: A custom calculation engine that only renders visible rows, making the app refresh-resilient and performant on low-end devices.

### 4. Real-time Collaboration (Simulation)
- Features simulated active users with dynamic presence indicators (avatars).
- Visual status pulses on task cards when other "collaborators" are interacting.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **State**: Zustand (with URL Sync)
- **Build Tool**: Vite 8

## 📦 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/project-tracker-ui.git
cd project-tracker-ui
npm install
```

### 2. Development Server
Run the app locally with:
```bash
npm run dev
```
The app will be available at `http://localhost:5173/?view=Kanban`.

### 3. Build for Production
To generate a production-ready bundle:
```bash
npm run build
```

## 🎯 Design Decisions
- **Zero-Library Core**: To ensure a small bundle size and maximum control, complex UI patterns like Drag-and-Drop and Virtual Scrolling were built from first principles.
- **Premium Aesthetics**: Focused on a sleek, high-contrast UI with smooth micro-animations and intuitive navigation.
- **Responsive Layout**: Designed from the ground up to support both desktop workflows and mobile on-the-go checking via a sidebar-overlay system.

---
Created by [Your Name] – Frontend Developer

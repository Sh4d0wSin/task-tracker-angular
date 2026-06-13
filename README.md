# Task Tracker — Angular Frontend

A task management app built with Angular 21. Connects to a Spring Boot REST API to persist tasks.

**Backend repo:** [task_tracker-springboot](https://github.com/Sh4d0wSin/task_tracker-springboot)

---

## Features

- Create, edit, and delete tasks
- Mark tasks complete with an animated strikethrough
- Auto-delete countdown (10s) with undo on completion
- Live "X of Y completed" summary
- Loading, error, and empty states

---

## Tech Stack

- [Angular 21](https://angular.dev)
- TypeScript
- Angular Signals (`signal`, `computed`)
- `HttpClient` for REST communication

---

## Prerequisites

- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)
- Backend running at `http://localhost:8080` — see [task_tracker-springboot](https://github.com/Sh4d0wSin/task_tracker-springboot) for setup

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser. The backend must be running for the app to load tasks.

---

## Project Structure

```
src/app/
├── models/
│   └── task.ts              # Task interface
├── services/
│   └── task.service.ts      # HTTP CRUD operations
└── tasks/
    ├── task-list/           # Page component — layout, form, task state
    └── task-item/           # Card component — single task display and editing
```

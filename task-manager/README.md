# Task Manager API

A simple RESTful Task Manager built with **Node.js**, **Express**, **MongoDB**, and **Docker**.

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose installed

### Run with Docker Compose

```bash
docker compose up --build
```

This starts three containers:
| Container | Port | Description |
|---|---|---|
| `task-manager-app` | `3000` | Node.js API |
| `task-manager-mongo` | `27017` | MongoDB database |
| `task-manager-mongo-ui` | `8081` | Mongo Express UI |

Visit **http://localhost:8081** (admin / admin123) to browse the database visually.

---

## 📡 API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/tasks` | List all tasks |
| GET | `/tasks?status=pending` | Filter by status |
| GET | `/tasks?priority=high` | Filter by priority |
| GET | `/tasks/:id` | Get a single task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

---

## 📝 Task Schema

```json
{
  "title": "Buy groceries",          // required
  "description": "Milk, eggs, bread",
  "status": "pending",               // pending | in-progress | done
  "priority": "medium",              // low | medium | high
  "dueDate": "2024-12-31"
}
```

---

## 🔧 Example Requests

### Create a task
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","priority":"high","dueDate":"2024-12-31"}'
```

### List all tasks
```bash
curl http://localhost:3000/tasks
```

### Update a task
```bash
curl -X PUT http://localhost:3000/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```

### Delete a task
```bash
curl -X DELETE http://localhost:3000/tasks/<id>
```

---

## 🛑 Stop the app

```bash
docker compose down
```

To also remove the MongoDB volume:
```bash
docker compose down -v
```

# Task Manager

A simple RESTful Task Manager built with **Node.js**, **Express**, and **MongoDB** — with a built-in UI served directly from the server.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)

### Run Locally

**1. Install dependencies**
```bash
npm install
```

**2. Configure environment**

Create a `.env` file in the root:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/taskmanager
```

**3. Start MongoDB**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**4. Start the server**
```bash
node src/index.js
```

**5. Open the UI**

Visit **http://localhost:3000** in your browser — the Task Manager UI loads directly.

---

## 🐳 Run with Docker (Alternative)

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose installed

```bash
docker compose up --build
```

This starts three containers:

| Container | Port | Description |
|---|---|---|
| `task-manager-app` | `3000` | Node.js API + UI |
| `task-manager-mongo` | `27017` | MongoDB database |
| `task-manager-mongo-ui` | `8081` | Mongo Express UI |

Visit **http://localhost:8081** (admin / admin123) to browse the database visually.

**Stop the app:**
```bash
docker compose down

# Also remove the MongoDB volume:
docker compose down -v
```

---

## 🖥️ UI

The app includes a built-in Task Manager UI served at `http://localhost:3000`. No separate frontend setup needed.

Features:
- Create tasks with title, description, status, priority, and due date
- Filter tasks by status or priority
- Update task status inline
- Delete tasks

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
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2024-12-31"
}
```

| Field | Required | Values |
|-------|----------|--------|
| `title` | ✅ Yes | Any string |
| `description` | No | Any string |
| `status` | No | `pending` \| `in-progress` \| `done` |
| `priority` | No | `low` \| `medium` \| `high` |
| `dueDate` | No | `YYYY-MM-DD` |

---

## 🔧 Example Requests

### Health check
```bash
curl http://localhost:3000/health
```

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

### Filter tasks
```bash
curl http://localhost:3000/tasks?status=pending
curl http://localhost:3000/tasks?priority=high
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

## 📁 Project Structure

```
task-manager/
├── src/
│   ├── index.js          # Express server + UI
│   ├── task.model.js     # Mongoose schema
│   └── task.routes.js    # API routes
├── .env                  # Environment variables
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

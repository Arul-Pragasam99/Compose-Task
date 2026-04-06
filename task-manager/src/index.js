require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const taskRoutes = require("./task.routes");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/taskmanager";

// Middleware
app.use(cors());
app.use(express.json());

// Serve UI
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Task Manager</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      --bg: #f5f5f5;
      --card: #ffffff;
      --text: #111111;
      --text-muted: #888888;
      --border: #e5e5e5;
      --border-hover: #bbbbbb;
      --input-bg: #ffffff;
      --input-border: #dddddd;
      --btn-bg: #111111;
      --btn-hover: #333333;
      --delete-color: #bbbbbb;

      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      padding: 2rem 1rem;
      transition: background 0.2s, color 0.2s;
    }

    body.dark {
      --bg: #0f0f0f;
      --card: #1a1a1a;
      --text: #f1f1f1;
      --text-muted: #aaaaaa;
      --border: #2a2a2a;
      --border-hover: #444444;
      --input-bg: #222222;
      --input-border: #333333;
      --btn-bg: #f1f1f1;
      --btn-hover: #cccccc;
      --delete-color: #555555;
    }

    .container { max-width: 700px; margin: 0 auto; }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    header h1 { font-size: 22px; font-weight: 600; color: var(--text); }
    header p { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

    .header-right { display: flex; align-items: center; gap: 12px; }

    #conn-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #639922; display: inline-block; margin-right: 6px;
    }
    #conn-label { font-size: 12px; color: var(--text-muted); }

    .theme-btn {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
      color: var(--text);
      transition: background 0.2s, border-color 0.2s;
    }
    .theme-btn:hover { border-color: var(--border-hover); background: var(--bg); }

    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .card h2 {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    .form-grid { display: flex; flex-direction: column; gap: 12px; }

    input[type="text"], input[type="date"], select, textarea {
      width: 100%;
      padding: 9px 12px;
      border: 1px solid var(--input-border);
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      background: var(--input-bg);
      color: var(--text);
      outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    input:focus, select:focus, textarea:focus { border-color: #888; }
    textarea { resize: vertical; }

    .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

    label.field-label {
      display: block;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    button.primary {
      background: var(--btn-bg);
      color: var(--card);
      border: none;
      padding: 9px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      align-self: flex-end;
      transition: background 0.2s;
    }
    body.dark button.primary { color: #111; }
    button.primary:hover { background: var(--btn-hover); }
    button.primary:active { transform: scale(0.98); }

    .filters {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .filters h2 {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }
    .filter-selects { display: flex; gap: 8px; }
    .filter-selects select { font-size: 12px; padding: 5px 8px; width: auto; }

    .task-list { display: flex; flex-direction: column; gap: 8px; }

    .task-item {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      transition: border-color 0.2s;
    }
    .task-item:hover { border-color: var(--border-hover); }
    .task-body { flex: 1; }
    .task-title { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 4px; }
    .task-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
    .task-due { font-size: 12px; color: var(--text-muted); }

    .badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; }
    .badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 999px; }
    .badge-pending     { background: #FAEEDA; color: #854F0B; }
    .badge-in-progress { background: #E6F1FB; color: #185FA5; }
    .badge-done        { background: #EAF3DE; color: #3B6D11; }
    .badge-low         { background: #f1f0ec; color: #5F5E5A; }
    .badge-medium      { background: #FAEEDA; color: #854F0B; }
    .badge-high        { background: #FCEBEB; color: #A32D2D; }

    .task-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .task-actions select { font-size: 12px; padding: 4px 8px; width: auto; }

    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--delete-color);
      font-size: 16px;
      line-height: 1;
      padding: 0;
      transition: color 0.2s;
    }
    .delete-btn:hover { color: #A32D2D; }

    .empty { text-align: center; font-size: 13px; color: var(--text-muted); padding: 2.5rem 0; }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      z-index: 999;
    }
    .toast.success { background: #EAF3DE; color: #3B6D11; border: 1px solid #97C459; }
    .toast.error   { background: #FCEBEB; color: #A32D2D; border: 1px solid #F09595; }

    @media (max-width: 500px) {
      .three-col { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>Task Manager</h1>
        <p>localhost:${PORT}</p>
      </div>
      <div class="header-right">
        <div>
          <span id="conn-dot"></span>
          <span id="conn-label">Checking...</span>
        </div>
        <button class="theme-btn" onclick="toggleTheme()" id="theme-btn">🌙 Dark</button>
      </div>
    </header>

    <div class="card">
      <h2>New Task</h2>
      <div class="form-grid">
        <input type="text" id="title" placeholder="Task title (required)" />
        <textarea id="description" rows="2" placeholder="Description (optional)"></textarea>
        <div class="three-col">
          <div>
            <label class="field-label">Status</label>
            <select id="status">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label class="field-label">Priority</label>
            <select id="priority">
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label class="field-label">Due Date</label>
            <input type="date" id="dueDate" />
          </div>
        </div>
        <button class="primary" onclick="createTask()">Add Task</button>
      </div>
    </div>

    <div class="filters">
      <h2>Tasks <span id="task-count" style="font-weight:400;">(0)</span></h2>
      <div class="filter-selects">
        <select id="filter-status" onchange="loadTasks()">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select id="filter-priority" onchange="loadTasks()">
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>

    <div class="task-list" id="task-list">
      <p class="empty">Loading tasks...</p>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const BASE = '';

    function toggleTheme() {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      document.getElementById('theme-btn').textContent = isDark ? '☀️ Light' : '🌙 Dark';
    }

    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
      document.getElementById('theme-btn').textContent = '☀️ Light';
    }

    async function checkHealth() {
      try {
        const res = await fetch(BASE + '/health');
        const data = await res.json();
        const dot = document.getElementById('conn-dot');
        const label = document.getElementById('conn-label');
        if (data.status === 'ok') {
          dot.style.background = '#639922';
          label.textContent = 'Connected';
        } else {
          dot.style.background = '#E24B4A';
          label.textContent = 'DB disconnected';
        }
      } catch {
        document.getElementById('conn-dot').style.background = '#E24B4A';
        document.getElementById('conn-label').textContent = 'Cannot reach API';
      }
    }

    function showToast(msg, type = 'success') {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.className = 'toast ' + type;
      t.style.opacity = '1';
      setTimeout(() => t.style.opacity = '0', 2500);
    }

    async function loadTasks() {
      const status = document.getElementById('filter-status').value;
      const priority = document.getElementById('filter-priority').value;
      let url = BASE + '/tasks?';
      if (status) url += 'status=' + status + '&';
      if (priority) url += 'priority=' + priority;
      try {
        const res = await fetch(url);
        const data = await res.json();
        renderTasks(data.data || []);
      } catch {
        document.getElementById('task-list').innerHTML = '<p class="empty" style="color:#A32D2D;">Cannot reach API</p>';
      }
    }

    function renderTasks(tasks) {
      document.getElementById('task-count').textContent = '(' + tasks.length + ')';
      const list = document.getElementById('task-list');
      if (!tasks.length) {
        list.innerHTML = '<p class="empty">No tasks yet. Add one above!</p>';
        return;
      }
      list.innerHTML = tasks.map(t => {
        const due = t.dueDate
          ? new Date(t.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : '';
        return \`
          <div class="task-item">
            <div class="task-body">
              <div class="badges">
                <span class="badge badge-\${t.status}">\${t.status}</span>
                <span class="badge badge-\${t.priority}">\${t.priority}</span>
              </div>
              <div class="task-title">\${t.title}</div>
              \${t.description ? \`<div class="task-desc">\${t.description}</div>\` : ''}
              \${due ? \`<div class="task-due">Due: \${due}</div>\` : ''}
            </div>
            <div class="task-actions">
              <select onchange="updateStatus('\${t._id}', this.value)">
                <option value="pending" \${t.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="in-progress" \${t.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="done" \${t.status === 'done' ? 'selected' : ''}>Done</option>
              </select>
              <button class="delete-btn" onclick="deleteTask('\${t._id}')" title="Delete">&#x2715;</button>
            </div>
          </div>\`;
      }).join('');
    }

    async function createTask() {
      const title = document.getElementById('title').value.trim();
      if (!title) { showToast('Title is required', 'error'); return; }
      const body = {
        title,
        description: document.getElementById('description').value.trim(),
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value,
        dueDate: document.getElementById('dueDate').value || undefined
      };
      try {
        const res = await fetch(BASE + '/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error();
        showToast('Task created!');
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('dueDate').value = '';
        loadTasks();
      } catch {
        showToast('Failed to create task', 'error');
      }
    }

    async function updateStatus(id, status) {
      try {
        await fetch(BASE + '/tasks/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        showToast('Status updated!');
        loadTasks();
      } catch {
        showToast('Update failed', 'error');
      }
    }

    async function deleteTask(id) {
      if (!confirm('Delete this task?')) return;
      try {
        await fetch(BASE + '/tasks/' + id, { method: 'DELETE' });
        showToast('Task deleted');
        loadTasks();
      } catch {
        showToast('Delete failed', 'error');
      }
    }

    checkHealth();
    loadTasks();
  </script>
</body>
</html>`);
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Routes
app.use("/tasks", taskRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Connect to MongoDB then start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
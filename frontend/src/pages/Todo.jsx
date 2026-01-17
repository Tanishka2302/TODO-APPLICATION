import { useEffect, useState } from 'react';
import "../App.css";

function App() {
  // ===== EXISTING STATE (UNCHANGED) =====
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  // ===== NEW STATE (FEATURES) =====
  const [activeView, setActiveView] = useState('today'); // today | upcoming | calendar | completed
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const today = new Date().toISOString().split('T')[0];


  // ===== FETCH TODOS (UNCHANGED) =====
  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ===== ADD TODO (MINIMAL EXTENSION ONLY) =====
  const addTodo = async () => {
    if (!title.trim()) return;

    const today = new Date().toISOString().split('T')[0];
    let taskDate = today;

    if (activeView === 'upcoming') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      taskDate = tomorrow.toISOString().split('T')[0];
    }

    if (activeView === 'calendar') {
      taskDate = selectedDate;
    }

    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        date: taskDate, // 👈 THIS is the key fix
      }),
    });

    setTitle('');
    fetchTodos();
  };

  // ===== TOGGLE COMPLETE (UNCHANGED) =====
  const toggleTodo = async (id, completed) => {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });

    fetchTodos();
  };

  // ===== DELETE TODO (UNCHANGED) =====
  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    fetchTodos();
  };

  // ===== DERIVED LOGIC (UNCHANGED) =====
  const filteredTodos = todos.filter(todo => {
    if (activeView === 'today') {
      return todo.date === today && !todo.completed;
    }
  
    if (activeView === 'upcoming') {
      return todo.date > today && !todo.completed;
    }
  
    if (activeView === 'calendar') {
      return todo.date === selectedDate;
    }
  
    if (activeView === 'completed') {
      return todo.completed;
    }
  
    return true;
  });
  
  const todaysTodos = todos.filter(t => t.date === today);
const completedToday = todaysTodos.filter(t => t.completed).length;

  // ===== JSX =====
  return (
    <div className="app-wrapper">
      <div className="app-layout">

        {/* LEFT SIDEBAR */}
        <aside className="sidebar">
          <h2 className="logo">My Tasks ✨</h2>

          <div className="nav">
            <button
              className={activeView === 'today' ? 'active' : ''}
              onClick={() => setActiveView('today')}
            >
              Today
            </button>

            <button
              className={activeView === 'upcoming' ? 'active' : ''}
              onClick={() => setActiveView('upcoming')}
            >
              Upcoming
            </button>

            <button
              className={activeView === 'calendar' ? 'active' : ''}
              onClick={() => setActiveView('calendar')}
            >
              Calendar
            </button>

            <button
              className={activeView === 'completed' ? 'active' : ''}
              onClick={() => setActiveView('completed')}
            >
              Completed
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          <div className="header">
            <h3 className="view-title">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h3>

            {activeView === 'calendar' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            )}
          </div>

          <div className="input-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task"
            />
            <button onClick={addTodo}>Add</button>
          </div>

          <ul className="todo-list">
          {filteredTodos.length === 0 && (
                <p style={{ opacity: 0.6, marginTop: "20px" }}>
                  No tasks here yet 👀
                </p>
              )}

            {filteredTodos.map(todo => (
              <li
                key={todo._id}
                className={`todo-item ${todo.completed ? 'done' : ''}`}
              >
                <label className="todo-left">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      toggleTodo(todo._id, todo.completed)
                    }
                  />
                  <span>{todo.title}</span>
                </label>

                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo._id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </main>

        {/* RIGHT PANEL */}
        <aside className="progress-panel">
          <h4>Today’s Progress</h4>
          <div className="progress-count">
            {completedToday} / {todaysTodos.length} completed
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: todaysTodos.length
                  ? `${(completedToday / todaysTodos.length) * 100}%`
                  : '0%',
              }}
            />
          </div>

          <p className="motivation">Keep going 💪</p>
        </aside>

      </div>
    </div>
  );
}

export default App;

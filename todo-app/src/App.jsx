import React, { useState } from 'react';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users] = useState([
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user1', password: 'user123', role: 'user' },
    { id: 3, username: 'user2', password: 'user123', role: 'user' }
  ]);
  
  const [todos, setTodos] = useState([
    { id: 1, title: 'Complete project report', priority: 'high', assignedTo: 'user1', completed: false, createdBy: 'admin' },
    { id: 2, title: 'Review code changes', priority: 'medium', assignedTo: 'user2', completed: false, createdBy: 'admin' },
    { id: 3, title: 'Update documentation', priority: 'low', assignedTo: 'user1', completed: true, createdBy: 'admin' },
    { id: 4, title: 'Fix bug in login', priority: 'high', assignedTo: 'user2', completed: false, createdBy: 'user2' },
  ]);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [newTodo, setNewTodo] = useState({ title: '', priority: 'medium', assignedTo: '' });
  const [editTodo, setEditTodo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    const todo = {
      id: Date.now(),
      title: newTodo.title,
      priority: newTodo.priority,
      assignedTo: currentUser.role === 'admin' ? newTodo.assignedTo : currentUser.username,
      completed: false,
      createdBy: currentUser.username
    };
    setTodos([...todos, todo]);
    setNewTodo({ title: '', priority: 'medium', assignedTo: '' });
    setShowAddForm(false);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    if (currentUser.role === 'admin' || todos.find(t => t.id === id)?.createdBy === currentUser.username) {
      setTodos(todos.filter(todo => todo.id !== id));
    } else {
      alert('You can only delete your own tasks');
    }
  };

  const updateTodo = (e) => {
    e.preventDefault();
    if (!editTodo.title.trim()) return;
    setTodos(todos.map(todo => 
      todo.id === editTodo.id ? editTodo : todo
    ));
    setEditTodo(null);
  };

  const filteredTodos = todos.filter(todo => {
    const priorityMatch = filterPriority === 'all' || todo.priority === filterPriority;
    const userMatch = filterUser === 'all' || todo.assignedTo === filterUser;
    const roleMatch = currentUser.role === 'admin' || todo.assignedTo === currentUser.username;
    return priorityMatch && userMatch && roleMatch;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  if (!currentUser) {
    return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>📋 Todo App</h1>
          <h2 style={styles.subtitle}>Login</h2>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>
          <div style={styles.demoCredentials}>
            <h3>Demo Credentials:</h3>
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>User:</strong> user1 / user123 or user2 / user123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Todo App</h1>
        <div style={styles.userInfo}>
          <span style={roleBadge(currentUser.role)}>{currentUser.role.toUpperCase()}</span>
          <span style={styles.username}>{currentUser.username}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      </div>

      <div style={styles.controls}>
        <button onClick={() => setShowAddForm(!showAddForm)} style={styles.addButton}>
          {showAddForm ? 'Cancel' : '+ Add Task'}
        </button>
        <div style={styles.filters}>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={styles.select}>
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)} style={styles.select}>
            <option value="all">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.username}>{user.username}</option>
            ))}
          </select>
        </div>
      </div>

      {showAddForm && (
        <div style={styles.modal}>
          <form onSubmit={addTodo} style={styles.form}>
            <h2>Add New Task</h2>
            <input
              type="text"
              placeholder="Task title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
              style={styles.input}
              required
            />
            <select value={newTodo.priority} onChange={(e) => setNewTodo({...newTodo, priority: e.target.value})} style={styles.input}>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            {currentUser.role === 'admin' && (
              <select value={newTodo.assignedTo} onChange={(e) => setNewTodo({...newTodo, assignedTo: e.target.value})} style={styles.input} required>
                <option value="">Assign to...</option>
                {users.filter(u => u.role === 'user').map(user => (
                  <option key={user.id} value={user.username}>{user.username}</option>
                ))}
              </select>
            )}
            <button type="submit" style={styles.button}>Add Task</button>
          </form>
        </div>
      )}

      {editTodo && (
        <div style={styles.modal}>
          <form onSubmit={updateTodo} style={styles.form}>
            <h2>Edit Task</h2>
            <input
              type="text"
              value={editTodo.title}
              onChange={(e) => setEditTodo({...editTodo, title: e.target.value})}
              style={styles.input}
              required
            />
            <select value={editTodo.priority} onChange={(e) => setEditTodo({...editTodo, priority: e.target.value})} style={styles.input}>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            {currentUser.role === 'admin' && (
              <select value={editTodo.assignedTo} onChange={(e) => setEditTodo({...editTodo, assignedTo: e.target.value})} style={styles.input}>
                {users.filter(u => u.role === 'user').map(user => (
                  <option key={user.id} value={user.username}>{user.username}</option>
                ))}
              </select>
            )}
            <div style={styles.modalButtons}>
              <button type="submit" style={styles.button}>Save</button>
              <button type="button" onClick={() => setEditTodo(null)} style={styles.cancelButton}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.todoList}>
        {filteredTodos.length === 0 ? (
          <p style={styles.emptyMessage}>No tasks found</p>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} style={todoItemStyle(todo.completed)}>
              <div style={styles.todoHeader}>
                <div style={styles.todoTitle}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    style={styles.checkbox}
                  />
                  <span style={todoTextStyle(todo.completed)}>{todo.title}</span>
                </div>
                <span style={priorityBadge(getPriorityColor(todo.priority))}>
                  {todo.priority.toUpperCase()}
                </span>
              </div>
              <div style={styles.todoMeta}>
                <span>👤 {todo.assignedTo}</span>
                <span>Created by: {todo.createdBy}</span>
              </div>
              <div style={styles.todoActions}>
                {(currentUser.role === 'admin' || todo.createdBy === currentUser.username) && (
                  <>
                    <button onClick={() => setEditTodo(todo)} style={styles.editButton}>Edit</button>
                    <button onClick={() => deleteTodo(todo.id)} style={styles.deleteButton}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={styles.stats}>
        <h3>Statistics</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{filteredTodos.length}</span>
            <span style={styles.statLabel}>Total Tasks</span>
          </div>
          <div style={styles.statCard}>
            <span style={{...styles.statNumber, color: '#ef4444'}}>{filteredTodos.filter(t => t.priority === 'high' && !t.completed).length}</span>
            <span style={styles.statLabel}>High Priority</span>
          </div>
          <div style={styles.statCard}>
            <span style={{...styles.statNumber, color: '#22c55e'}}>{filteredTodos.filter(t => t.completed).length}</span>
            <span style={styles.statLabel}>Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  loginBox: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '40px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  title: { textAlign: 'center', color: '#333', marginBottom: '10px' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', border: '2px solid #e0e0e0', borderRadius: '5px', fontSize: '14px' },
  button: { padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  username: { fontWeight: 'bold', color: '#333' },
  logoutButton: { padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  addButton: { padding: '12px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  filters: { display: 'flex', gap: '10px' },
  select: { padding: '10px', border: '2px solid #e0e0e0', borderRadius: '5px', fontSize: '14px', background: 'white' },
  modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', zIndex: 1000, minWidth: '400px' },
  modalButtons: { display: 'flex', gap: '10px', marginTop: '15px' },
  cancelButton: { padding: '12px 24px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  todoList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  todoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  todoTitle: { display: 'flex', alignItems: 'center', gap: '10px' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  todoMeta: { display: 'flex', gap: '20px', marginBottom: '10px', fontSize: '14px', color: '#666' },
  todoActions: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  editButton: { padding: '6px 12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' },
  deleteButton: { padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' },
  emptyMessage: { textAlign: 'center', color: '#666', padding: '40px', fontSize: '18px' },
  stats: { marginTop: '30px', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginTop: '15px' },
  statCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '10px' },
  statNumber: { fontSize: '32px', fontWeight: 'bold', color: '#667eea' },
  statLabel: { fontSize: '14px', color: '#666', marginTop: '5px' },
  demoCredentials: { marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '5px' }
};

const todoItemStyle = (completed) => ({
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  opacity: completed ? 0.7 : 1,
  transition: 'all 0.3s'
});

const todoTextStyle = (completed) => ({
  fontSize: '16px',
  textDecoration: completed ? 'line-through' : 'none',
  color: completed ? '#999' : '#333'
});

const priorityBadge = (color) => ({
  padding: '5px 12px',
  background: color,
  color: 'white',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold'
});

const roleBadge = (role) => ({
  padding: '5px 12px',
  background: role === 'admin' ? '#ef4444' : '#667eea',
  color: 'white',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold'
});

export default App;

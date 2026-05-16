import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, ListTodo, FolderKanban, Users, Activity } from 'lucide-react';

const AdminDashboard = ({ tasks }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [projRes, userRes] = await Promise.all([
          axios.get('/api/projects'),
          axios.get('/api/auth/users')
        ]);
        setProjects(projRes.data);
        setUsers(userRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      }
    };
    fetchAdminData();
  }, []);

  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE');

  return (
    <>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Command Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Overview of all platform activity.</p>
        </div>
        <Link to="/projects" className="btn">
          <FolderKanban size={18} /> Manage Projects
        </Link>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '40px' }}>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <FolderKanban size={24} />
          </div>
          <div className="stat-info">
            <h3>{projects.length}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <ListTodo size={24} />
          </div>
          <div className="stat-info">
            <h3>{tasks.length}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{users.filter(u => u.role === 'MEMBER').length}</h3>
            <p>Active Members</p>
          </div>
        </div>
        <div className="glass-panel stat-card" style={{ border: overdue.length > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : undefined }}>
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <h3 style={{ color: overdue.length > 0 ? 'var(--danger)' : undefined }}>{overdue.length}</h3>
            <p>Platform Overdue</p>
          </div>
        </div>
      </div>

      <div className="split-grid">
        <div>
          <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} /> Recent Tasks</h2>
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            {tasks.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks found.</div>
            ) : (
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
                  <tbody>
                    {tasks.slice(0, 5).map(task => (
                      <tr key={task.id} style={{ borderBottom: '1px solid var(--surface-border)' }} className="hover-row">
                        <td style={{ padding: '16px', fontWeight: 500 }}>{task.title}</td>
                        <td style={{ padding: '16px' }}><span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><FolderKanban size={20} /> Active Projects</h2>
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            {projects.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No projects found.</div>
            ) : (
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
                  <tbody>
                    {projects.slice(0, 5).map(project => (
                      <tr key={project.id} style={{ borderBottom: '1px solid var(--surface-border)' }} className="hover-row">
                        <td style={{ padding: '16px', fontWeight: 500 }}>
                          <Link to={`/projects/${project.id}`}>{project.name}</Link>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{project.owner?.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const MemberDashboard = ({ tasks }) => {
  const { user } = useAuth();
  const todo = tasks.filter(t => t.status === 'TODO');
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
  const done = tasks.filter(t => t.status === 'DONE');
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE');

  const completionRate = tasks.length === 0 ? 0 : Math.round((done.length / tasks.length) * 100);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Workspace</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}. Here are your priorities.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Completion Rate</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{completionRate}%</div>
          <div className="progress-bg" style={{ width: '150px' }}>
            <div className="progress-bar" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '40px' }}>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: '#f1f5f9', color: '#64748b' }}>
            <ListTodo size={24} />
          </div>
          <div className="stat-info">
            <h3>{todo.length}</h3>
            <p>To Do</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>{inProgress.length}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>{done.length}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="glass-panel stat-card" style={{ border: overdue.length > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : undefined }}>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <h3 style={{ color: overdue.length > 0 ? 'var(--danger)' : undefined }}>{overdue.length}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px' }}>My Active Tasks</h2>
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {tasks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>You have no tasks assigned. Great job!</div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Task</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Project</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Due Date</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.filter(t => t.status !== 'DONE').map(task => (
                  <tr key={task.id} style={{ borderBottom: '1px solid var(--surface-border)' }} className="hover-row">
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 500 }}>{task.title}</div>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{task.project.name}</td>
                    <td style={{ padding: '16px 24px', color: task.dueDate && new Date(task.dueDate) < new Date() ? 'var(--danger)' : 'var(--text-muted)' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div className="container" style={{ padding: '40px 24px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      {user?.role === 'ADMIN' ? <AdminDashboard tasks={tasks} /> : <MemberDashboard tasks={tasks} />}
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, ArrowLeft } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assigneeId: '' });

  useEffect(() => {
    fetchProject();
    if (user?.role === 'ADMIN') fetchUsers();
  }, [id, user]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      console.error('Failed to fetch project', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/auth/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { ...newTask, projectId: id, assigneeId: newTask.assigneeId || null });
      setShowModal(false);
      setNewTask({ title: '', description: '', dueDate: '', assigneeId: '' });
      fetchProject();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status });
      fetchProject();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px 24px', textAlign: 'center' }}>Loading...</div>;
  if (!project) return <div className="container" style={{ padding: '40px 24px', textAlign: 'center' }}>Project not found.</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{project.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{project.description}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Task
          </button>
        )}
      </div>

      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {project.tasks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks in this project.</div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Task</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Assignee</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Due Date</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {project.tasks.map((task) => (
                  <tr key={task.id} style={{ borderBottom: '1px solid var(--surface-border)', transition: 'background 0.2s' }} className="hover-row">
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 500 }}>{task.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{task.description}</div>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>
                      {task.assignee ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                            {task.assignee.name.charAt(0).toUpperCase()}
                          </div>
                          {task.assignee.name}
                        </div>
                      ) : 'Unassigned'}
                    </td>
                    <td style={{ padding: '16px 24px', color: task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'var(--danger)' : 'var(--text-muted)' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {(user?.role === 'ADMIN' || user?.id === task.assigneeId) && (
                        <select 
                          className="form-control" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: '400px', background: 'var(--bg-color)', border: '1px solid var(--surface-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', padding: '16px', maxHeight: '95vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Create Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label style={{ marginBottom: '2px', fontSize: '0.85rem' }}>Title</label>
                <input type="text" className="form-control" style={{ padding: '6px 10px', fontSize: '0.9rem' }} required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label style={{ marginBottom: '2px', fontSize: '0.85rem' }}>Description</label>
                <input type="text" className="form-control" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label style={{ marginBottom: '2px', fontSize: '0.85rem' }}>Assignee</label>
                <select className="form-control" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={newTask.assigneeId} onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}>
                  <option value="">Unassigned</option>
                  {users.filter(u => u.role === 'MEMBER').map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ marginBottom: '2px', fontSize: '0.85rem' }}>Due Date</label>
                <input type="date" className="form-control" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.9rem' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn" style={{ padding: '4px 12px', fontSize: '0.9rem' }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;

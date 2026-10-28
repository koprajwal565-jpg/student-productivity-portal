import { useMemo, useState } from 'react';
import { Check, Circle, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { formatDate, localDateString } from '../utils/date.js';

const priorityOrder = { High: 0, Medium: 1, Low: 2 };

export default function Tasks({ tasks, onAdd, onEdit, onDelete, onToggle }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All status');
  const [priority, setPriority] = useState('All priorities');
  const [subject, setSubject] = useState('All subjects');
  const [sort, setSort] = useState('deadline');
  const subjects = [...new Set(tasks.map((task) => task.subject))].sort((a, b) => a.localeCompare(b));

  const filtered = useMemo(() => tasks.filter((task) => {
    const matchesQuery = `${task.title} ${task.description} ${task.subject}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'All status' || task.status === status) &&
      (priority === 'All priorities' || task.priority === priority) &&
      (subject === 'All subjects' || task.subject === subject);
  }).sort((a, b) => {
    if (sort === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority] || a.dueDate.localeCompare(b.dueDate);
    return a.dueDate.localeCompare(b.dueDate);
  }), [tasks, query, status, priority, subject, sort]);

  function confirmDelete(task) {
    if (window.confirm(`Delete “${task.title}”? This cannot be undone.`)) onDelete(task.id);
  }

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div><div className="eyebrow">STAY ON TOP OF IT</div><h1>My tasks</h1><p>Keep assignments and deadlines organized in one place.</p></div>
        <button className="btn btn-primary" onClick={onAdd}><Plus size={18} /> Add task</button>
      </div>
      <section className="surface-card task-surface">
        <div className="task-toolbar">
          <div className="search-wrap"><Search size={17} /><input aria-label="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks..." /></div>
          <select aria-label="Filter by status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            {['All status', 'Pending', 'In Progress', 'Completed'].map((value) => <option key={value}>{value}</option>)}
          </select>
          <select aria-label="Filter by priority" className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
            {['All priorities', 'High', 'Medium', 'Low'].map((value) => <option key={value}>{value}</option>)}
          </select>
          <select aria-label="Filter by subject" className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option>All subjects</option>{subjects.map((value) => <option key={value}>{value}</option>)}
          </select>
          <select aria-label="Sort tasks" className="form-select sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="deadline">Sort: Deadline</option><option value="priority">Sort: Priority</option>
          </select>
        </div>
        {filtered.length ? <div className="table-responsive">
          <table className="table task-table align-middle">
            <thead><tr><th scope="col">TASK</th><th scope="col">SUBJECT</th><th scope="col">DUE DATE</th><th scope="col">PRIORITY</th><th scope="col">STATUS</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr></thead>
            <tbody>{filtered.map((task) => {
              const overdue = task.status !== 'Completed' && task.dueDate < localDateString();
              return <tr key={task.id}>
                <td className="task-name-cell"><button className={`task-check ${task.status === 'Completed' ? 'checked' : ''}`} onClick={() => onToggle(task.id)} aria-label={task.status === 'Completed' ? `Reopen ${task.title}` : `Complete ${task.title}`}>{task.status === 'Completed' ? <Check size={14} /> : <Circle size={16} />}</button><div><strong className={task.status === 'Completed' ? 'task-completed' : ''}>{task.title}</strong>{task.description && <span className="task-description">{task.description}</span>}</div></td>
                <td><span className="subject-tag">{task.subject}</span></td>
                <td><span className={overdue ? 'overdue-text' : ''}>{formatDate(task.dueDate, { month: 'short', day: 'numeric', year: 'numeric' })}</span>{overdue && <span className="overdue-label">Overdue</span>}</td>
                <td><span className={`priority-pill ${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                <td><span className={`status-pill ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span></td>
                <td><div className="row-actions"><button className="icon-button" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}><Edit3 size={16} /></button><button className="icon-button danger-hover" aria-label={`Delete ${task.title}`} onClick={() => confirmDelete(task)}><Trash2 size={16} /></button></div></td>
              </tr>;
            })}</tbody>
          </table>
        </div> : <div className="empty-state task-empty"><div className="empty-chart-icon"><Search size={22} /></div><strong>{tasks.length ? 'No tasks match these filters' : 'Your task list is clear'}</strong><span>{tasks.length ? 'Try another search or adjust the filters.' : 'Add your first assignment or deadline to get started.'}</span>{!tasks.length && <button className="btn btn-primary mt-2" onClick={onAdd}><Plus size={17} /> Add your first task</button>}</div>}
        <div className="table-footer"><span>Showing {filtered.length} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span><span>Saved on this device</span></div>
      </section>
    </div>
  );
}

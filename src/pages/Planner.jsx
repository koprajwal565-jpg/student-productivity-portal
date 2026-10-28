import { useMemo, useState } from 'react';
import { CalendarDays, Check, Clock3, Edit3, Plus } from 'lucide-react';
import { formatDate, localDateString, startOfWeek } from '../utils/date.js';

export default function Planner({ sessions, onAdd, onEdit, onToggle }) {
  const [view, setView] = useState('week');
  const today = localDateString();
  const week = startOfWeek();
  const weekEnd = new Date(week);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const visible = useMemo(() => sessions.filter((session) =>
    view === 'week' ? session.date >= localDateString(week) && session.date <= localDateString(weekEnd) : session.date === today
  ).sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)), [sessions, view, today, week, weekEnd]);
  const completedMinutes = sessions.filter((session) => session.completed).reduce((sum, session) => sum + session.duration, 0);
  const plannedMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
  const grouped = visible.reduce((result, session) => {
    (result[session.date] ??= []).push(session);
    return result;
  }, {});

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div><div className="eyebrow">MAKE TIME FOR WHAT MATTERS</div><h1>Study planner</h1><p>Build a realistic routine and track the sessions you complete.</p></div>
        <button className="btn btn-primary" onClick={onAdd}><Plus size={18} /> Plan a session</button>
      </div>
      <div className="planner-summary">
        <div className="planner-summary-item"><div className="stat-icon blue"><CalendarDays size={19} /></div><div><span>Sessions planned</span><strong>{sessions.length}</strong></div></div>
        <div className="planner-summary-item"><div className="stat-icon green"><Check size={19} /></div><div><span>Study time completed</span><strong>{(completedMinutes / 60).toFixed(1)} <small>hrs</small></strong></div></div>
        <div className="planner-summary-item"><div className="stat-icon amber"><Clock3 size={19} /></div><div><span>Total time planned</span><strong>{(plannedMinutes / 60).toFixed(1)} <small>hrs</small></strong></div></div>
      </div>
      <section className="surface-card planner-surface">
        <div className="planner-toolbar">
          <div><h2>{view === 'week' ? 'Your week' : 'Today'}</h2><p>{view === 'week' ? `${formatDate(localDateString(week), { month: 'short', day: 'numeric' })} – ${formatDate(localDateString(weekEnd), { month: 'short', day: 'numeric' })}` : formatDate(today)}</p></div>
          <div className="segmented-control" role="group" aria-label="Planner view">
            <button className={view === 'day' ? 'selected' : ''} onClick={() => setView('day')}>Day</button>
            <button className={view === 'week' ? 'selected' : ''} onClick={() => setView('week')}>Week</button>
          </div>
        </div>
        {visible.length ? <div className="session-list">
          {Object.entries(grouped).map(([date, items]) => <div className="session-day" key={date}>
            <div className="session-day-heading"><span className={`day-marker ${date === today ? 'today-marker' : ''}`}>{date === today ? 'TODAY' : formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' })}</span><span>{items.length} {items.length === 1 ? 'session' : 'sessions'}</span></div>
            {items.map((session) => <article className={`session-card ${session.completed ? 'session-done' : ''}`} key={session.id}>
              <button className={`task-check ${session.completed ? 'checked' : ''}`} aria-label={session.completed ? `Mark ${session.subject} session incomplete` : `Complete ${session.subject} session`} onClick={() => onToggle(session.id)}>{session.completed && <Check size={14} />}</button>
              <div className="session-time">{session.startTime}<span>{session.duration} min</span></div>
              <div className="session-content"><strong>{session.subject}</strong><span>{session.completed ? 'Completed study session' : 'Planned study session'}</span></div>
              {session.completed && <span className="status-pill completed">Completed</span>}
              <button className="icon-button" aria-label={`Edit ${session.subject} session`} onClick={() => onEdit(session)}><Edit3 size={16} /></button>
            </article>)}
          </div>)}
        </div> : <div className="empty-state task-empty"><div className="empty-chart-icon"><CalendarDays size={22} /></div><strong>No sessions in this {view}</strong><span>Add a study session to give your learning time a place on the calendar.</span><button className="btn btn-primary mt-2" onClick={onAdd}><Plus size={17} /> Plan a session</button></div>}
      </section>
    </div>
  );
}

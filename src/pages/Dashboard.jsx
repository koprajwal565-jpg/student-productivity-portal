import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ArrowRight, BookOpen, CheckCircle2, CircleAlert, Clock3, Plus, Sparkles } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import { formatDate, localDateString, startOfWeek } from '../utils/date.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function weekData(sessions) {
  const weekStart = startOfWeek();
  const labels = [];
  const planned = [];
  const completed = [];
  for (let index = 0; index < 7; index += 1) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const key = localDateString(date);
    const day = sessions.filter((session) => session.date === key);
    labels.push(date.toLocaleDateString(undefined, { weekday: 'short' }));
    planned.push(day.reduce((sum, session) => sum + session.duration, 0) / 60);
    completed.push(day.filter((session) => session.completed).reduce((sum, session) => sum + session.duration, 0) / 60);
  }
  return { labels, planned, completed };
}

export default function Dashboard({ tasks, sessions, name, onAddTask, onNavigate }) {
  const today = localDateString();
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;
  const overdueTasks = tasks.filter((task) => task.status !== 'Completed' && task.dueDate < today).length;
  const completion = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const todaysTasks = tasks.filter((task) => task.dueDate === today);
  const upcoming = tasks.filter((task) => task.status !== 'Completed' && task.dueDate > today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);
  const chart = useMemo(() => weekData(sessions), [sessions]);
  const hasWeekSessions = sessions.some((session) => session.date >= localDateString(startOfWeek()) &&
    session.date <= (() => { const end = startOfWeek(); end.setDate(end.getDate() + 6); return localDateString(end); })());

  return (
    <div className="page-stack">
      <section className="welcome-panel">
        <div>
          <div className="eyebrow"><Sparkles size={14} /> YOUR LEARNING SPACE</div>
          <h1>Good to see you{name ? `, ${name}` : ''}.</h1>
          <p>Make today count, one focused step at a time.</p>
        </div>
        <button className="btn btn-primary" onClick={onAddTask}><Plus size={18} /> Add a task</button>
      </section>

      <section className="stats-grid" aria-label="Task statistics">
        <StatCard label="Total tasks" value={tasks.length} note="Across all subjects" icon={BookOpen} tone="blue" />
        <StatCard label="Completed" value={completedTasks} note={`${completion}% of all tasks`} icon={CheckCircle2} tone="green" />
        <StatCard label="Pending" value={pendingTasks} note="Awaiting a start" icon={Clock3} tone="amber" />
        <StatCard label="Overdue" value={overdueTasks} note="Needs your attention" icon={CircleAlert} tone="rose" />
      </section>

      <div className="dashboard-grid">
        <section className="surface-card today-card">
          <div className="section-heading">
            <div><h2>Due today</h2><p>Your focus for the day</p></div>
            <span className="soft-count">{todaysTasks.length}</span>
          </div>
          {todaysTasks.length ? (
            <div className="compact-list">
              {todaysTasks.map((task) => (
                <div className="compact-item" key={task.id}>
                  <span className={`priority-mark ${task.priority.toLowerCase()}`} />
                  <div className="compact-item-copy"><strong>{task.title}</strong><span>{task.subject}</span></div>
                  <span className={`status-pill ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                </div>
              ))}
            </div>
          ) : <div className="empty-state compact-empty"><CheckCircle2 size={26} /><strong>Nothing due today</strong><span>Enjoy the clear space or plan ahead.</span></div>}
          <button className="text-link" onClick={() => onNavigate('tasks')}>View all tasks <ArrowRight size={15} /></button>
        </section>

        <section className="surface-card upcoming-card">
          <div className="section-heading">
            <div><h2>Upcoming deadlines</h2><p>What is coming up next</p></div>
            <button className="icon-link" aria-label="View all tasks" onClick={() => onNavigate('tasks')}><ArrowRight size={18} /></button>
          </div>
          {upcoming.length ? <div className="deadline-list">
            {upcoming.map((task) => (
              <div className="deadline-row" key={task.id}>
                <div className="deadline-date"><strong>{formatDate(task.dueDate, { month: 'short', day: 'numeric' })}</strong><span>{task.subject}</span></div>
                <div className="deadline-title">{task.title}</div>
                <span className={`priority-pill ${task.priority.toLowerCase()}`}>{task.priority}</span>
              </div>
            ))}
          </div> : <div className="empty-state compact-empty"><BookOpen size={26} /><strong>No upcoming deadlines</strong><span>Add tasks to keep your plans in view.</span></div>}
          <button className="text-link" onClick={() => onNavigate('planner')}>Open study planner <ArrowRight size={15} /></button>
        </section>

        <section className="surface-card study-chart-card">
          <div className="section-heading">
            <div><h2>This week’s study time</h2><p>Planned and completed hours from your sessions</p></div>
            <button className="icon-link" aria-label="Open analytics" onClick={() => onNavigate('analytics')}><ArrowRight size={18} /></button>
          </div>
          {hasWeekSessions ? <div className="chart-area">
            <Bar
              data={{
                labels: chart.labels,
                datasets: [
                  { label: 'Planned', data: chart.planned, backgroundColor: '#cbd8f6', borderRadius: 5, maxBarThickness: 26 },
                  { label: 'Completed', data: chart.completed, backgroundColor: '#496fe1', borderRadius: 5, maxBarThickness: 26 },
                ],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 7, padding: 18 } } },
                scales: { x: { grid: { display: false }, border: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#edf0f5' }, border: { display: false } } },
              }}
            />
          </div> : <div className="chart-empty"><div className="empty-chart-icon"><Clock3 size={22} /></div><strong>Your week starts with a plan</strong><span>Add study sessions to see your weekly progress here.</span><button className="btn btn-sm btn-outline-primary mt-2" onClick={() => onNavigate('planner')}>Plan a study session</button></div>}
        </section>
      </div>
    </div>
  );
}

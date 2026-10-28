import { useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { CheckCircle2, ClipboardList, Clock3 } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import { localDateString, startOfWeek } from '../utils/date.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function weeklyHours(sessions) {
  const weekStart = startOfWeek();
  const labels = [];
  const planned = [];
  const completed = [];
  for (let index = 0; index < 7; index += 1) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const day = sessions.filter((session) => session.date === localDateString(date));
    labels.push(date.toLocaleDateString(undefined, { weekday: 'short' }));
    planned.push(day.reduce((total, item) => total + item.duration, 0) / 60);
    completed.push(day.filter((item) => item.completed).reduce((total, item) => total + item.duration, 0) / 60);
  }
  return { labels, planned, completed };
}

export default function Analytics({ tasks, sessions }) {
  const completed = tasks.filter((task) => task.status === 'Completed').length;
  const completion = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const studyHours = sessions.filter((session) => session.completed).reduce((total, session) => total + session.duration, 0) / 60;
  const week = useMemo(() => weeklyHours(sessions), [sessions]);
  const bySubject = useMemo(() => {
    const map = new Map();
    tasks.forEach((task) => {
      const current = map.get(task.subject) ?? { total: 0, completed: 0 };
      current.total += 1;
      if (task.status === 'Completed') current.completed += 1;
      map.set(task.subject, current);
    });
    return [...map.entries()].map(([subject, value]) => ({ subject, ...value })).sort((a, b) => a.subject.localeCompare(b.subject));
  }, [tasks]);
  const hasWeekData = sessions.some((session) => {
    const beginning = localDateString(startOfWeek());
    const end = startOfWeek();
    end.setDate(end.getDate() + 6);
    return session.date >= beginning && session.date <= localDateString(end);
  });
  const taskChart = {
    labels: ['Completed', 'Not completed'],
    datasets: [{ data: [completed, tasks.length - completed], backgroundColor: ['#496fe1', '#e9edf5'], borderWidth: 0, hoverOffset: 4 }],
  };
  const weeklyChart = {
    labels: week.labels,
    datasets: [
      { label: 'Planned', data: week.planned, backgroundColor: '#cbd8f6', borderRadius: 5, maxBarThickness: 28 },
      { label: 'Completed', data: week.completed, backgroundColor: '#496fe1', borderRadius: 5, maxBarThickness: 28 },
    ],
  };
  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 7, padding: 18 } } },
    scales: { x: { grid: { display: false }, border: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#edf0f5' }, border: { display: false } } },
  };

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div><div className="eyebrow">YOUR PROGRESS, AT A GLANCE</div><h1>Progress &amp; analytics</h1><p>Use your actual tasks and study sessions to see how things are going.</p></div>
      </div>
      <section className="stats-grid analytics-stats">
        <StatCard label="Tasks completed" value={completed} note={`Out of ${tasks.length} total tasks`} icon={CheckCircle2} tone="green" />
        <StatCard label="Overall completion" value={`${completion}%`} note="Completed tasks / total tasks" icon={ClipboardList} tone="blue" />
        <StatCard label="Study hours completed" value={studyHours.toFixed(1)} note="Based on completed sessions" icon={Clock3} tone="amber" />
      </section>
      <div className="analytics-grid">
        <section className="surface-card analytics-card">
          <div className="section-heading"><div><h2>Task completion</h2><p>Completed compared with remaining tasks</p></div></div>
          {tasks.length ? <div className="doughnut-wrap"><Doughnut data={taskChart} options={{ responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 20 } } } }} /><div className="doughnut-center"><strong>{completion}%</strong><span>complete</span></div></div> : <div className="chart-empty"><div className="empty-chart-icon"><ClipboardList size={22} /></div><strong>No task data yet</strong><span>Add tasks to start tracking completion.</span></div>}
        </section>
        <section className="surface-card analytics-card wide-chart">
          <div className="section-heading"><div><h2>Study hours this week</h2><p>Planned time compared with completed sessions</p></div></div>
          {hasWeekData ? <div className="chart-area"><Bar data={weeklyChart} options={barOptions} /></div> : <div className="chart-empty"><div className="empty-chart-icon"><Clock3 size={22} /></div><strong>No study sessions this week</strong><span>Plan and complete sessions to see your weekly hours.</span></div>}
        </section>
        <section className="surface-card subject-progress-card">
          <div className="section-heading"><div><h2>Progress by subject</h2><p>Completed tasks within each subject</p></div></div>
          {bySubject.length ? <div className="subject-progress-list">{bySubject.map((item) => {
            const percent = Math.round((item.completed / item.total) * 100);
            return <div key={item.subject} className="subject-progress-row">
              <div className="subject-progress-heading"><strong>{item.subject}</strong><span>{item.completed} of {item.total} completed</span></div>
              <div className="progress" role="progressbar" aria-label={`${item.subject} task completion`} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><div className="progress-bar" style={{ width: `${percent}%` }} /></div>
            </div>;
          })}</div> : <div className="chart-empty"><div className="empty-chart-icon"><ClipboardList size={22} /></div><strong>Subject insights will show here</strong><span>Add tasks and subjects to compare your progress.</span></div>}
        </section>
      </div>
    </div>
  );
}

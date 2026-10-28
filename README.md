# student-productivity-portal

## StudySpace — Student Productivity Portal

StudySpace is a responsive, browser-based prototype for organizing college assignments, deadlines, and study sessions. It gives students one place to plan work and review progress without requiring an account or a backend.

## Problem statement

Students often track coursework across notebooks, chats, calendars, and memory. That makes it easy to lose sight of due dates, overlook study time, and misjudge progress. StudySpace brings tasks and study plans together in a simple dashboard.

## Objectives

- Organize academic tasks by subject, due date, priority, and status.
- Plan study sessions and mark sessions complete.
- Show useful progress based on the student's saved data.
- Offer a responsive and accessible interface that is approachable for beginners.
- Keep prototype data in browser localStorage rather than implying a cloud service.

## Target users

- College and university students managing coursework.
- Learners preparing for examinations.
- Students who want a lightweight personal study planner.

## Requirements and workflow

### Functional requirements

1. Add, edit, search, filter, sort, complete/reopen, and confirm deletion of tasks.
2. Track task title, optional description, subject, due date, priority, and status.
3. Plan daily or weekly study sessions with subject, date, start time, and duration; edit sessions and mark them complete.
4. Derive dashboard counts, completion rates, study hours, and charts from saved task and session data.
5. Save display-name and theme preferences, and offer a confirmed local-data clear action.
6. Restore local data on reload and recover safely if stored JSON is invalid or has an unsupported shape.

### Non-functional requirements

- Responsive layouts for desktop, tablet, and mobile.
- Clear labels, keyboard-operable controls, semantic landmarks, focus indicators, and readable contrast.
- Maintainable React components and straightforward JavaScript suitable for a student prototype.
- No paid APIs, authentication, backend, or claim of cloud synchronization.
- Honest empty states and user-visible storage errors.

### Essential features and workflow

Open the dashboard → add tasks and sessions → keep their details current → complete work as it happens → use the dashboard and analytics to review actual progress. Settings control the display name and theme or clear the browser-local data.

## Features

- **Dashboard:** task totals, completed/pending/overdue counts, task completion percentage, today's tasks, upcoming deadlines, and a weekly planned/completed study-hours chart.
- **My tasks:** create/edit/delete with confirmation; status, priority, and subject filters; search; deadline/priority sorting; overdue indicators; completion toggle.
- **Study planner:** daily and current-week views; add/edit sessions; complete/reopen sessions; planned and completed study-time totals.
- **Progress & analytics:** task-completion doughnut, current-week planned/completed study chart, per-subject task progress, and meaningful empty states.
- **Settings:** optional student display name, light/dark theme, and confirmed clearing of saved StudySpace data.
- **Persistence:** tasks, sessions, and settings use versioned localStorage keys. Invalid stored sections fall back safely and are reported in the interface.

All statistics and charts are derived from local task and session data. The app does not provide accounts, cloud backups, multi-device synchronization, reminders, or server storage.

## Technology stack

- React 18 and JavaScript
- Vite 6
- Bootstrap 5 plus custom CSS
- Chart.js and react-chartjs-2
- Lucide React icons
- Browser localStorage

## Project structure

```text
src/
  components/
    Modal.jsx
    SessionForm.jsx
    Sidebar.jsx
    StatCard.jsx
    TaskForm.jsx
  pages/
    Analytics.jsx
    Dashboard.jsx
    Planner.jsx
    Settings.jsx
    Tasks.jsx
  utils/
    date.js
    storage.js
  App.jsx
  main.jsx
  styles.css
index.html
vite.config.js
.github/workflows/deploy.yml
```

See [docs/architecture.md](./docs/architecture.md) for the application flow diagram.

## Installation

Requirements: Node.js 18 or newer and npm.

```bash
npm install
```

## Run the application

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). To create and locally preview a production build:

```bash
npm run build
npm run preview
```

## Testing

There is no automated test suite configured in this prototype. The production build is checked with `npm run build`. A detailed repeatable manual checklist is in [REPORT_NOTES.md](./REPORT_NOTES.md#test-results-and-evidence); use the running application to complete and record each scenario. Browser persistence is scoped to the current browser profile and origin.

## Free deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. To publish on GitHub Pages:

1. Create a GitHub repository and push this project to its `main` branch. If you use another default branch, change the branch in the workflow.
2. On GitHub, open the repository **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the repository **Actions** tab and allow workflows if GitHub asks. The workflow builds the app and publishes `dist/` whenever code is pushed to `main`; you can also run it manually using **Run workflow**.
5. Wait for the workflow to complete successfully. Open the published URL shown in the deployment job or in **Settings → Pages** and verify the app.

The Vite configuration automatically uses the repository path for GitHub Pages project sites. Tasks remain in each visitor's local browser storage; deployment does not add a backend.

Other static hosts with free tiers, such as Cloudflare Pages or Netlify, can deploy from the repository using `npm run build` and `dist` as the output directory. Review each provider's current limits and terms.

## Known limitations

- Data is stored only in localStorage for the current browser and origin. Clearing browser data loses it; there is no cloud sync or backup.
- No login, multi-user profiles, server database, notifications, or recurring sessions.
- Weekly summaries display the current calendar week (Monday–Sunday); there is no historical date-range selector.
- Automated unit, integration, and accessibility test suites are not included.
- Charts use the browser's locale and display the current application's local data only.

## Future improvements

- Add import/export and optional encrypted backup.
- Introduce automated component and end-to-end tests.
- Add calendar navigation, recurring sessions, and reminders.
- Improve screen-reader chart summaries and add more accessibility checks.
- Add an optional backend only if synchronization or multi-device support is a project requirement.

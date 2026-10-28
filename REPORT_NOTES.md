# ESE Report Notes — Student Productivity Portal

Use this as a report-writing scaffold. Replace bracketed notes with your own verified information. Do not include invented student details, screenshots, test results, AI responses, or deployment URLs.

## 1. Introduction

**Problem:** Students commonly spread assignment information and study plans across different tools or personal notes. Deadlines and progress can become difficult to see together.

**Project objective:** Build a responsive student productivity web application that organizes academic tasks, plans study sessions, and summarizes progress using the student's saved data.

**Scope:** This is a browser-only prototype. It does not provide login, a backend, cloud synchronization, or remote storage.

**Add to final report:** Your own project context, course requirements, motivation, and a short explanation of the problem.

## 2. Target User

Primary users are college and university students, including learners preparing for examinations. They need a low-friction way to record coursework, deadlines, and planned study time.

**Add to final report:** Any genuine user feedback or informal evaluation you conducted. If you did not interview or survey users, describe the target user as a design assumption rather than research evidence.

## 3. Tools Used

Implemented technology includes React 18, JavaScript, Vite, Bootstrap 5, custom CSS, Chart.js/react-chartjs-2, Lucide React, browser localStorage, and npm.

**Add to final report:** Actual editor, browser, operating system, versions, and any additional tools you personally used. Do not list tools that were not used.

## 4. Prompt Engineering Process

The project prompt can be organized into problem analysis, requirements, UI/UX design, code generation, testing, and debugging/improvement. The suggested examples and reflection areas are in [PROMPT_BOOK.md](./PROMPT_BOOK.md).

**Add evidence:** Insert genuine screenshots of the prompt and relevant AI response here, named for example `prompt-requirements.png` and `prompt-debugging.png`. Add the actual prompts, response summaries, changes you made, and your assessment. The examples in the prompt book are not evidence of use.

## 5. Application Design and Developmen

### Requirements

- Create, edit, delete, find, filter, sort, and complete/reopen tasks.
- Plan and edit study sessions; mark sessions complete.
- Calculate dashboard totals, task progress, study hours, and charts from saved data.
- Save tasks, sessions, and preferences locally and handle invalid stored values gracefully.
- Support responsive navigation, meaningful empty states, and accessible form labels.

### Page structure

The application has Dashboard, My tasks, Study planner, Progress & analytics, and Settings views. Insert the actual page-structure diagram from [docs/architecture.md](./docs/architecture.md), or export a genuine screenshot of that diagram if the report requires images.

### Development notes

The React application holds current page data in component state and persists tasks, study sessions, and settings through a small storage utility. Pages receive data and actions through props. Chart.js renders summaries from those same values. No API or backend is involved.

**Add evidence:** Include actual screenshots of the dashboard, task editing/list, planner, analytics, settings, and relevant mobile layouts. Suggested filenames: `dashboard-desktop.png`, `tasks-mobile.png`, `planner.png`, `analytics.png`, `settings.png`. Insert only screenshots you captured.

## 6. Final Application

Describe the completed features that you personally confirmed. Include the deployment URL only after deploying and opening it successfully.

### Test results and evidence

Use the following checklist in a running browser. Record the date, browser, steps, expected result, actual result, and evidence. Do not mark an unexecuted item as passed.

| Scenario | Manual steps | Result / evidence |
|---|---|---|
| Add a task | Add a task with title, subject, due date, priority, and status. | [Record result] |
| Edit a task | Change task details and save. | [Record result] |
| Delete a task | Delete a task and confirm; verify it is absent. | [Record result] |
| Complete/reopen | Toggle a task complete, then reopen it. | [Record result] |
| Search/filter/sort | Search text, change each filter, and sort by deadline and priority. | [Record result] |
| Validation | Submit missing fields and an invalid date/duration; check inline errors. | [Record result] |
| Persistence | Add records, refresh the same origin, and verify records remain. | [Record result] |
| Study sessions | Add/edit a session, mark it complete, and check study-hour totals. | [Record result] |
| Dashboard / analytics | Compare displayed counts and charts with the records entered. | [Record result] |
| Empty states | Test with no tasks or sessions; inspect dashboard and analytics. | [Record result] |
| Responsive navigation | Inspect desktop, tablet, and narrow mobile widths; open/close the mobile menu. | [Record result] |
| Console errors | Check browser developer tools during the main flows. | [Record result] |
| Production build | Run `npm run build` and record its actual exit result. | [Record result] |

Insert genuine test-result screenshots or output captures here, with filenames and dates. The project includes a build command but no automated test suite; manual scenarios must be run separately.

**Deployment:** [Insert the final deployed application URL only after deployment and verification.] Free static-host deployment guidance is in [README.md](./README.md#free-deployment).

## 7. Conclusion

Summarize how the implemented prototype addresses organization and progress tracking, what you learned, and what limitations remain. Distinguish verified outcomes from planned improvements. Possible future work includes automated tests, import/export, recurring sessions, reminders, and optional synchronization.

**Student details (fill in yourself):**
- Name: [Your name]
- Register number: [Your register number]
- Course / semester: [Your course and semester]
- Institution: [Your institution]
\n
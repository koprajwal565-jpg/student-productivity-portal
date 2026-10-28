# Application architecture

```mermaid
flowchart TD
  Browser[Browser]
  Main[main.jsx<br/>Vite entry point]
  App[App.jsx<br/>page state, shared data, actions]
  Storage[utils/storage.js<br/>validated localStorage]
  DateUtils[utils/date.js]
  Sidebar[Sidebar]
  Forms[TaskForm and SessionForm]
  Dashboard[Dashboard]
  Tasks[My tasks]
  Planner[Study planner]
  Analytics[Progress and analytics]
  Settings[Settings]
  Charts[Chart.js]

  Browser --> Main --> App
  App <--> Storage
  App --> DateUtils
  App --> Sidebar
  App --> Forms
  App --> Dashboard
  App --> Tasks
  App --> Planner
  App --> Analytics
  App --> Settings
  Dashboard --> Charts
  Analytics --> Charts
  Forms --> App
  Tasks --> App
  Planner --> App
  Settings --> App
```

The React application owns task, study-session, and preference state. `App.jsx` passes values and callbacks to the active page and forms. A storage utility reads/writes JSON in browser localStorage, and the dashboard and analytics derive their visualizations from the same state. There is no backend or remote API.

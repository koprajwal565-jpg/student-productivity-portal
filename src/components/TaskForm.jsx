import { useState } from 'react';
import { isValidDateString } from '../utils/date.js';

export default function TaskForm({ task, onSave, onCancel }) {
  const [values, setValues] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    subject: task?.subject ?? '',
    dueDate: task?.dueDate ?? '',
    priority: task?.priority ?? 'Medium',
    status: task?.status ?? 'Pending',
  });
  const [error, setError] = useState('');
  const update = (event) => setValues({ ...values, [event.target.name]: event.target.value });

  function submit(event) {
    event.preventDefault();
    if (!values.title.trim() || !values.subject.trim() || !values.dueDate) {
      setError('Add a title, subject, and due date to continue.');
      return;
    }
    if (!isValidDateString(values.dueDate)) {
      setError('Enter a valid due date.');
      return;
    }
    onSave({ ...values, title: values.title.trim(), subject: values.subject.trim(), description: values.description.trim() });
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="modal-body-custom">
        <div className="mb-3">
          <label className="form-label" htmlFor="task-title">Task title <span className="required-mark">*</span></label>
          <input id="task-title" name="title" className="form-control" value={values.title} onChange={update} maxLength={100} autoFocus />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="task-description">Description</label>
          <textarea id="task-description" name="description" className="form-control" rows="3" maxLength={500} value={values.description} onChange={update} placeholder="Add a few details (optional)" />
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="task-subject">Subject <span className="required-mark">*</span></label>
            <input id="task-subject" name="subject" className="form-control" value={values.subject} onChange={update} maxLength={60} placeholder="e.g. Mathematics" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="task-due-date">Due date <span className="required-mark">*</span></label>
            <input id="task-due-date" name="dueDate" type="date" className="form-control" value={values.dueDate} onChange={update} max="9999-12-31" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="task-priority">Priority</label>
            <select id="task-priority" name="priority" className="form-select" value={values.priority} onChange={update}>
              {['Low', 'Medium', 'High'].map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="task-status">Status</label>
            <select id="task-status" name="status" className="form-select" value={values.status} onChange={update}>
              {['Pending', 'In Progress', 'Completed'].map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
        </div>
        {error && <div className="form-error mt-3" role="alert">{error}</div>}
      </div>
      <div className="modal-footer-custom">
        <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{task ? 'Save changes' : 'Add task'}</button>
      </div>
    </form>
  );
}

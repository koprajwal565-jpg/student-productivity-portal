import { useState } from 'react';
import { isValidDateString } from '../utils/date.js';

export default function SessionForm({ session, onSave, onCancel }) {
  const [values, setValues] = useState({
    subject: session?.subject ?? '',
    date: session?.date ?? '',
    startTime: session?.startTime ?? '',
    duration: session?.duration ?? '',
  });
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    const duration = Number(values.duration);
    const validDate = isValidDateString(values.date);
    if (!values.subject.trim() || !validDate || !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.startTime) ||
      !Number.isInteger(duration) || duration < 1 || duration > 720) {
      setError('Enter a subject, valid date and start time, and duration from 1 to 720 minutes.');
      return;
    }
    onSave({ ...values, subject: values.subject.trim(), duration });
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="modal-body-custom">
        <div className="mb-3">
          <label className="form-label" htmlFor="session-subject">Subject <span className="required-mark">*</span></label>
          <input id="session-subject" className="form-control" maxLength={60} value={values.subject} onChange={(e) => setValues({ ...values, subject: e.target.value })} autoFocus />
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="session-date">Date <span className="required-mark">*</span></label>
            <input id="session-date" type="date" className="form-control" value={values.date} onChange={(e) => setValues({ ...values, date: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="session-time">Start time <span className="required-mark">*</span></label>
            <input id="session-time" type="time" className="form-control" value={values.startTime} onChange={(e) => setValues({ ...values, startTime: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="session-duration">Duration (minutes) <span className="required-mark">*</span></label>
            <input id="session-duration" type="number" min="1" max="720" step="1" className="form-control" value={values.duration} onChange={(e) => setValues({ ...values, duration: e.target.value })} placeholder="e.g. 45" />
          </div>
        </div>
        {error && <div className="form-error mt-3" role="alert">{error}</div>}
      </div>
      <div className="modal-footer-custom">
        <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{session ? 'Save changes' : 'Add session'}</button>
      </div>
    </form>
  );
}

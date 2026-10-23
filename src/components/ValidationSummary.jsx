import React from 'react';

function ValidationSummary({ fields, message }) {
  return (
    <div className="validation-summary">
      <p className="validation-summary-message">
        {message || 'Complete the required fields below, then try again.'}
      </p>
      <ul className="validation-summary-list" aria-label="Required fields">
        {fields.map((field) => (
          <li className="validation-summary-item" key={field}>
            {field}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ValidationSummary;

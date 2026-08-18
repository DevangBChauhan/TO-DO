import { useState } from 'react';

// TodoForm - handles adding new todos
// Validates that input is not empty or whitespace-only
function TodoForm({ onAdd }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();

    // Validation: block empty or whitespace-only input
    if (!trimmed) {
      setError('Please enter a task before adding.');
      return;
    }

    onAdd(trimmed);
    setValue('');
    setError('');
  }

  function handleChange(e) {
    setValue(e.target.value);
    // Clear error as user types
    if (error) setError('');
  }

  return (
    <div>
      <form className="todo-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="todo-input" className="sr-only">
          New task
        </label>
        <input
          id="todo-input"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter a task..."
          autoComplete="off"
          data-testid="todo-input"
        />
        <button type="submit" className="btn-add" data-testid="add-todo">
          Add Task
        </button>
      </form>
      {/* Show validation error if input is invalid */}
      <p className="error-message" role="alert" aria-live="polite">
        {error}
      </p>
    </div>
  );
}

export default TodoForm;

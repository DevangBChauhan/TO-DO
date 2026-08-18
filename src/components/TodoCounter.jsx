// TodoCounter - shows how many tasks are still active (not completed)
function TodoCounter({ todos }) {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const label = activeCount === 1 ? 'task remaining' : 'tasks remaining';

  return (
    <span className="todo-counter" data-testid="todo-counter">
      {activeCount} {label}
    </span>
  );
}

export default TodoCounter;

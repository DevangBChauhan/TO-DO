// TodoFilters - the All / Active / Completed filter buttons
const FILTERS = [
  { label: 'All', value: 'all', testId: 'filter-all' },
  { label: 'Active', value: 'active', testId: 'filter-active' },
  { label: 'Completed', value: 'completed', testId: 'filter-completed' },
];

function TodoFilters({ currentFilter, onFilterChange }) {
  return (
    <div className="filters" role="group" aria-label="Filter todos">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          className={`filter-btn ${currentFilter === filter.value ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.value)}
          aria-pressed={currentFilter === filter.value}
          data-testid={filter.testId}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default TodoFilters;

import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import styles from '../App.module.css';
import { useSearchParams, useNavigate } from 'react-router';
import { useEffect } from 'react';

function TodosPage({
  todoList,
  isLoading,
  errorMessage,
  isSaving,
  addTodo,
  completeTodo,
  updateTodo,
  sortField,
  sortDirection,
  queryString,
  dispatch,
  todoActions,
}) {
  /****** pagination *******/
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;

  const todosForCurrentPage = todoList.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil(todoList.length / itemsPerPage);

  //** handlers **/
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: (currentPage - 1).toString() });
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: (currentPage + 1).toString() });
    }
  };

  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  //   const goToPage = (page) => {
  //     setSearchParams({ page: page.toString() });
  //   };

  return (
    <div className={styles.appContainer}>
      {isLoading && <p>loading...</p>}
      {isSaving && <p>Saving...</p>}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        onCompleteTodo={completeTodo}
        // todos={todoList}
        todos={todosForCurrentPage}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
        isSaving={isSaving}
      />

      {/* buttons pagination  */}
      <div style={{ marginTop: '1em' }}>
        <button disabled={currentPage === 1} onClick={handlePreviousPage}>
          Previous
        </button>
        <span style={{ margin: '1em' }}>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button disabled={currentPage === totalPages} onClick={handleNextPage}>
          Next
        </button>
      </div>

      <hr />
      <TodosViewForm
        sortField={sortField}
        sortFieldChange={(field) =>
          dispatch({ type: todoActions.setSortField, sortField: field })
        }
        sortDirection={sortDirection}
        sortDirectionChange={(dir) =>
          dispatch({ type: todoActions.setSortDirection, sortDirection: dir })
        }
        queryString={queryString}
        queryStringChange={(query) =>
          dispatch({ type: todoActions.setQueryString, queryString: query })
        }
      />

      {/* display error */}
      {errorMessage && (
        <div className={styles.errorMessage}>
          <hr />

          <img
            src="/src/icons/triangle-exclamation-solid-full.svg"
            alt="Error icon"
            style={{
              width: '5em',
              height: '5em',
            }}
          />

          <p>{errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>
            Dismiss Error Message
          </button>
        </div>
      )}
    </div>
  );
}

export default TodosPage;

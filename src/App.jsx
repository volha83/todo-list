import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { useEffect, useCallback, useReducer } from 'react';
import styles from './App.module.css';
import logo from './to-do-list.png';
// import errorIcon from '../../icons/traingle-exclamation-solid-full.svg';
// import circleIcon from '../../icons/circle-regular-full.svg';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  // const [todoList, setTodoList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  // const [isSaving, setIsSaving] = useState(false);
  // const [sortField, setSortField] = useState('createdTime');
  // const [sortDirection, setSortDirection] = useState('desc');
  // const [queryString, setQueryString] = useState('');

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const {
    todoList,
    isLoading,
    errorMessage,
    isSaving,
    sortField,
    sortDirection,
    queryString,
  } = todoState;

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  // check error
  // const url = 'https://api.airtable.com/v0/WRONG_ID/WRONG_TABLE';
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString, url]);

  // ******fetch todos********
  useEffect(() => {
    const fetchTodos = async () => {
      // setIsLoading(true);
      dispatch({ type: todoActions.fetchTodos });

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeUrl(), options);

        if (!resp.ok) {
          throw new Error(resp.status);
        }

        const data = await resp.json();
        // const todos = data.records.map((record) => ({
        //   id: record.id,
        //   title: record.fields.title,
        //   isCompleted: record.fields.isCompleted,
        // }));
        dispatch({ type: todoActions.loadTodos, records: data.records });
        //       setTodoList(todos);
        //       setErrorMessage('');
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
        //       setErrorMessage(`Error: ${error.message}.. Reverting todo...`);
        //     } finally {
        //       setIsLoading(false);
      }
    };
    fetchTodos();
  }, [encodeUrl, token]);

  //**************************AddTodo */

  const addTodo = async (title) => {
    const newTodo = {
      title: title,
      isCompleted: false,
    };

    const payload = {
      records: [
        {
          fields: newTodo,
        },
      ],
    };
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      // setIsSaving(true);
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.status);
      }
      const { records } = await resp.json();
      // const savedTodo = {
      //   id: records[0].id,
      //   title: records[0].fields.title,
      //   isCompleted: records[0].fields.isCompleted,
      // };
      //     setTodoList([...todoList, savedTodo]);
      //     setErrorMessage('');
      dispatch({ type: todoActions.addTodo, record: records[0] });
    } catch (error) {
      //     console.log(error.message);
      //     setErrorMessage(`Error: ${error.message}.. Reverting todo...`);
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      //     setIsSaving(false);
      dispatch({ type: todoActions.endRequest });
    }
  };

  // ********** complete todo **************
  function completeTodo(id) {
    // const updatedTodos = todoList.map((todo) => {
    //   if (todo.id === id) {
    //     return {
    //       ...todo,
    //       isCompleted: !todo.isCompleted,
    //     };
    //   }
    //   return todo;
    // });
    // setTodoList(updatedTodos);
    dispatch({ type: todoActions.completeTodo, id });
  }

  //********** updateTodo *********
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    dispatch({ type: todoActions.updateTodo, editedTodo });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error(resp.status);
      }
      await resp.json();
      dispatch({ type: todoActions.endRequest });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
      dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo });
    }
  };
  ////////////

  return (
    <div className={styles.appContainer}>
      <header>
        <img
          src={logo}
          alt="Todo Logo"
          style={{ height: '5em', marginRight: '1em' }}
        />
        <h1>Todo List</h1>
      </header>

      {isLoading && <p>loading...</p>}
      {isSaving && <p>Saving...</p>}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        onCompleteTodo={completeTodo}
        todos={todoList}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
        isSaving={isSaving}
      />

      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={(field) =>
          dispatch({ type: todoActions.setSortField, field })
        }
        sortDirection={sortDirection}
        setSortDirection={(dir) =>
          dispatch({ type: todoActions.setSortDirection, dir })
        }
        queryString={queryString}
        setQueryString={(query) =>
          dispatch({ type: todoActions.setQueryString, query })
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

export default App;

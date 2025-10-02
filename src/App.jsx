import './App.css';
// import TodoList from './features/TodoList/TodoList';
// import TodoForm from './features/TodoForm';
// import TodosViewForm from './features/TodosViewForm';
import { useEffect, useCallback, useReducer, useState } from 'react';
import styles from './App.module.css';
import logo from './to-do-list.png';

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

import TodosPage from './pages/TodosPage';
import Header from './shared/Header/Header';
import { Routes, Route, useLocation } from 'react-router';

import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
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

  // title
  const [title, setTitle] = useState('Todo List');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setTitle('Todo List');
    } else if (location.pathname === '/about') {
      setTitle('About');
    } else {
      setTitle('Not Found');
    }
  }, [location]);

  // **************
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
        dispatch({ type: todoActions.loadTodos, records: data.records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
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

      dispatch({ type: todoActions.addTodo, record: records[0] });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  // ********** complete todo **************
  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) return;
    const completedTodo = { ...originalTodo, isCompleted: true };

    //***** update UI
    dispatch({ type: todoActions.updateTodo, editedTodo: completedTodo });

    // **** prepare the payload for the Airtable
    const payload = {
      records: [
        {
          id: completedTodo.id,
          fields: {
            title: completedTodo.title,
            isCompleted: true,
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

  //********** updateTodo *********
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    dispatch({ type: todoActions.updateTodo, editedTodo });

    // **** prepare the payload for the Airtable
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
    <>
      {/* <header className={styles.header}>
        <img
          src={logo}
          alt="Todo Logo"
          style={{ height: '5em', marginRight: '1em' }}
        />
        <h1>Todo List</h1>
      </header> */}

      <Header className={styles.header} title={title} />
      <img
        src={logo}
        alt="Todo Logo"
        style={{ height: '5em', marginRight: '1em' }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoList={todoList}
              isLoading={isLoading}
              errorMessage={errorMessage}
              isSaving={isSaving}
              addTodo={addTodo}
              completeTodo={completeTodo}
              updateTodo={updateTodo}
              sortField={sortField}
              sortDirection={sortDirection}
              queryString={queryString}
              dispatch={dispatch}
              todoActions={todoActions}
            />
          }
        />
        {/* <Route path='/' element={<TodosPage ... />} /> */}
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
}
export default App;

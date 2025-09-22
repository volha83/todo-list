import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { useState, useEffect, useCallback } from 'react';
import styles from './App.module.css';
import logo from './to-do-list.png';
// import errorIcon from '../../icons/traingle-exclamation-solid-full.svg';
// import circleIcon from '../../icons/circle-regular-full.svg';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

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

  // **************
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

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

        const todos = data.records.map((record) => ({
          id: record.id,
          title: record.fields.title,
          isCompleted: record.fields.isCompleted,
        }));

        setTodoList(todos);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(`Error: ${error.message}.. Reverting todo...`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [encodeUrl]);

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
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.status);
      }
      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        title: records[0].fields.title,
        isCompleted: records[0].fields.isCompleted,
      };

      setTodoList([...todoList, savedTodo]);
      setErrorMessage('');
    } catch (error) {
      console.log(error.message);
      setErrorMessage(`Error: ${error.message}.. Reverting todo...`);
    } finally {
      setIsSaving(false);
    }
  };

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }

  // updateTodo//////
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    setTodoList((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === editedTodo.id ? { ...editedTodo } : todo
      )
    );

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
      setIsSaving(true);
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error(resp.status);
      }

      const { records } = await resp.json();
      console.log('Updated todo:', records[0]);

      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage(`Error: ${error.message}.. Reverting todo...`);

      setTodoList((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === originalTodo.id ? { ...originalTodo } : todo
        )
      );
    } finally {
      setIsSaving(false);
    }
  };
  // //////////

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
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
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
          <button onClick={() => setErrorMessage('')}>
            Dismiss Error Message
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

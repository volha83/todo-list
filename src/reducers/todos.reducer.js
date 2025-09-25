const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',

  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',

  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',

  revertTodo: 'revertTodo',
  clearError: 'clearError',

  setSortField: 'setSortField',
  setSortDirection: 'setSortDirection',
  setQueryString: 'setQueryString',
};

const initialState = {
  todoList: [],
  isLoading: false,
  errorMessage: '',
  isSaving: false,
  sortField: 'createdTime',
  sortDirection: 'desc',
  queryString: '',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };

    case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (todo.isCompleted === undefined) {
            todo.isCompleted = false;
          }
          return todo;
        }),
        isLoading: false,
      };

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };

    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };

    case actions.addTodo: {
      const savedTodo = {
        id: action.record.id,
        ...action.record.fields,
      };
      if (savedTodo.isCompleted === undefined) {
        savedTodo.isCompleted = false;
      }
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    case actions.revertTodo:
    case actions.updateTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.editedTodo.id ? action.editedTodo : todo
      );
      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };
      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }
      return updatedState;
    }

    case actions.completeTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.id ? { ...todo, isCompleted: true } : todo
        ),
      };

    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };

    case actions.setSortField:
      return {
        ...state,
        sortField: action.sortField,
      };
    case actions.setSortDirection:
      return {
        ...state,
        sortDirection: action.sortDirection,
      };
    case actions.setQueryString:
      return {
        ...state,
        queryString: action.queryString,
      };

    default:
      return state;
  }
}
export { initialState, actions, reducer };

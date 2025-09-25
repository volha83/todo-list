import { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  gap: 1em;
  padding: 0.5em;
`;

const StyledSelect = styled.select`
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 0.5em;
`;

const StyledInput = styled.input`
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 0.5em;
`;

const StyledButton = styled.button`
  margin-left: 0.5em;
  padding: 0.5em;
  border-radius: 0.5em;
  background: #f44336;
  border: 1px solid #a7cbd0;
  color: white;
  cursor: pointer;

  &:hover {
    background: #d32f2f;
  }
`;

function TodosViewForm({
  sortField,
  sortFieldChange,
  //   setSortField,
  sortDirection,
  sortDirectionChange,
  //   setSortDirection,
  queryString,
  queryStringChange,
  //   setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  function preventRefresh(e) {
    e.preventDefault();
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      //   console.log('send to App:', localQueryString);
      queryStringChange(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
  }, [localQueryString, queryStringChange]);

  useEffect(() => {
    setLocalQueryString(queryString);
  }, [queryString]);

  return (
    <StyledForm onSubmit={preventRefresh}>
      <div>
        <label>
          Search todos:
          <StyledInput
            type="text"
            value={localQueryString}
            onChange={(e) => setLocalQueryString(e.target.value)}
          />
          <StyledButton type="button" onClick={() => setLocalQueryString('')}>
            Clear
          </StyledButton>
        </label>
      </div>

      <div>
        <label>
          Sort by
          <StyledSelect
            name="sortField"
            value={sortField}
            onChange={(e) => sortFieldChange(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </StyledSelect>
        </label>

        <label>
          Direction
          <StyledSelect
            name="sortDirection"
            value={sortDirection}
            onChange={(e) => sortDirectionChange(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </StyledSelect>
        </label>
      </div>
    </StyledForm>
  );
}
export default TodosViewForm;

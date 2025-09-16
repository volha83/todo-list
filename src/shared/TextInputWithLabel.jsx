import React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 0.5em;
`;

const StyledInput = styled.input`
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 0.5em;
`;

function TextInputWithLabel({ elementId, labelText, onChange, value, ref }) {
  return (
    <>
      <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}
export default TextInputWithLabel;

import React from 'react';

function TextInputWithLabel({ elementId, label, onChange, value, ref }) {
  return (
    <>
      <label htmlFor={elementId}>{label}</label>
      <input
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

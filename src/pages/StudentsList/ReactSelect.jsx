import React from 'react';
import Select from 'react-select';


const ReactSelect = ({options,placeholder,setValue,message}) => {
  const handleChange = (selectedOption) => {
   setValue(selectedOption.value);
  };
  const customNoOptionsMessage = ({ inputValue }) =>
  inputValue === '' ? 'Start typing to find subjects' : 'No matching subjects';
  return (
    <div style={{flex:1}}>
     
      <Select
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
        noOptionsMessage={customNoOptionsMessage}
       
      />
    </div>
  );
};

export default ReactSelect;

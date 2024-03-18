import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, CircularProgress } from '@mui/material';

const SelectField = ({ label, items, loading, onChange, idKey, nameKey }) => {
  const [selectedItem, setSelectedItem] = React.useState('');

  const handleChange = (event) => {
    const selectedItemValue = event.target.value;
    setSelectedItem(selectedItemValue);
    if (onChange) {
      onChange(selectedItemValue);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="select-field-label">{label}</InputLabel>
      <Select
        labelId="select-field-label"
        id="select-field"
        value={selectedItem}
        onChange={handleChange}
        disabled={loading}
        fullWidth
      >
        {loading ? (
          <MenuItem value="">
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          items.map((item) => (
            <MenuItem key={item[idKey]} value={item[idKey]}>
              {item[nameKey]}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default SelectField;

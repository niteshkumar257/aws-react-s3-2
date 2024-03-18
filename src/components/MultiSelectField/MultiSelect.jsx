import React, { useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Checkbox, CircularProgress, Chip } from '@mui/material';
import { Delete } from '@mui/icons-material'; // Import the Delete icon

const MultiSelectField = ({ label, items, loading, onChange, idKey, nameKey, initialSelectedItems }) => {
  const [selectedItems, setSelectedItems] = React.useState([]);

  // Update selectedItems when initialSelectedItems change
  useEffect(() => {
    if (initialSelectedItems && initialSelectedItems.length > 0) {
      setSelectedItems(initialSelectedItems.map(item => item[idKey]) || []);
    }
  }, [initialSelectedItems, idKey]);

  const handleChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedItems(selectedValues);
    if (onChange) {
      onChange(selectedValues);
    }
  };

  const handleDeleteChip = (itemToDelete) => {
    const updatedSelectedItems = selectedItems.filter((item) => item !== itemToDelete);
    setSelectedItems(updatedSelectedItems);
    if (onChange) {
      onChange(updatedSelectedItems);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="multi-select-field-label">{label}</InputLabel>
      <Select
        sx={{
          height: 'auto'
        }}
        labelId="multi-select-field-label"
        id="multi-select-field"
        multiple
        value={selectedItems}
        onChange={handleChange}
        disabled={loading}
        renderValue={(selected) => (
          <div>
            {selected.map((value) => (
              <Chip
                key={value}
                label={items.find((item) => item[idKey] === value)[nameKey]}
                onDelete={() => handleDeleteChip(value)}
                style={{ marginRight: 4, marginBottom: 4 }}
              />
            ))}
          </div>
        )}
        fullWidth
      >
        {loading ? (
          <MenuItem value="">
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          items.map((item) => (
            <MenuItem key={item[idKey]} value={item[idKey]}>
              <Checkbox checked={selectedItems.includes(item[idKey])} />
              {item[nameKey]}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default MultiSelectField;

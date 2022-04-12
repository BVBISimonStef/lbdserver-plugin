import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Sort() {
  const [sort, setSort] = React.useState('');

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  return (
      <FormControl sx={{width:'100%'}}>
        <InputLabel id="sort-function">Sort By</InputLabel>
        <Select
          id="sort-function"
          value={sort}
          label="sort"
          onChange={handleChange}
        >
          <MenuItem value={1}>A - Z</MenuItem>  
          <MenuItem value={2}>Newest First</MenuItem>
          <MenuItem value={3}>Oldest First</MenuItem>
        </Select>
      </FormControl>
  );
}

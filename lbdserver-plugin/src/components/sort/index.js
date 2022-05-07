import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { sorter } from '../../atoms';
import { useRecoilState} from 'recoil'

export default function Sort() {
  const [sort, setSort] = useRecoilState(sorter);

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
          <MenuItem value={"-year"}>Newest First</MenuItem>
          <MenuItem value={"year"}>Oldest First</MenuItem>
          <MenuItem value={"label"}>A - Z</MenuItem>  
          <MenuItem value={"-label"}>Z - A</MenuItem>
        </Select>
      </FormControl>
  );
}

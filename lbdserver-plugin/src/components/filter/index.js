import React, { useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { filter, filetype } from '../../atoms';
import { useRecoilState} from 'recoil'

export default function Filter() {
  const [filters, setFilters] = useRecoilState(filter);
  const [filetypes, setFiletypes] = useRecoilState(filetype)

  const handleChange = (event) => {
    setFilters(event.target.value);
  };
  return(
      <FormControl sx={{width:'100%'}}>
        <InputLabel id="filter-function">Filter By Mediatype</InputLabel>
        <Select
          id="filter-function"
          value={filters}
          label="filter"
          onChange={handleChange}
        >
          <MenuItem         
              key={"test"}
              value={""}>
              All Mediatypes
          </MenuItem>
          {filetypes.map((item) =>
            <MenuItem
              key={item}
              value={item}>
              {item}
            </MenuItem>
          )}
        </Select>
      </FormControl>
  );
}
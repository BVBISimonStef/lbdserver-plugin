import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Searchbar() {
    return (
      <Box
        component="form"
        noValidate
        autoComplete="off"
      >
        <TextField 
            sx={{width:'100%'}} 
            id="Search" 
            label="Search" 
            variant="outlined"
            InputProps={{
                endAdornment: <InputAdornment position="end"> <SearchIcon/> </InputAdornment>
            }} />
      </Box>
    );
  }
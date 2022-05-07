import  React, {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searcher } from '../../atoms';
import { useRecoilState} from 'recoil'

export default function Searchbar() {
  const [search, setSearch] = useRecoilState(searcher)
  const [input, setInput] = useState("")

  const HandleSearch = (event) => {
    setSearch(input);
  };

    return (
      <Box
        component="form"
        noValidate
        autoComplete="off"
      >
        <TextField
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                setSearch(e.target.value)
              }
            }} 
            sx={{width:'100%'}} 
            id="Search" 
            label="Search" 
            variant="outlined"
            InputProps={{
                endAdornment: 
                <InputAdornment position="end"> 
                  <IconButton onClick={HandleSearch}>
                    <SearchIcon/> 
                  </IconButton>
                </InputAdornment>
            }} />
      </Box>
    );
  }
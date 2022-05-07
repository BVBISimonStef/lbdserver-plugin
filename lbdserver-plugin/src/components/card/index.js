import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, CardHeader, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { LbdProject } from 'lbdserver-client-api'
import { project as p } from "../../atoms"
import { useRecoilState } from 'recoil'


export default function BasicCard({ location, label, year, country, city, currentStatus, id, role }) {
  const [full, setProject] = useRecoilState(p)

  let navigate = useNavigate();

  async function setActiveProject() {
    const theProject = new LbdProject(getDefaultSession(), location)
    await theProject.init()
    setProject(theProject)
    console.log(theProject)
    let path = "/projectpage"
    navigate(path);
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader
        sx={{
          textcolor: 'white',
          backgroundColor: '#1976d2',
          width: '100%',
        }}
        avatar={<FolderIcon sx={{ color: 'white' }} />}
        title={
          <Typography
            sx={{
              color: 'white',
            }} >
            {label}
          </Typography>}
        subheader={
          <Typography
            sx={{
              color: 'white',
              fontSize: 12
            }} >
            Project ID: {id}
          </Typography>}
      />
      <CardContent>
        <Typography color='#9e9e9e'>
          Starting Year
        </Typography>
        <Typography sx={{ fontSize: 12 }} gutterBottom>
          {year}
        </Typography>
        <Typography color='#9e9e9e'>
          Status
        </Typography>
        <Typography sx={{ fontSize: 12 }} gutterBottom>
          {currentStatus}
        </Typography>
        <Typography color='#9e9e9e'>
          Location
        </Typography>
        <Typography sx={{ fontSize: 12 }} gutterBottom>
          {city}, {country}
        </Typography>
        <Typography color='#9e9e9e'>
          Role
        </Typography>
        <Typography sx={{ fontSize: 12 }} gutterBottom>
          {role}
        </Typography>
      </CardContent>
      <CardActions>
        <Box style={{ flex: 1 }}>
          <Button onClick={() => setActiveProject()}>Learn More</Button>
        </Box>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardHeader, IconButton, ListItemSecondaryAction } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BasicCard() {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardActionArea>
        <CardHeader
          sx={{
            textcolor: 'white',
            backgroundColor: '#1976d2',
            width: '100%',
          }}
          avatar={<FolderIcon sx={{color: 'white'}} />}
          title={
            <Typography 
              sx={{
                color: 'white',
              }} > 
                MyFirstProject 
            </Typography>}
          subheader={
            <Typography 
              sx={{
                color: 'white',
                fontSize: 12
              }} > 
                Project ID: d17bfb89-87aa-4ed8-8f0b-e22946f791d2
          </Typography>}
        />
        <CardContent>
          <Typography color='#9e9e9e'>
            Starting Year
          </Typography>
          <Typography sx={{ fontSize: 12 }} gutterBottom>
            2020
          </Typography>
          <Typography color='#9e9e9e'>
            Status
          </Typography>
          <Typography sx={{ fontSize: 12 }} gutterBottom>
            In Construction
          </Typography>
          <Typography color='#9e9e9e'>
            Location
          </Typography>
          <Typography sx={{ fontSize: 12 }} gutterBottom>
            Gent, Belguim        
          </Typography>
          <Typography color='#9e9e9e'>
            Role
          </Typography>
          <Typography sx={{ fontSize: 12 }} gutterBottom>
            Architect        
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton>
          <DeleteIcon/>
        </IconButton>
      </CardActions>
    </Card>
  );
}
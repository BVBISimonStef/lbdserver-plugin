import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, CardHeader, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { LbdProject } from 'lbdserver-client-api'
import { project as p, trigger as t } from "../../atoms"
import { useRecoilState } from 'recoil'
import { v4 } from "uuid"


export default function BasicCard({ location, label, year, country, city, currentStatus, id, role }) {
  const [full, setProject] = useRecoilState(p)
  const [trigger, setTrigger] = useRecoilState(t)
  const [open, setOpen] = useState(false)

  let navigate = useNavigate();

  async function setActiveProject() {
    const theProject = new LbdProject(getDefaultSession(), location)
    await theProject.init()
    setProject(theProject)
    navigate("/projectpage");
  }

  async function handleClick() {
    const theProject = new LbdProject(getDefaultSession(), location)
    await theProject.init()
    await theProject.delete()
    setTrigger(v4())
    setOpen(false)
  }

  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
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
        <Tooltip title="Delete project">
          <IconButton onClick={() => handleClickOpen()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Do you really want to delete {label}?
          </DialogTitle>
          <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting the project can not be undone and will result in loss of all datasets attached to the project.
          </DialogContentText>
        </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClick} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
}
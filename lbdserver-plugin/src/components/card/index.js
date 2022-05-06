import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, CardHeader, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { newEngine } from '@comunica/actor-init-sparql'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { LbdProject } from 'lbdserver-client-api'
import { project as p } from "../../atoms"
import { useRecoilState } from 'recoil'


export default function BasicCard({ project }) {
  const [metadata, setMetadata] = useState({})
  const [full, setProject] = useRecoilState(p)


  useEffect(() => {
    getProjectData()
  }, [])

  async function getProjectData() {
    // https://comunica.dev/
    const query = `SELECT ?label ?year ?country ?city ?currentStatus ?role ?id WHERE {
          <${project}> <http://www.w3.org/2000/01/rdf-schema#label> ?label ;
          <http://www.w3.org/2006/time#year> ?year ;
          <http://dbpedia.org/ontology/country> ?country ;
          <http://dbpedia.org/ontology/city> ?city ;
          <http://dbpedia.org/ontology/currentStatus> ?currentStatus ;
          <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Role> ?role ;
          <http://id> ?id .       
          
      } LIMIT 1
      `
    const myEngine = newEngine()
    const results = await myEngine.query(query, { sources: [project], fetch: getDefaultSession().fetch })
    const bindings = await results.bindings()
    bindings.forEach(binding => {
      const myMetadata = {
        label: binding.get('?label').id.slice(1, -1),
        year: binding.get('?year').id.slice(1, -1),
        country: binding.get('?country').id.slice(1, -1),
        city: binding.get('?city').id.slice(1, -1),
        currentStatus: binding.get('?currentStatus').id.slice(1, -1),
        role: binding.get('?role').id.slice(1, -1),
        id: binding.get('?id').id.slice(1, -1)
      }
      setMetadata(myMetadata);;
    })
  }

  let navigate = useNavigate();

  async function setActiveProject() {
    const theProject = new LbdProject(getDefaultSession(), project)
    await theProject.init()
    setProject(theProject)
    console.log(theProject)
    let path = "/projectpage"
    navigate(path);
  }

  // if (Object.values(metadata).includes("Bim Coordinator")) {
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
            {metadata.label}
          </Typography>}
        subheader={
          <Typography
            sx={{
              color: 'white',
              fontSize: 12
            }} >
            Project ID: {metadata.id}
          </Typography>}
      />
      <CardContent>
        <Typography color='#9e9e9e'>
          Starting Year
        </Typography>
        <Typography sx={{ fontSize: 12 }} gutterBottom>
          {metadata.year}
        </Typography>
        <Typography color='#9e9e9e'>
          Status
        </Typography>
        <Typography sx={{ fontSize: 12 }} gutterBottom>
          {metadata.currentStatus}
        </Typography>
        <Typography color='#9e9e9e'>
          Location
        </Typography>
        <Typography sx={{ fontSize: 12 }} gutterBottom>
          {metadata.city}, {metadata.country}
        </Typography>
        <Typography color='#9e9e9e'>
          Role
        </Typography>
        <Typography sx={{ fontSize: 12 }} gutterBottom>
          {metadata.role}
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
  // }
  // return (null)
}
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import BasicTabs from '../Documentation/Dialogs/BasicTabs';
import Divider from '@mui/material/Divider';
import Info from '../../components/info';
import FormDialog from '../../components/issuemngmt';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Tooltip } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil'
import { project as p } from "../../atoms"
import {newEngine} from '@comunica/actor-init-sparql'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import {LbdProject } from 'lbdserver-client-api'



const ProjectPage = () => {
  const [metadata, setMetadata] = useState({})
  const [project, setProject] = useRecoilState(p)
  
  useEffect(() => {
    getProjectData()
    console.log('project', project)
  }, [])

  let navigate = useNavigate();
  function handleClick() {
    navigate("/dashboard")
  }

  async function getProjectData() {
      // https://comunica.dev/
      const query =`SELECT ?label ?year ?country ?city ?currentStatus ?role ?id WHERE {
          <${project.accessPoint}> <http://www.w3.org/2000/01/rdf-schema#label> ?label ;
          <http://www.w3.org/2006/time#year> ?year ;
          <http://dbpedia.org/ontology/country> ?country ;
          <http://dbpedia.org/ontology/city> ?city ;
          <http://dbpedia.org/ontology/currentStatus> ?currentStatus ;
          <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Role> ?role ;
          <http://id> ?id .       
          
      } LIMIT 1
      `
      const myEngine = newEngine()
      const results = await myEngine.query(query, {sources: [project.accessPoint], fetch: getDefaultSession().fetch})
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
    return (
        <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={8}>
                <BasicTabs title={"Scroll through the enrichment modules, visualise and query the project."} />
            </Grid>
            <Grid item xs={3}>
                <p>{metadata.label} </p>
                <FormDialog />
            </Grid>
            <Grid item xs={1} container justify="flex-end">
                <Tooltip title="Close">
                    <IconButton>
                        <CloseIcon onClick={() => handleClick()}/>
                    </IconButton>
                </Tooltip>

            </Grid>
        </Grid>

    );
}


export default ProjectPage
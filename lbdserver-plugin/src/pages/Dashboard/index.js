import React, {useState, useEffect} from 'react';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import {LbdService} from "lbdserver-client-api"

import BasicCard from '../../components/card';
import SearchBar from '../../components/searchBar';
import Sort from '../../components/sort';
import Grid from '@mui/material/Grid';

const DashboardPage = () => {
  const [projects, setProjects] = useState([])

    useEffect(() => {
        getProjects()
    }, [])

    async function getProjects() {
      try {
          var myService = new LbdService(getDefaultSession())

          let endpoint
          if (getDefaultSession().info.isLoggedIn) {
              endpoint = await myService.getProjectRegistry(getDefaultSession().info.webId)
          }
          const myProjects = await myService.getAllProjects(endpoint)
          setProjects(p => myProjects)
          return myProjects
      } catch (error) {
          console.log('error', error);
      }
    }
  
  return (
    <Grid container spacing={3} sx={{p: 3}}>
      <Grid item lg={4} md={6} sm={6} xs={12}>  
        <SearchBar/>
      </Grid>
      <Grid item lg={6} md={3} sm={2} xs={12} 
        sx={{
            display: { xs: "none", sm: "block", md: "block", lg: "block" }
            }}>  
      </Grid>
      <Grid item lg={2} md={3} sm={4} xs={12}>  
         <Sort/>
      </Grid>
      {projects.map((project) => (
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <BasicCard key={project} project={project}/>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardPage


import React, {useState, useEffect} from 'react';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import {LbdService} from "lbdserver-client-api"

import BasicCard from '../../components/card';
import SearchBar from '../../components/searchBar';
import Sort from '../../components/sort';
import Grid from '@mui/material/Grid';
import { sessionTrigger as s, propagate } from '../../atoms';
import {useRecoilValue, useRecoilState} from 'recoil'
import { getAuthentication } from "../../components/login/functions";

const DashboardPage = () => {
  const [projects, setProjects] = useState([])
  const trigger = useRecoilValue(s)
  const [update, setUpdate] = useRecoilState(propagate)
  let results = []

  useEffect(() => {
    if (getDefaultSession().info.isLoggedIn) {
      getProjects()
    }
  }, [update])

  async function getProjects() {
    try {
        var myService = new LbdService(getDefaultSession())

        let endpoint
        if (getDefaultSession().info.isLoggedIn) {
            endpoint = await myService.getProjectRegistry(getDefaultSession().info.webId)
        }
        const myProjects = await myService.getAllProjects(endpoint);
        console.log('projects', myProjects);
        for (const project in myProjects) {
          console.log('project', `${project}: ${myProjects[project]}`);
          results.push(await getDefaultSession().fetch(myProjects[project], {
            headers: {
              "Accept":"application/ld+json"
            }
          }).then(i => i.json()))
        }
        setProjects(p => myProjects)
        console.log(results[0])
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
        <Grid key={project} item lg={3} md={4} sm={6} xs={12}>
          <BasicCard project={project}/>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardPage


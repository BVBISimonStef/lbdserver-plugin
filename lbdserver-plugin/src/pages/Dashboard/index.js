import React, {useState, useEffect} from 'react';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import {LbdService} from "lbdserver-client-api"

import BasicCard from '../../components/card';
import SearchBar from '../../components/searchBar';
import Sort from '../../components/sort';
import Grid from '@mui/material/Grid';
import { trigger as t, propagate, sorter, searcher } from '../../atoms';
import {useRecoilValue, useRecoilState} from 'recoil'
import { newEngine } from '@comunica/actor-init-sparql'

const DashboardPage = () => {
  const [projects, setProjects] = useState([])
  const [trigger, setTrigger] = useRecoilValue(t)
  const [update, setUpdate] = useRecoilState(propagate)
  const [search, setSearch] = useRecoilState(searcher)
  const [sort, setSort] = useRecoilState(sorter)
  

  useEffect(() => {
    if (getDefaultSession().info.isLoggedIn) {
      getProjects()
    }
  }, [update, sort, search, trigger])

  async function getProjects() {
    try {
        var metadata = []
        var myService = new LbdService(getDefaultSession())
        let endpoint
        if (getDefaultSession().info.isLoggedIn) {
            endpoint = await myService.getProjectRegistry(getDefaultSession().info.webId)
        }
        const myProjects = await myService.getAllProjects(endpoint);
        for (const project in myProjects) {
          const query = `SELECT ?label ?year ?country ?city ?currentStatus ?role ?id WHERE {
            <${myProjects[project]}> <http://www.w3.org/2000/01/rdf-schema#label> ?label ;
            <http://www.w3.org/2006/time#year> ?year ;
            <http://dbpedia.org/ontology/country> ?country ;
            <http://dbpedia.org/ontology/city> ?city ;
            <http://dbpedia.org/ontology/currentStatus> ?currentStatus ;
            <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Role> ?role ;
            <http://id> ?id .       
            
          } LIMIT 1
          `
          const myEngine = newEngine()
          const results = await myEngine.query(query, { sources: [myProjects[project]], fetch: getDefaultSession().fetch })
          const bindings = await results.bindings()
          bindings.forEach(binding => {
            const myMetadata = {
              location: myProjects[project],
              label: binding.get('?label').id.slice(1, -1),
              year: binding.get('?year').id.slice(1, -1),
              country: binding.get('?country').id.slice(1, -1),
              city: binding.get('?city').id.slice(1, -1),
              currentStatus: binding.get('?currentStatus').id.slice(1, -1),
              role: binding.get('?role').id.slice(1, -1),
              id: binding.get('?id').id.slice(1, -1)
            }
            const check = Object.values(myMetadata).map(word => word.toLowerCase())
            if (check.join("").includes(search.toLowerCase()) || search == "") {
              metadata.push(myMetadata)
            }
          })
        }
        console.log(metadata)
        setProjects(metadata.sort(dynamicSort(sort)))
        return metadata
    } catch (error) {
        console.log('error', error);
    }
  }

  function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
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
        <Grid key={project.id} item lg={3} md={4} sm={6} xs={12}>
          <BasicCard 
            location={project.location}
            label={project.label}
            year={project.year}
            country={project.country}
            city={project.city}
            currentStatus={project.currentStatus}
            id={project.id}
            role={project.role}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardPage


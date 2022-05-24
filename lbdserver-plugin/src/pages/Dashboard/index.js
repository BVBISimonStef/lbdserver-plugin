import React, { useState, useEffect } from "react";
import { getDefaultSession, login } from "@inrupt/solid-client-authn-browser";
import { LbdService } from "lbdserver-client-api";
import BasicCard from "../../components/card";
import SearchBar from "../../components/searchBar";
import Sort from "../../components/sort";
import Grid from "@mui/material/Grid";
import { trigger as t, propagate, sorter, searcher } from "../../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { newEngine } from "@comunica/actor-init-sparql";
import { Button, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { AGGREGATOR_ENDPOINT } from '../../constants';

const packageJSON = require("../../../package.json")

const DashboardPage = () => {
  const [projectcheck, setProjectcheck] = useState([]);
  const [projects, setProjects] = useState([]);
  const [aggregator, setAggregator] = useState(AGGREGATOR_ENDPOINT)
  const [trigger, setTrigger] = useRecoilValue(t);
  const [update, setUpdate] = useRecoilState(propagate);
  const [search, setSearch] = useRecoilState(searcher);
  const [sort, setSort] = useRecoilState(sorter);
  const [oidcIssuer, setOidcIssuer] = useState("http://localhost:5000");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getProjects();
  }, [update, sort, search, trigger]);

  async function getProjects() {
    try {
      var metadata = [];
      var metadatacheck = [];
      var myService = new LbdService(getDefaultSession());
      let endpoint  = aggregator;
      if (getDefaultSession().info.isLoggedIn) {
        endpoint = await myService.getProjectRegistry(
          getDefaultSession().info.webId
        );
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
          `;
        const myEngine = newEngine();
        const results = await myEngine.query(query, {
          sources: [myProjects[project]],
          fetch: getDefaultSession().fetch,
        });
        const bindings = await results.bindings();
        bindings.forEach((binding) => {
          const myMetadata = {
            location: myProjects[project],
            label: binding.get("?label").id.slice(1, -1),
            year: binding.get("?year").id.slice(1, -1),
            country: binding.get("?country").id.slice(1, -1),
            city: binding.get("?city").id.slice(1, -1),
            currentStatus: binding.get("?currentStatus").id.slice(1, -1),
            role: binding.get("?role").id.slice(1, -1),
            id: binding.get("?id").id.slice(1, -1),
          };
          const check = Object.values(myMetadata).map((word) =>
            word.toLowerCase()
          );
          metadatacheck.push(myMetadata)
          if (check.join("").includes(search.toLowerCase()) || search == "") {
            metadata.push(myMetadata);
          }
        });
      }
      setProjectcheck(metadatacheck)
      setProjects(metadata.sort(dynamicSort(sort)));
      return metadata;
    } catch (error) {
      console.log("error", error);
    }
  }

  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  let navigate = useNavigate();
    function handleClick() {
        navigate("/create")
    }
  
  const onLoginClick = async (e) => {
    try {
      setLoading(true);
      if (!getDefaultSession().info.isLoggedIn) {
        await login({
          oidcIssuer,
          redirectUrl: window.location.href,
          clientName: packageJSON.name,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(`error`, error);
    }
  }; 

  if (getDefaultSession().info.isLoggedIn && projectcheck.length !== 0) {
    return (
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item lg={4} md={6} sm={6} xs={12}>
          <SearchBar />
        </Grid>
        <Grid
          item
          lg={6}
          md={3}
          sm={2}
          xs={12}
          sx={{
            display: { xs: "none", sm: "block", md: "block", lg: "block" },
          }}
        ></Grid>
        <Grid item lg={2} md={3} sm={4} xs={12}>
          <Sort />
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
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleClick}>
            + Project
          </Button>
        </Grid>
      </Grid>
    );
  } else if (getDefaultSession().info.isLoggedIn && projectcheck.length === 0) {
    return (
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12}>
          <Typography>
            You have currently no projects. Click here to add a project.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleClick}>
            + Project
          </Button>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12}>
          <Typography>
            You are not authenticated. Login to see your current projects.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button  variant="contained" onClick={onLoginClick}>
            Log In
          </Button>
        </Grid>
      </Grid>
    );
  }
};
export default DashboardPage;

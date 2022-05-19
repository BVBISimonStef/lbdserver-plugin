import { Typography, Grid, IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil'
import { project as p } from "../../atoms"
import { newEngine } from '@comunica/actor-init-sparql'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import GetAllDatasets from '../Datasets/GetDataset';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CreateDataset from '../Datasets/CreateDatasets';

export default function Info() {
    const [metadata, setMetadata] = useState({})
    const [project, setProject] = useRecoilState(p)

    let navigate = useNavigate();
    function handleClick() {
        navigate("/dashboard")
    }

    useEffect(() => {
        getProjectData()
    }, [])

    async function getProjectData() {
        // https://comunica.dev/
        const query = `SELECT ?label ?year ?country ?city ?currentStatus ?role ?id WHERE {
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
        const results = await myEngine.query(query, { sources: [project.accessPoint], fetch: getDefaultSession().fetch })
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
        <div>
            <Tooltip title="Close">
                <IconButton onClick={() => handleClick()} style={{ float: "right" }}>
                    <CloseIcon />
                </IconButton>
            </Tooltip>
            <Typography variant="h4">
                {metadata.label}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container>
                <Grid item md={6} xs={12} sx={{mb: 1}}>
                    <Typography sx={{ fontSize: 20 }} color='#9e9e9e'>
                        Starting Year
                    </Typography>
                    <Typography>
                        {metadata.year}
                    </Typography>
                </Grid>
                <Grid item md={6} xs={12} sx={{mb: 1}}>
                    <Typography sx={{ fontSize: 20 }} color='#9e9e9e'>
                        Status
                    </Typography>
                    <Typography>
                        {metadata.currentStatus}
                    </Typography>
                </Grid>
                <Grid item md={6} xs={12} sx={{mb: 1}}>
                    <Typography sx={{ fontSize: 20 }} color='#9e9e9e'>
                        Location
                    </Typography>
                    <Typography>
                        {metadata.city}, {metadata.country}
                    </Typography>
                </Grid>
                <Grid item md={6} xs={12} sx={{mb: 1}}>
                    <Typography sx={{ fontSize: 20 }} color='#9e9e9e'>
                        Role
                    </Typography>
                    <Typography>
                        {metadata.role}
                    </Typography>
                </Grid>
            </Grid>
            <Typography sx={{ fontSize: 20, mb: 1}} color='#9e9e9e'>
                Datasets
            </Typography>
            <GetAllDatasets/>
            <CreateDataset/>
        </div>
    );
}

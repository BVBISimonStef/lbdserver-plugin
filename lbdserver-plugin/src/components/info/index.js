import { Typography } from '@mui/material';
import React, {useEffect, useState} from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CloseIcon from '@mui/icons-material/Close';
import { useRecoilState, useRecoilValue } from 'recoil'
import { project as p } from "../../atoms"
import { newEngine } from '@comunica/actor-init-sparql'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';

export default function Info() {
    const [metadata, setMetadata] = useState({})
    const [project, setProject] = useRecoilState(p)

    useEffect(() => {
        getProjectData()
        console.log('project', project)
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
            <Typography variant='h5'>
                {metadata.label}
            </Typography>
            <Typography sx={{ fontSize: 18 }} color='#9e9e9e'>
                Starting Year
            </Typography>
            <Typography>
                {metadata.year}
            </Typography>
            <Typography sx={{ fontSize: 18 }} color='#9e9e9e'>
                Status
            </Typography>
            <Typography>
                {metadata.currentStatus}
            </Typography>
            <Typography sx={{ fontSize: 18 }} color='#9e9e9e'>
                Location
            </Typography>
            <Typography>
                {metadata.city}, {metadata.country}
            </Typography>
            <Typography sx={{ fontSize: 18 }} color='#9e9e9e'>
                Role
            </Typography>
            <Typography>
                {metadata.role}
            </Typography>
            <Typography sx={{ fontSize: 18 }} color='#9e9e9e'>
                Datasets
            </Typography>
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="MyDataset1"
                    name="datasetbuttons"
                >
                    <FormControlLabel value="MyDataset1" control={<Radio />} label="MyDataset1" />
                    <FormControlLabel value="MyDataset2" control={<Radio />} label="MyDataset2" />
                    <FormControlLabel value="MyDataset3" control={<Radio />} label="MyDataset3" />
                </RadioGroup>
            </FormControl>
        </div>
    );
}

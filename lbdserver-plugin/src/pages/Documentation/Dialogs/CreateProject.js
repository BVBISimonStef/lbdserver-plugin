import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Alert } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { getDefaultSession, login, Session } from '@inrupt/solid-client-authn-browser';
import { useRecoilState, useRecoilValue } from 'recoil'
import { project as p } from "../../../atoms"
import { v4 } from "uuid"
import DialogTemplate from './DialogTemplate';
import { LbdProject, LbdService } from "lbdserver-client-api"
import { AGGREGATOR_ENDPOINT } from '../../../constants';
import { extract } from '../../../util/functions';
import { DCTERMS, LDP, RDFS } from '@inrupt/vocab-common-rdf'

export default function CreateProject(props) {
    const { open, title, description, Child, childProps } = props
    const [project, setProject] = useRecoilState(p)
    const [aggregator, setAggregator] = useState(AGGREGATOR_ENDPOINT)
    const [endpointType, setEndpointType] = useState("public")
    const [projects, setProjects] = useState([])
    const [error, setError] = useState(null)
    const [name, setName] = useState("")
    const [year, setYear] = useState("")
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [status, setStatus] = useState("")
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [id, setId] = useState(v4())
    async function createProject() {
        try {
            setLoading(true)
            const myService = new LbdService(getDefaultSession())
            let aggregator = await myService.getProjectRegistry(getDefaultSession().info.webId)
            if (!aggregator) aggregator = await myService.createProjectRegistry()
            console.log('aggregator', aggregator)
            const accessPoint = aggregator + id
            const myProject = new LbdProject(getDefaultSession(), accessPoint)
            await myProject.create([], { [RDFS.label]: name, "http://www.w3.org/2006/time#year": year, "http://dbpedia.org/ontology/country": country, "http://dbpedia.org/ontology/city": city, "http://dbpedia.org/ontology/currentStatus": status, "http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Role": role }, true)
            
            setProject(myProject)
            setSuccess(true)
            setLoading(false)
        } catch (error) {
            console.log('error', error)
            setError(error)
            setLoading(false)
        }

    }

    return <div>
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
        {getDefaultSession().info.isLoggedIn ? (
            <div style={{ marginTop: 30 }}>

            <br/>
            <TextField
                    id="projectName"
                    label="Project Name"
                    placeholder="Project Name"
                    fullWidth
                    sx={{ mb: '2%' }}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    disabled={loading}
                    error={name === ""}
                    helperText={name  === "" ? 'Empty field!' : ' '}
        
                />
                <TextField
                    id="projectId"
                    label="Project ID"
                    placeholder="Project ID"
                    defaultValue={id}
                    fullWidth
                    sx={{ mb: '2%' }}
                    onChange={(e) => setId(e.target.value)}
                    autoFocus
                    disabled={loading}
                />
                <TextField
                    id="country"
                    label="Country"
                    placeholder="Country"
                    style={{ width: '49%' }}
                    sx={{ mr: '2%', mb: '2%' }}
                    onChange={(e) => setCountry(e.target.value)}
                    autoFocus
                    disabled={loading}
                    error={country === ""}
                    helperText={country  === "" ? 'Empty field!' : ' '}
                />
                <TextField
                    id="city"
                    label="City"
                    placeholder="City"
                    style={{ width: '49%', mb: '2%' }}
                    onChange={(e) => setCity(e.target.value)}
                    autoFocus
                    disabled={loading}
                    error={city === ""}
                    helperText={city  === "" ? 'Empty field!' : ' '}
                />
                <TextField
                    id="status"
                    label="Status"
                    placeholder="Status"
                    style={{ width: '69%' }}
                    sx={{ mr: '2%', mb: '2%' }}
                    onChange={(e) => setStatus(e.target.value)}
                    autoFocus
                    disabled={loading}
                    error={status === ""}
                    helperText={status  === "" ? 'Empty field!' : ' '}
                />
                <TextField
                    id="projectYear"
                    label="Project Year"
                    placeholder="Project Year"
                    style={{ width: '29%' }}
                    sx={{ mb: '2%' }}
                    onChange={(e) => setYear(e.target.value)}
                    autoFocus
                    disabled={loading}
                    error={year === ""}
                    helperText={year  === "" ? 'Empty field!' : ' '}
                />
                <TextField
                    id="role"
                    label="Role"
                    placeholder="Role"
                    fullWidth
                    sx={{ mb: '2%' }}
                    onChange={(e) => setRole(e.target.value)}
                    autoFocus
                    disabled={loading}
                    error={role === ""}
                    helperText={role  === "" ? 'Empty field!' : ' '}
                />
            <Button style={{marginTop: 10, width: "200"}} variant="contained" onClick={createProject} disabled={loading}>Create Project</Button>
            {error ? (
                <Alert onClose={() => setError(null)} severity="error">{error.message}</Alert>
            ) : (<React.Fragment/>)}
                        {success ? (
                <Alert onClose={() => setSuccess(null)} severity="success">Your project was successfully created and is now the Active Project</Alert>
            ) : (<React.Fragment/>)}
            </div>
        ) : (
            <div style={{ marginTop: 30 }}>
                <Typography>You are not authenticated. You will not be able to create a project.</Typography>
            </div>
        )}
    </div>
};


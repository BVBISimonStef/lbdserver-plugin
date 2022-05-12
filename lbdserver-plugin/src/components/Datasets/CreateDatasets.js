import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Alert } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useRecoilState, useRecoilValue } from 'recoil'
import { project as p } from "../../atoms"
import { AGGREGATOR_ENDPOINT } from '../../constants';
import { DCTERMS, LDP, RDFS } from '@inrupt/vocab-common-rdf'

const Input = styled('input')({
    display: 'none',
});

export default function CreateDataset(props) {
    const { open, title, description, Child, childProps } = props
    const [project, setProject] = useRecoilState(p)
    const [aggregator, setAggregator] = useState(AGGREGATOR_ENDPOINT)
    const [projects, setProjects] = useState([])
    const [error, setError] = useState(null)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const [label, setLabel] = useState("")
    const [comment, setComment] = useState("")
    const [isPublic, setIsPublic] = useState("undefined")
    const [file, setFile] = useState(null)

    async function createDataset() {
        try {
            setLoading(true)
            const theDataset = await project.addDataset({ [RDFS.label]: label, [RDFS.comment]: comment }, eval(isPublic))
            if (file) {
                await theDataset.addDistribution(file, undefined, {}, undefined, eval(isPublic))
            }
            setSuccess(true)
            setFile(null)
            setLoading(false)
        } catch (error) {
            setError(error)
            setFile(null)
            setLoading(false)
        }
    }

    async function createEmptyDataset() {
        try {
            setLoading(true)
            const theDataset = await project.addDataset({ [RDFS.label]: label, [RDFS.comment]: comment }, eval(isPublic))
            await theDataset.addDistribution(Buffer.from(""), "text/turtle", {}, undefined, eval(isPublic))
            setSuccess(true)
            setLoading(false)
        } catch (error) {
            setError(error)
            setFile(null)
            setLoading(false)
        }

    }

    return <div>
        <Typography>{description}</Typography>
        <div style={{ marginTop: 30 }}>
            <div>
                <TextField
                    style={{ marginTop: 10 }}
                    id="label"
                    label="Dataset label (leave empty to omit)"
                    placeholder="Label"
                    defaultValue={label}
                    fullWidth
                    onChange={(e) => setLabel(e.target.value)}
                    autoFocus
                    disabled={loading}
                />
                <TextField
                    style={{ marginTop: 20 }}

                    id="description"
                    label="Dataset description (leave empty to omit)"
                    placeholder="Description"
                    defaultValue={label}
                    fullWidth
                    onChange={(e) => setComment(e.target.value)}
                    autoFocus
                    disabled={loading}
                />
                <FormControl style={{ marginTop: 15 }}>

                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        onChange={(e) => setIsPublic(e.target.value)}
                        value={isPublic}
                    >
                        <FormControlLabel key={"public"} label={"Public"} control={<Radio />} value={"true"} />
                        <FormControlLabel key={"private"} label={"Private"} control={<Radio />} value={"false"} />
                        <FormControlLabel key={"inherit"} label={"Inherit"} control={<Radio />} value={"undefined"} />
                    </RadioGroup>
                </FormControl>
                <br />
                <label style={{ margin: 10, width: "200" }} htmlFor="contained-button-file">
                    <Input onChange={e => setFile(e.target.files[0])} id="contained-button-file" type="file" />
                    <Button variant="contained" component="span">
                        Choose File
                    </Button>
                </label>
                <Button style={{ margin: 10, width: "200" }} variant="contained" onClick={createDataset} disabled={loading || !file}>Create Dataset</Button>
                <Button style={{ margin: 10, width: "200" }} variant="contained" onClick={createEmptyDataset} disabled={loading}>Create Empty Dataset</Button>

                {error ? (
                    <Alert onClose={() => setError(null)} severity="error">{error.message}</Alert>
                ) : (<React.Fragment />)}
                {success ? (
                    <Alert onClose={() => setSuccess(null)} severity="success">Your dataset was successfully created.</Alert>
                ) : (<React.Fragment />)}
            </div>
        </div>
    </div>
};
import React, { useState } from 'react';
import { TextField, Button, FormControl, RadioGroup, Radio, FormControlLabel, Alert, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useRecoilState } from 'recoil'
import { project as p, trigger as t } from "../../atoms"
import { AGGREGATOR_ENDPOINT } from '../../constants';
import { RDFS } from '@inrupt/vocab-common-rdf'
import { v4 } from 'uuid'
import CloseIcon from '@mui/icons-material/Close';

const Input = styled('input')({
    display: 'none',
});

export default function CreateDataset(props) {
    const [openform, setOpenform] = useState(false);
    const { open, title, description, Child, childProps } = props
    const [project, setProject] = useRecoilState(p)
    const [aggregator, setAggregator] = useState(AGGREGATOR_ENDPOINT)
    const [projects, setProjects] = useState([])
    const [error, setError] = useState(null)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [trigger, setTrigger] = useRecoilState(t)
    const [label, setLabel] = useState("")
    const [comment, setComment] = useState("")
    const [isPublic, setIsPublic] = useState("undefined")
    const [file, setFile] = useState(null)
    const [foutmelding, setFoutmelding] = useState(true)

    const handleClickOpen = () => {
        setOpenform(true);
    };

    const handleClose = () => {
        setOpenform(false);
    };

    async function createDataset() {
        try {
            setLoading(true)
            if (label === "") {
                setError(true)
                setLoading(false)
                setFoutmelding("")
            } else {
                const theDataset = await project.addDataset({ [RDFS.label]: label, [RDFS.comment]: comment }, eval(isPublic))
                if (file) {
                    await theDataset.addDistribution(file, undefined, {}, undefined, eval(isPublic))
                }
                setSuccess(true)
                setFile(null)
                setLoading(false)
                setTrigger(v4())
            }
        } catch (error) {
            setError(error)
            setFile(null)
            setLoading(false)
        }
    }

    async function createEmptyDataset() {
        try {
            setLoading(true)
            if (label === "") {
                setError(true)
                setLoading(false)
                setFoutmelding("")
            } else {
                const theDataset = await project.addDataset({ [RDFS.label]: label, [RDFS.comment]: comment }, eval(isPublic))
                await theDataset.addDistribution(Buffer.from(""), "text/turtle", {}, undefined, eval(isPublic))
                setSuccess(true)
                setLoading(false)
                setTrigger(v4())
            }
        } catch (error) {
            setError(error)
            setFile(null)
            setLoading(false)
        }

    }

    return <div>
        <Button variant="contained" onClick={handleClickOpen} sx={{my: 3}}>
            Create Dataset
        </Button>
        <Dialog open={openform} onClose={handleClose}>
            <DialogTitle sx={{ m: 0, p: 2 }}>Create Dataset
                {handleClose ? (
                    <Tooltip title="Close">
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>) : null}
            </DialogTitle>
            <DialogContent>
                <TextField
                    style={{ marginTop: 10 }}
                    id="label"
                    label="Dataset label"
                    placeholder="Label"
                    defaultValue={label}
                    fullWidth
                    onChange={(e) => setLabel(e.target.value)}
                    autoFocus
                    disabled={loading}
                    error={foutmelding === "" && label === ""}
                    helperText={foutmelding === "" && label === "" ? 'Empty field!' : ' '}
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
            </DialogContent>
            <DialogActions>
                <label style={{ margin: 10, width: "200" }} htmlFor="contained-button-file">
                    <Input onChange={e => setFile(e.target.files[0])} id="contained-button-file" type="file" />
                    <Button variant="contained" component="span">
                        Choose File
                    </Button>
                </label>
                <Button style={{ margin: 10, width: "200" }} variant="contained" onClick={createDataset} disabled={loading || !file}>Create Dataset</Button>
                <Button style={{ margin: 10, width: "200" }} variant="contained" onClick={createEmptyDataset} disabled={loading}>Create Empty Dataset</Button>
            </DialogActions>
            <DialogActions style={{ justifyContent: "space-between" }}>
                {error ? (
                    <Alert sx={{width: "100%"}} onClose={() => setError(null)} severity="error">Fill in label!</Alert>
                ) : (<React.Fragment />)}
                {success ? (
                    <Alert sx={{width: "100%"}} onClose={() => setSuccess(null)} severity="success">Your dataset was successfully created.</Alert>
                ) : (<React.Fragment />)}
            </DialogActions>
        </Dialog>

    </div>
};
import React, { useEffect, useState } from 'react';
import {  Typography, FormControlLabel,  Checkbox, FormGroup, Grid, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button  } from '@mui/material'
import { styled } from '@mui/material/styles';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { useRecoilState } from 'recoil'
import { project as p, datasets as d, trigger as t, filetype, filter} from "../../atoms"
import { LbdDataset } from "lbdserver-client-api"
import { AGGREGATOR_ENDPOINT } from '../../constants';
import { extract } from '../../util/functions';
import { DCTERMS, RDFS, DCAT } from '@inrupt/vocab-common-rdf'
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 } from "uuid"

const Input = styled('input')({
    display: 'none',
});

export default function GetAllDatasets(props: any) {
    const { open, title, description, Child, childProps } = props
    const [project, setProject] = useRecoilState(p)
    const [aggregator, setAggregator] = useState(AGGREGATOR_ENDPOINT)
    const [projects, setProjects] = useState([])
    const [error, setError] = useState(null)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [datasets, setDatasets] = useRecoilState(d)
    const [trigger, setTrigger] = useRecoilState(t)
    const [filetypes, setFiletypes] = useRecoilState(filetype)
    const [filters, setFilters] = useRecoilState(filter)

    async function getAllDatasets() {
        try {
            setLoading(true)
            const allDatasets = await project.getAllDatasetUrls()
            const loaded = {}
            const mediatypes = new Set()
            for (const ds of allDatasets) {
                const myDs = new LbdDataset(getDefaultSession(), ds)
                await myDs.init()
                const distribution = extract(myDs.data, myDs.url)[DCAT.distribution][0]["@id"]
                const mediatype = extract(myDs.data, distribution)[DCAT.mediaType][0]["@id"]
                const type = mediatype.substring(mediatype.lastIndexOf('/') + 1)
                mediatypes.add(type)
                if (type == filters || filters == "") {
                  loaded[ds] = { dataset: myDs, active: false }
                } 
            }
            setDatasets(loaded)
            setFiletypes(Array.from(mediatypes))
        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllDatasets()
    }, [trigger, filters])

    if (Object.keys(datasets).length != 0) {
        return <div key={trigger}>
            <Typography>{description}</Typography>
            <div>
                <FormGroup>
                    {Object.keys(datasets).map(ds => {
                        return <DatasetInfo key={ds} dataset={datasets[ds]} />
                    })}
                </FormGroup>
            </div>
        </div>
    } else {
        return <div>
        <Typography>There are currently no datasets attached to the project.</Typography>
        </div>
    }}


function DatasetInfo(props: { dataset: { dataset: InstanceType<typeof LbdDataset>, active: boolean } }) {
    const [datasets, setDatasets] = useRecoilState(d)

    const { dataset, active } = props.dataset

    function makeLabel() {
        const label = extract(dataset.data, dataset.url)[RDFS.label][0]["@value"]
        const creator = extract(dataset.data, dataset.url)[DCTERMS.creator][0]["@id"].slice(22, -16)
        const distribution = extract(dataset.data, dataset.url)[DCAT.distribution][0]["@id"]
        const mediatype = extract(dataset.data, distribution)[DCAT.mediaType][0]["@id"]
        const type = mediatype.substring(mediatype.lastIndexOf('/') + 1)
        const first = creator.charAt(0).toUpperCase()
        const [open, setOpen] = useState(false)
        const [trigger, setTrigger] = useRecoilState(t)

        async function handleClick() {
          const theDataset = new LbdDataset(getDefaultSession(), dataset.url)
          await theDataset.init()
          await theDataset.delete()
          setTrigger(v4())
          setOpen(false)
        }
      
        function handleClickOpen() {
          setOpen(true)
        }
      
        function handleClose() {
          setOpen(false)
        }

          return (
            <Grid container sx={{ p: 1 }} >
              <Grid item xs={10}>
              <Grid>
                <Typography display="inline" color='#9e9e9e' sx={{ mr:1 }} >
                  Label: 
                </Typography>
                <Typography display="inline" >
                  {label}
                </Typography>
              </Grid>
              <Grid>
                <Typography display="inline" color='#9e9e9e' sx={{ mr:1 }} >
                  Creator: 
                </Typography>
                <Typography display="inline" >
                  {first + creator.slice(1)}
                </Typography>
              </Grid>
              <Grid>
                <Typography display="inline" color='#9e9e9e' sx={{ mr:1 }} >
                  Mediatype: 
                </Typography>
                <Typography display="inline" >
                  {type}
                </Typography>
              </Grid>
              </Grid>
              <Grid item xs={2}>
                <Tooltip title="Delete Dataset">
                  <IconButton style={{top: '20%'}} onClick={() => handleClickOpen()}>
                      <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Do you really want to delete {label}?
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Deleting the dataset can not be undone.
                </DialogContentText>
              </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleClick} autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
              </Grid>
            </Grid>
          )
    }

    function toggleDatasetState() {
        setDatasets({ ...datasets, [dataset.url]: { dataset, active: !active } })
    }
    return (
      <Grid container>
        <Grid item xs={12} >
        <FormControlLabel onChange={toggleDatasetState} control={<Checkbox checked={active} />} label={makeLabel()}/>
        </Grid>
      </Grid>
    )
};
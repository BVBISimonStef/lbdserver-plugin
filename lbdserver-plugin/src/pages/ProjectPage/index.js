import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import BasicTabs from '../Documentation/Dialogs/BasicTabs';
import Info from '../../components/info';
import FormDialog from '../../components/issuemngmt';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Tooltip } from '@mui/material';
import GetAllDatasets from '../../components/Datasets/GetDataset';


const ProjectPage = () => {
    let navigate = useNavigate();
    function handleClick() {
        navigate("/dashboard")
    }

    return (
        <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={7}>
                <BasicTabs title={"Scroll through the enrichment modules, visualise and query the project."} />
            </Grid>
            <Grid item xs={4}>
                <Info />
                <FormDialog />
            </Grid>
            <Grid item xs={1}>
                <Tooltip title="Close">
                    <IconButton onClick={() => handleClick()}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>

    );
}


export default ProjectPage
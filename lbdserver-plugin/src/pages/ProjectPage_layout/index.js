import React from 'react'
import Grid from '@mui/material/Grid';
import BasicTabs from '../Documentation/Dialogs/BasicTabs';
import Divider from '@mui/material/Divider';
import Info from '../../components/info';
import FormDialog from '../../components/issuemngmt';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Tooltip } from '@mui/material';



const ProjectPage = () => {
    return (
        <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={8}>
                <BasicTabs title={"Scroll through the enrichment modules, visualise and query the project."} />
            </Grid>
            <Grid item xs={3}>
                <Info />
                <FormDialog />
            </Grid>
            <Grid item xs={1}>
                <Tooltip title="Close">
                    <IconButton href="/dashboard">
                        <CloseIcon/>
                    </IconButton>
                </Tooltip>

            </Grid>
        </Grid>

    );
}


export default ProjectPage
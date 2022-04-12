import React from 'react'
import Grid from '@mui/material/Grid';
import BasicTabs from '../Documentation/Dialogs/BasicTabs';
import Divider from '@mui/material/Divider';
import Info from '../../components/info';



const ProjectPage = () => {
    return (
        <Grid container spacing={3} sx={{p: 3}}>
            <Grid item xs={8}>  
                <BasicTabs title={"Scroll through the enrichment modules, visualise and query the project."}/>
            </Grid>
            <Grid item xs={4}>
                <Info/>
            </Grid>
        </Grid>

    );
}


export default ProjectPage
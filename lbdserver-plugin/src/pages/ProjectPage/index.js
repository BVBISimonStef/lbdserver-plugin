import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import BasicTabs from '../Documentation/Dialogs/BasicTabs';
import Info from '../../components/info';
import '../../App.css'
import $ from "jquery";



const ProjectPage = () => {
    var [windowsize, setWindowsize] = useState($(window).width())
    $(window).resize(function () {
        setWindowsize($(window).width())
    });


    if (windowsize > 960) {
        return (
            <Grid container spacing={3} sx={{ p: 3 }}>
                <Grid item xs={8}>
                    <BasicTabs title={"Scroll through the enrichment modules, visualise and query the project."} />
                </Grid>
                <Grid item xs={4}>
                    <Info />
                </Grid>
            </Grid >
        );
    } else {
        return (
            <Grid container spacing={3} sx={{ p: 3 }}>
                <Grid item xs={12}>
                    <Info />
                </Grid>
                <Grid item xs={12}>
                    <BasicTabs title={"Scroll through the enrichment modules, visualise and query the project."} />
                </Grid>
            </Grid >
        );
    }
}


export default ProjectPage
import React from 'react'
import { Grid } from '@mui/material'
import CreateProject from '../Documentation/Dialogs/CreateProject'

const DemoPage = () => {
    return (
        <Grid style={{ textAlign: "justify" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={1} sm={1} md={2} />
            <Grid item xs={4} sm={6} md={8} >
                <div style={subComponentStyle}>
                    <CreateProject title={"Create a project"} />
                </div>
            </Grid>
            <Grid item xs={0} sm={2} md={3} />
        </Grid>
    )
}

const subComponentStyle = { marginTop: 30, borderRadius: 15, padding: 15}

export default DemoPage
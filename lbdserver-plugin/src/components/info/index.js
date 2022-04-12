import { Typography } from '@mui/material';
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function Info() {

    return (
        <div>
            <Typography variant='h5'>
                MyFirstProject
            </Typography>
            <Typography sx={{ fontSize: 18 }} color='#9e9e9e'>
                Starting Year
            </Typography>
            <Typography>
                2021
            </Typography>
            <Typography sx={{ fontSize: 18 }} color='#9e9e9e'>
                Status
            </Typography>
            <Typography>
                In construction
            </Typography>
            <Typography sx={{ fontSize: 18 }} color='#9e9e9e'>
                Location
            </Typography>
            <Typography>
                Ghent, Belgium
            </Typography>
            <Typography sx={{ fontSize: 18 }} color='#9e9e9e'>
                Role
            </Typography>
            <Typography>
                Architect
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
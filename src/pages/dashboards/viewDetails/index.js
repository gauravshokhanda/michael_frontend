import React from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button';
import EnquiryDetail from 'src/views/dashboards/enquiry/EnquiryDetail'

const EnquiryData = () => {
    return (
        <ApexChartWrapper>
            <Grid container spacing={6}>
                <Grid item xs={12} lg={12} sx={{ order: [1, 1, 1, 0] }}>

                    <EnquiryDetail />
                </Grid>
            </Grid>
        </ApexChartWrapper>
    )
}

export default EnquiryData
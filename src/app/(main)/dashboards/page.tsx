'use client';
import DailyChart from '@/app/components/DailyChart';
import SummaryCards from '@/app/components/SummaryCards';
import { useStoreData } from '@/app/hooks/useStoreData';
import { Box, Grid, Typography, Container } from '@mui/material';
import { useEffect } from 'react';


export default function DashboardPage() {
const setPageTitle = useStoreData((state) => state.setPageTitle)
  useEffect(() => {
      setPageTitle("DashBoard");
    }, [setPageTitle]);
  return (
    <Box sx={{ display: 'flex' }}>


      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ERP-PO
        </Typography>

        {/* Summary cards */}
        <SummaryCards />

        {/* Chart section */}
        <Box mt={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
           Test
          </Typography>
          <DailyChart />
        </Box>
      </Container>
    </Box>
  );
}
function setPageTitle(arg0: string) {
  throw new Error('Function not implemented.');
}


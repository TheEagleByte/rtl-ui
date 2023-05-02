import React from 'react'
import { Container, Box, CircularProgress, Typography, Stack, Paper } from '@mui/material'
import dynamic from 'next/dynamic';
const RtlHeatmap = dynamic(() => import('@/components/RtlHeatmap'), { ssr: false });
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useData } from '@/query/rtl';

const Index = () => {
  const { isLoading, isFetching, data } = useData();

  return (
    <>
      {isLoading && (
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      )}
      {!isLoading && data && (
        <Box className="rtl-container">
          <Stack direction="row" spacing={2} sx={{ p: 2 }} alignItems="center" justifyContent="space-between">
            <Typography variant="h4">
              RTL-SDR Heatmap
            </Typography>
            {isFetching && (
              <CircularProgress />
            )}
          </Stack>
          <ParentSize>
            {({ width, height }) =>
              <RtlHeatmap width={width} height={height} data={data} />
            }
          </ParentSize>
        </Box>
      )}
    </>
  );
};

export default Index
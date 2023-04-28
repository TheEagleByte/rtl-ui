import React from 'react'
import { Container, Box, CircularProgress } from '@mui/material'
import dynamic from 'next/dynamic';
const RtlHeatmap = dynamic(() => import('@/components/RtlHeatmap'), { ssr: false });
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useData } from '@/query/rtl';

const Index = () => {
  const { isLoading, data } = useData();

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
        <ParentSize>
          {({ width, height }) =>
            <RtlHeatmap width={width} height={height} data={data} />
          }
        </ParentSize>
      )}
    </>
  );
};

export default Index
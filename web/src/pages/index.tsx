import React from 'react'
import { Container, Box } from '@mui/material'
import dynamic from 'next/dynamic';
const RtlHeatmap = dynamic(() => import('@/components/RtlHeatmap'), { ssr: false });
import ParentSize from '@visx/responsive/lib/components/ParentSize';

const Index = () => (
  <ParentSize>
    {({ width, height }) =>
      <RtlHeatmap width={width} height={height} />
    }
  </ParentSize>
);

export default Index
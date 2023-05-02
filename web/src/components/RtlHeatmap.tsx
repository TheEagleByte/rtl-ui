import { useCallback, useMemo } from 'react';
import { RtlData, RtlFrequency, } from '@/query/rtl';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { Typography } from '@mui/material';
import {
    useTooltip,
    useTooltipInPortal,
    defaultStyles,
} from '@visx/tooltip';
import { scaleLinear, scaleTime } from '@visx/scale';
import RtlHeatmapChart from './RtlHeatmapChart';

// HH:MM:SS AM/PM
const formatTime = (value: any) => timeFormat("%I:%M:%S %p")(new Date(value));
const formatFrequency = (value: any) => format(".3s")(value) + "Hz";

const background = '#28272c';
const margin = { top: 60, left: 110, right: 35, bottom: 20 };

export type TooltipProps = {
    width: number;
    height: number;
    showControls?: boolean;
};

type TooltipData = {
    time: string;
    freq: string;
    frequency: RtlFrequency | null | undefined;
};

const defaultData = {
    time: '',
    freq: '',
    frequency: null
}

const positionIndicatorSize = 8;

export type HeatmapProps = {
    data: RtlData;
    width: number;
    height: number;
};

const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: background,
    color: 'white',
    width: 160,
    height: 62,
    padding: 12,
};

function RtlHeatmap({
    data,
    width,
    height
}: HeatmapProps) {
    const {
        frequencies,
        data: rows,
        stats
    } = data;

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.bottom - margin.top;

    // scales
    const xScale = useMemo(() => scaleLinear({
        domain: stats.freqRange,
        range: [0, xMax]
    }), [stats.freqRange, xMax]);

    const yScale = useMemo(() => scaleTime({
        domain: [new Date(stats.timeRange[0]), new Date(stats.timeRange[1])],
        range: [yMax, 0],
        reverse: true
    }), [stats.timeRange, yMax]);

    const colorScale = useMemo(() => scaleLinear({
        range: [0, 1],
        domain: stats.dbRange
    }), [stats.dbRange]);

    const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal({
        scroll: true,
        detectBounds: true,
    });

    const {
        showTooltip,
        hideTooltip,
        tooltipOpen,
        tooltipData,
        tooltipLeft = 0,
        tooltipTop = 0,
    } = useTooltip<TooltipData>({
        tooltipOpen: false,
        tooltipLeft: width / 3,
        tooltipTop: height / 3,
        tooltipData: defaultData,
    });

    const handlePointerMove = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const actualBounds = {
                left: containerBounds.left + margin.left,
                top: containerBounds.top + margin.top,
                width: containerBounds.width - margin.left - margin.right,
                height: containerBounds.height - margin.top - margin.bottom
            };

            // If the event is outside the bounds of the chart, hide the tooltip
            if (event.clientX < actualBounds.left || event.clientX > actualBounds.left + actualBounds.width ||
                event.clientY < actualBounds.top || event.clientY > actualBounds.top + actualBounds.height) {
                hideTooltip();
                return;
            }

            // coordinates should be relative to the container in which Tooltip is rendered
            const containerX = ('clientX' in event ? event.clientX : 0) - containerBounds.left;
            const containerY = ('clientY' in event ? event.clientY : 0) - containerBounds.top;

            const x0 = xScale.invert(containerX - margin.left);
            const y0 = yScale.invert(containerY - margin.top);

            // Find a frequency that's within the freqStart and freqStop points of x0
            const frequency = frequencies.find(f => f.freqStart <= x0 && f.freqStop >= x0);

            showTooltip({
                tooltipLeft: containerX,
                tooltipTop: containerY,
                tooltipData: {
                    time: formatTime(y0),
                    freq: formatFrequency(x0),
                    frequency
                }
            });
        },
        [containerBounds.left, containerBounds.top, containerBounds.width, containerBounds.height, xScale, yScale, frequencies, showTooltip, hideTooltip],
    );

    if (width < 10) return <Typography variant="h6">Too small</Typography>;
    return (
        <div ref={containerRef} style={{ width, height }} onPointerMove={handlePointerMove} className="tooltip">
            <RtlHeatmapChart
                data={data}
                width={width}
                height={height}
                margin={margin}
                formatTime={formatTime}
                formatFrequency={formatFrequency}
                xScale={xScale}
                yScale={yScale}
                colorScale={colorScale}
            />
            {tooltipOpen && (
                <>
                    <div
                        className="position-indicator"
                        style={{ transform: `translate(${tooltipLeft - positionIndicatorSize / 2}px, ${tooltipTop - positionIndicatorSize / 2}px)` }}
                    />
                    <div
                        className="crosshair horizontal"
                        style={{ transform: `translateY(${tooltipTop}px)` }}
                    />
                    <div
                        className="crosshair vertical"
                        style={{ transform: `translateX(${tooltipLeft}px)` }}
                    />
                    {/* {tooltipData?.frequency && (
                        <>
                            <div
                                className="freqBand-left"
                                style={{ transform: `translateX(${xScale(tooltipData.frequency.freqStart) + margin.left}px)` }}
                            />
                            <div
                                className="freqBand-right"
                                style={{ transform: `translateX(${xScale(tooltipData.frequency.freqStop) + margin.left}px)` }}
                            />
                        </>
                    )} */}
                    <TooltipInPortal
                        key={Math.random()} // needed for bounds to update correctly
                        left={tooltipLeft}
                        top={tooltipTop}
                        style={tooltipStyles}
                    >
                        {/* {tooltipData?.frequency && (
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {tooltipData.frequency.description}
                            </Typography>
                        )} */}
                        {tooltipData && (
                            <>
                                <Typography variant="body2">
                                    <strong>Time: </strong>{tooltipData.time}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Frequency: </strong>{tooltipData.freq}
                                </Typography>
                            </>
                        )}
                    </TooltipInPortal>
                </>
            )}
        </div>
    );
}

export default RtlHeatmap;


import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AxisTop, AxisLeft, } from '@visx/axis';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { interpolateViridis } from 'd3-scale-chromatic';
import { HeatmapRect } from '@visx/heatmap';
import { RtlData, RtlDataRow } from '@/query/rtl';
import { Typography } from '@mui/material';

const background = '#28272c';
const tickLabelColor = '#fff';

const tickLabelProps = {
    fill: tickLabelColor,
    fontSize: 12,
    fontFamily: 'sans-serif',
    textAnchor: 'middle',
}

export type HeatmapProps = {
    data: RtlData;
    width: number;
    height: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    events?: boolean;
};

const margin = { top: 60, left: 100, right: 35, bottom: 20 };

const bins = (d: RtlDataRow) => d.bins;

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
    return Math.max(...data.map(value));
}

function min<Datum>(data: Datum[], value: (d: Datum) => number): number {
    return Math.min(...data.map(value));
}

const formatTime = (value: any) => timeFormat("%I:%M %p")(new Date(value));
const formatFrequency = (value: any) => format(".3s")(value) + "Hz";

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
    const xScale = scaleLinear({
        domain: stats.freqRange,
        range: [0, xMax]
    });
    const yScale = scaleTime({
        domain: [new Date(stats.timeRange[0]), new Date(stats.timeRange[1])],
        range: [yMax, 0],
        reverse: true
    });
    const colorScale = scaleLinear({
        range: [0, 1],
        domain: stats.dbRange
    });

    if (width < 10) return <Typography variant="h6">Too small</Typography>;
    return (
        <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} rx={14} fill={background} />
            <Group top={margin.top} left={margin.left}>
                <HeatmapRect
                    data={rows}
                    xScale={xScale}
                    yScale={yScale}
                    gap={0}
                >
                    {(heatmap) => heatmap.map((heatmapBins, heatIndex) => {
                        return heatmapBins.map((bin, binIndex) => {
                            const x = xScale(rows[heatIndex].bins[binIndex].bin);
                            const y = yScale(new Date(rows[heatIndex].bin));
                            const h = (heatIndex != rows.length - 1 && binIndex < rows[heatIndex + 1].bins.length)
                                ? yScale(new Date(rows[heatIndex + 1].bin)) - yScale(new Date(rows[heatIndex].bin))
                                : yScale(new Date(rows[heatIndex].bin)) - yScale(new Date(rows[heatIndex - 1].bin));
                            const w = xScale(rows[heatIndex].bins[binIndex].bin + stats.freqStep) - xScale(rows[heatIndex].bins[binIndex].bin);

                            return (
                                <rect
                                    key={`heatmap-rect-${bin.row}-${bin.column}`}
                                    width={w}
                                    height={h}
                                    x={x}
                                    y={y}
                                    fill={interpolateViridis(colorScale(bin.count!)) ?? '#000'}
                                    fillOpacity={bin.opacity}
                                />
                            )
                        })
                    })}
                </HeatmapRect>
                <AxisLeft
                    scale={yScale}
                    tickFormat={formatTime}
                    label="Time"
                    labelProps={{
                        fill: "#fff",
                        fontSize: 12,
                        textAnchor: 'middle'
                    }}
                    labelOffset={70}
                    tickStroke={"#fff"}
                    tickLabelProps={{
                        fill: "#fff",
                        fontSize: 12,
                        textAnchor: 'end'
                    }}
                    stroke="#fff"
                />
                <AxisTop
                    scale={xScale}
                    top={0}
                    left={0}
                    label="Frequency"
                    labelProps={{
                        fill: "#fff",
                        fontSize: 12,
                        textAnchor: 'middle'
                    }}
                    labelOffset={20}
                    tickFormat={formatFrequency}
                    tickStroke={"#fff"}
                    numTicks={16}
                    tickLabelProps={{
                        fill: "#fff",
                        fontSize: 12,
                        textAnchor: 'middle'
                    }}
                    stroke="#fff"
                />
            </Group>
        </svg>
    );
}

export default RtlHeatmap;


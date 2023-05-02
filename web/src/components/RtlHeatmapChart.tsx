import { memo } from 'react';
import { Group } from '@visx/group';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { AxisTop, AxisLeft, } from '@visx/axis';
import { interpolateViridis } from 'd3-scale-chromatic';
import { HeatmapRect } from '@visx/heatmap';
import { RtlData } from '@/query/rtl';

const background = '#28272c';

export type HeatmapChartProps = {
    data: RtlData;
    width: number;
    height: number;
    margin: { top: number; right: number; bottom: number; left: number };
    formatTime: (value: any) => string;
    formatFrequency: (value: any) => string;
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleTime<number, number, never>;
    colorScale: ScaleLinear<number, number, never>;
};

function RtlHeatmapChart({
    data,
    width,
    height,
    margin,
    formatTime,
    formatFrequency,
    xScale,
    yScale,
    colorScale
}: HeatmapChartProps) {
    const {
        frequencies,
        data: rows,
        stats
    } = data;

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
                            const y = rows.length === 1 ? 0 : yScale(new Date(rows[heatIndex].bin));
                            let h;
                            if (rows.length === 1) {
                                h = height - margin.top - margin.bottom;
                            } else {
                                h = (heatIndex != rows.length - 1 && binIndex < rows[heatIndex + 1].bins.length)
                                    ? yScale(new Date(rows[heatIndex + 1].bin)) - yScale(new Date(rows[heatIndex].bin))
                                    : yScale(new Date(rows[heatIndex].bin)) - yScale(new Date(rows[heatIndex - 1].bin));
                            }

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
                    labelOffset={80}
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

export default memo(RtlHeatmapChart);


import { Group } from '@visx/group';
import { scaleLinear, scaleTime, scaleOrdinal } from '@visx/scale';
import { Axis, Orientation, SharedAxisProps, AxisScale } from '@visx/axis';
import { HeatmapRect } from '@visx/heatmap';
import { RtlBinData, RtlData, RtlDataRow } from '@/query/rtl';
import { interpolateTurbo } from 'd3-scale-chromatic';

const hot1 = '#77312f';
const hot2 = '#f33d15';
const cool1 = '#122549';
const cool2 = '#b4fbde';
const background = '#28272c';
const axisColor = '#fff';
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

const margin = { top: 10, left: 20, right: 20, bottom: 110 };

const bins = (d: RtlDataRow) => d.bins;
const count = (d: RtlBinData) => d.count;

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
    return Math.max(...data.map(value));
}

function min<Datum>(data: Datum[], value: (d: Datum) => number): number {
    return Math.min(...data.map(value));
}

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

    const colorMax = max(rows, (d) => max(bins(d), count));
    const bucketSizeMax = max(rows, (d) => bins(d).length);

    // bounds
    const size =
        width > margin.left + margin.right ? width - margin.left - margin.right : width;
    const xMax = size;
    const yMax = height - margin.bottom - margin.top;

    // scales
    const xScale = scaleLinear<number>({
        domain: [0, rows.length]
    });
    const yScale = scaleTime<number>({
        domain: [0, bucketSizeMax]
    });
    const colorScale = scaleLinear<number>({
        range: [0, 1],
        domain: [0, colorMax]
    });

    const binWidth = xMax / rows.length;
    const binHeight = yMax / bucketSizeMax;

    xScale.range([0, xMax]);
    yScale.range([yMax, 0]);

    return width < 10 ? null : (
        <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} rx={14} fill={background} />
            <Group top={margin.top} left={margin.left}>
                <HeatmapRect
                    data={rows}
                    xScale={(d) => xScale(d) ?? 0}
                    yScale={(d) => yScale(d) ?? 0}
                    binWidth={binWidth}
                    binHeight={binHeight}
                    gap={0}
                >
                    {(heatmap) =>
                        heatmap.map((heatmapBins) =>
                            heatmapBins.map((bin) => (
                                <rect
                                    key={`heatmap-rect-${bin.row}-${bin.column}`}
                                    className="visx-heatmap-rect"
                                    width={bin.width}
                                    height={bin.height}
                                    x={bin.x}
                                    y={bin.y}
                                    fill={interpolateTurbo(colorScale(bin.count!)) ?? '#000'}
                                    fillOpacity={bin.opacity}
                                    onClick={() => {
                                        const { row, column } = bin;
                                        alert(JSON.stringify({ row, column, bin: bin.bin }));
                                    }}
                                />
                            ))
                        )
                    }
                </HeatmapRect>
            </Group>
        </svg>
    );
}

export default RtlHeatmap;
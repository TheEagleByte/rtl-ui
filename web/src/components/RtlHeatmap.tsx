import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Axis, Orientation, SharedAxisProps, AxisScale } from '@visx/axis';
import { HeatmapRect } from '@visx/heatmap';
import { RtlBinData, RtlData, RtlDataRow } from '@/query/rtl';

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

    const bucketSizeMax = rows.length;

    // bounds
    const size =
        width > margin.left + margin.right ? width - margin.left - margin.right : width;
    const xMax = size;
    const yMax = height - margin.bottom - margin.top;

    // scales
    const xScale = scaleLinear<number>({
        domain: stats.freqRange,
        range: [0, xMax],
    });
    const yScale = scaleTime<number>({
        domain: stats.timeRange,
        range: [yMax, 0],
    });
    const rectColorScale = scaleLinear<string>({
        range: [hot1, hot2],
        domain: stats.dbRange,
    });

    const binWidth = xMax / bucketSizeMax;
    const binHeight = yMax / bucketSizeMax;

    return width < 10 ? null : (
        <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} rx={14} fill={background} />
            <Group top={margin.top} left={margin.left}>
                <HeatmapRect
                    data={rows}
                    xScale={xScale}
                    yScale={yScale}
                    colorScale={rectColorScale}
                    binWidth={binWidth}
                    binHeight={binHeight}
                    gap={0}
                    count={(d: RtlBinData) => d.db}
                >
                    {(heatmap) => {
                        return heatmap.map((heatmapBins) =>
                        heatmapBins.map((bin) => (
                            <rect
                                key={`heatmap-rect-${bin.row}-${bin.column}`}
                                className="visx-heatmap-rect"
                                width={bin.width}
                                height={bin.height}
                                x={bin.x}
                                y={bin.y}
                                fill={bin.color}
                                onClick={() => {
                                    const { row, column } = bin;
                                    alert(JSON.stringify({ row, column, bin: bin.bin }));
                                }}
                            />
                        )),
                    )
                    }
                    }
                </HeatmapRect>
            </Group>
        </svg>
    );
}

export default RtlHeatmap;
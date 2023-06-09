import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export type RtlFrequency = {
    description: string;
    freqStart: number;
    freqStop: number;
    url: string;
}

export type RtlBinData = {
    bin: number;
    count: number;
}

export type RtlDataRow = {
    bin: Date;
    bins: RtlBinData[];
}

export type RtlStats = {
    freqRange: [number, number];
    timeRange: [Date, Date];
    dbRange: [number, number];
    freqStep: number;
}

export type RtlData = {
    stats: RtlStats;
    data: RtlDataRow[];
    frequencies: RtlFrequency[];
}

const getData = async (): Promise<RtlData> => {
    const response = await axios.get(`${baseUrl}/rtl`);
    return response.data;
};

export const useData = () => useQuery({
    queryKey: ['rtl'],
    queryFn: getData,
    refetchInterval: 1000 * 3, // 3 seconds
});
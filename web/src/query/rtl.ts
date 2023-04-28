import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export type RtlFrequency = {
    description: string;
    freqStart: number;
    freqStop: number;
    url: string;
}

export type RtlData = {
    data: string[][];
    frequencies: RtlFrequency[];
}

const getData = async (): Promise<RtlData> => {
    const response = await axios.get(`${baseUrl}/rtl`);
    return response.data;
};

const useData = () => useQuery({
    queryKey: ['rtl'],
    queryFn: getData,
    // refetchInterval: 1000,
});

export {
    useData,
}
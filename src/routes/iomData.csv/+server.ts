export const prerender = true
import csvFile from './Missing_Migrants_Global_Figures_allData.csv';
import { read } from '$app/server';

export function GET() {
    return read(csvFile);
}

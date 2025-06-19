/** @type {import('./$types').PageLoad} */
import Papa from 'papaparse';
import { group } from 'd3-array';
//import dataFile from './iomData.csv';


export const load:Load = async ({fetch, params}) => {
    try {
        const res = await fetch("/iomData.csv", {
            headers: { "content-type": "text/csv;charset=UTF-8" },
        });
        if (!res.ok) {
            console.log(res.status);
            //throw new Error('Something is broken!');
        }
        const textData = await res.text();
        const csvData = Papa.parse(textData, {header: true});
        const iomData: mmData = csvData.data
            .filter((e) => e.Coordinates !== "")
            .filter((e) => e["Incident Year"] !== undefined)
            .sort((a, b) => new Date(a["Incident Date"]) - new Date(b["Incident Date"]));
        // console.log(iomData.length);//18761
        const dataForBarchart = transformForBarchart(iomData);
        // console.log(dataForBarchart);
        return {
	    iom: {
	        metadata: iomMetadata,
	        content: dataForBarchart,
	    }
        };
    } catch (err) { console.log(err); }
}

const iomMetadata: Metadata = { updated: "Feb-2025", 
                                source: "IOM", 
                                link: "https://missingmigrants.iom.int/"};

interface Metadata { 
    updated: string;
    source: string;
    link: string;
}

interface VictimsYearType {
    year: number; 
    victims: number;
}

type VictimsPerYearType = VictimsYearType[];

interface mmRecord {
    "Main ID": undefined;
    "Incident ID": undefined;
    "Incident Type": string;
    "Region of Incident": string;
    "Incident Date": Date;
    "Incident Year": Date;
    "Month": string;
    "Number of Dead": number;
    "Minimum Estimated Number of Missing": number;
    "Total Number of Dead and Missing": number;
    "Number of Survivors": number;
    "Number of Females": number;
    "Number of Males": number;
    "Number of Children": number;
    "Country of Origin": string;
    "Region of Origin": string;
    "Cause of Death": string;
    "Country of Incident": string;
    "Migration Route": string;
    "Location of Incident": string;
    "Coordinates": [number, number];
    "UNSD Geographical Grouping": string;
    "Information Source": string;
    "URL": string;
    "Source Quality": number;
};

type mmData = mmRecord[];

function transformForBarchart(data: mmData) {
    const byYearIter = group(data, d => d["Incident Year"]);
    const byYearArr: VictimsPerYearType = Array.from(byYearIter,
                       m => new Object({
                           year: parseInt(m[0]),
                           victims: m[1].reduce( (acc, curr) => acc + parseInt(curr["Total Number of Dead and Missing"]), 0,)
                       }));
    return byYearArr;
}

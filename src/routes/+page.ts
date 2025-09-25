/** @type {import('./$types').PageLoad} */
import Papa from 'papaparse';
import { group } from 'd3-array';
import { csv } from 'd3-fetch';

const csvPath = "https://raw.githubusercontent.com/Elle-est-au-nord/explore-datasets/refs/heads/main/missing_migrants/data/Missing_Migrants_Global_Figures_allData.csv"

export const load:Load = async ({fetch, params}) => {
    //console.log("*****-1-****");
    try {
        const iomData = await csv(csvPath,
                                  (row) => ({
                                      incidentType: row["Incident Type"],
                                      regionOfIncident: row["Region of Incident"],
                                      countryOfIncident: row["Country of Incident"],
                                      locationOfIncident: row["Location of Incident"],
                                      migrationRoute: row["Migration Route"],
                                      coordinates: row["Coordinates"].split(","),
                                      incidentDate: row["Incident Date"],
                                      incidentYear: row["Incident Year"],
                                      numberOfDeath: Number(row["Number of Dead"]),
                                      totalDeadOrMissing: Number(row["Total Number of Dead and Missing"]),
                                      numberOfSurvivors: Number(row["Number of Survivors"]),
                                      url: row["URL"],
                                      sourceQuality: row["Source Quality"]
                                  }))
            .then((d) => d.filter((e) => e.coordinates !== "")
                  .filter((e) => e.incidentYear !== undefined)
                  .sort((a, b) => new Date(a.incidentDate) - new Date(b.incidentDate))
                 );
        //console.log(iomData.length);//18761
        //console.log(iomData[0]);
        const dataForBarchart = transformForBarchart(iomData);
        //console.log(dataForBarchart);
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
    missingOrDeceased: number;
    deceased: number;
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
    const byYearIter = group(data, d => d.incidentYear);
    const byYearArr: VictimsPerYearType = Array.from(byYearIter,
                       m => new Object({
                           year: parseInt(m[0]),
                           missingOrDeceased: m[1].reduce((acc, curr) => acc + parseInt(curr.totalDeadOrMissing), 0,),
                           deceased: m[1].reduce((acc, curr) => acc + parseInt(curr.numberOfDeath || 0), 0,)
                       }));
    return byYearArr;
}

/** @type {import('./$types').PageLoad} */
import Papa from 'papaparse';
import { group, extent } from 'd3-array';
import { csv } from 'd3-fetch';


const csvPath = "https://raw.githubusercontent.com/Elle-est-au-nord/explore-datasets/refs/heads/main/missing_migrants/data/Missing_Migrants_Global_Figures_allData.csv"

export const load:Load = async ({fetch, params}) => {
    try {
        const iomData = await csv(csvPath,
                                  (row) => ({
                                      incidentType: row["Incident Type"],
                                      regionOfIncident: row["Region of Incident"],
                                      countryOfIncident: row["Country of Incident"],
                                      locationOfIncident: row["Location of Incident"],
                                      migrationRoute: row["Migration Route"],
                                      coordinates: row["Coordinates"].split(", "),
                                      incidentDate: row["Incident Date"],
                                      incidentYear: row["Incident Year"],
                                      deceased: Number(row["Number of Dead"]),
                                      missingOrDeceased: Number(row["Total Number of Dead and Missing"]),
                                      numberOfSurvivors: Number(row["Number of Survivors"]),
                                      url: row["URL"],
                                      sourceQuality: row["Source Quality"]
                                  }))
            .then((d) => d.filter((e) => e.coordinates !== "")
                  .filter((e) => e.incidentYear !== undefined)
                  .sort((a, b) => new Date(a.incidentDate) - new Date(b.incidentDate))
                 );
        //console.log(iomData.length);//18761

        const dataForBarchart = transformForBarchart(iomData);
        //console.log(dataForBarchart);
        const dataForMap = transformForMap(iomData);
        //console.log(dataForMap);
        const dataForScatterplot = transformForScatterplot(iomData);
        //console.log(dataForScatterplot);

        return {
	    iom: {
	        metadata: iomMetadata,
	        content: [dataForBarchart, dataForMap, dataForScatterplot]
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


function transformForBarchart(data) {
    const byYearIter = group(data, d => d.incidentYear);
    const byYearArr = Array.from(byYearIter,
                                 m => new Object({
                                     year: parseInt(m[0]),
                                     missingOrDeceased: m[1].reduce((acc, curr) => acc + parseInt(curr.missingOrDeceased), 0,),
                                     deceased: m[1].reduce((acc, curr) => acc + parseInt(curr.deceased || 0), 0,)
                       }));
    return byYearArr;
}

function transformForMap(data) {
    const mapData = data.map(
        (d) => ({
            date: d.incidentDate,
            year: d.incidentYear,
            country: d.countryOfIncident,
            coordinates: d.coordinates,
            incident: d.incidentType,
            route: d.migrationRoute,
            missingOrDeceased: d.missingOrDeceased,
            deceased: d.deceased
        }));
    return mapData;
}

var result = [];

function prepData(value, key, map){
    result.push(new Object({
        year: value[0].incidentYear,
        region: key,
        missingOrDeceased: value.reduce((acc, curr) => acc + parseInt(curr.missingOrDeceased), 0,),
        deceased: value.reduce((acc, curr) => acc + parseInt(curr.deceased), 0,)
    }));
}

function transformForScatterplot(data) {
    const years = Array.from(new Set(data.map(d => d.incidentYear)));
    const dataByYear = group(data, d => d.incidentYear);
    // console.log(dataByYear);
    const dataByRegion = years.map(yr => group(dataByYear.get(yr),
                              d => d.regionOfIncident));
    // console.log(dataByRegion[0].get('North America'));
    //var plotData = [];
    dataByRegion.map(data => data.forEach(prepData));
    // dataByRegion.map(data, index) => data.forEach(plotData.push(new Object({
        // year: years[index],
        // region: d[0].regionOfIncident //,
        // missingOrDeceased: d.reduce((acc, curr) => 
        //                             acc + parseInt(curr.missingOrDeceased), 0,),
        // deceased: d.reduce((acc, curr) => 
        //                    acc + parseInt(curr.deceased), 0,)})));
        //                                                 }))));
    // return plotData;
    return result;
}

<script>
  import { geoPath } from 'd3-geo';
  import { geoModifiedStereographicMiller } from 'd3-geo-projection';
  import { feature, mesh } from 'topojson-client';
  import { extent } from 'd3-array';
  import { scaleSqrt } from 'd3-scale';
  import { getContext } from 'svelte';
  import countries from './countries-50m.json';

  let { data = $bindable() } = $props();
  const selected = getContext('selected');

  let width = $state();
  let height = $derived(width/2.2);
  let margin = { top: 10, left: 10, right: 10, bottom: 50 };

  const land = feature(countries, countries.objects.land);
  const countrymesh = mesh(countries, countries.objects.countries, (a, b) => a !== b);
  let projection = $derived(geoModifiedStereographicMiller()
                            .fitSize([width, height], feature(countries, countries.objects.land))
                            .center([5.42,39.14]) // GPS of location to zoom on
                            .scale(width - 100)     // This is like the zoom
                            .translate([width/2.2, height/2.7]));
  let path = $derived(geoPath(projection));
  const valueExtent = extent(data, d => +d.victims);
  const size = scaleSqrt()
        .domain(valueExtent)  // What's in the data
  .range([1, 30]);  // Size in pixel

  const medColors = {"Eastern Mediterranean": '#364fc7',
                  "Western Mediterranean": '#6741d9',
                  "Central Mediterranean": '#1971c2',
                  "Western Africa / Atlantic route to the Canary Islands": '#e67700'};

  const legendValues = [10, 100, 500, 1000];
  const xCircle = $derived(width/16);
  const xLabel = $derived(width/12);
</script>

<div class="mapcropped w-2/3" bind:clientWidth={width}>
  {#if width}
  <svg width={width}
       height={height}>
    <g>
      <path
        d={path(land)}
        fill="#adb5bd"
        opacity=0.5
        stroke="white" />
      {#if countrymesh}
      <path
        d={path(countrymesh)}
        fill="none"
        stroke="white" />
      {/if}
      {#each data as d}
        <circle class="{selected()} {d.region === 'Mediterranean' ? 'medRegion' : 'otherRegions'}"
                cx={projection([+d.coordinates[1], +d.coordinates[0]])[0]}
                cy={projection([+d.coordinates[1], +d.coordinates[0]])[1]}
                r={size(+d.victims)}>
          <title>
            {d.date} 
{d.country}
{d.route}
{d.victims} {d.victims > 1 ? " victims " : " victim "}
            {#if selected() === 'missingOrDeceased' }
{#if d.deceased} ({d.deceased} deceased) {/if}
            {/if}
            {#if selected() === 'deceased' }
({d.survivors} {d.survivors > 1 ? " survivors" : " survivor"})
            {/if}
          </title>
        </circle>
      {/each}

      {#if width > 400}
      {#each legendValues as val}
        <circle class="legendValCrop"
                cx={width/7 - xCircle}
                cy={height/2.5 - size(val)}
                r={size(val)}>
        </circle>
      {/each}
      {#each legendValues as val}
        <line   x1={width/7 - xCircle + size(val)}
                y1={height/2.5 - size(val)*1.5}
                x2={width/7 - xCircle + xLabel}
                y2={height/2.5 - size(val)*1.5}
                stroke="black"
                stroke-dasharray="2.2">
        </line>
        <text x={width/7 - xCircle + xLabel + 5}
              y={height/2.5 - size(val)*1.5 + 1}
              font-size="9px" alignment-baseline="middle">
          {val} victims
        </text>
      {/each}
      {/if}
 
      <text class="mapLegendCrop" x={width/2 - width/10}
            y={height - 2}>
        Map projection: <a target="_blank" href="https://www.tandfonline.com/doi/abs/10.1559/152304086783899908">Miller Oblated Stereographic</a>
      </text>
    </g>
    <g>
      <circle class="{selected()} medRegion"
              cx={width/7 - xCircle - 20}
              cy="9"
              r="5"></circle>
      <circle class="{selected()} otherRegions"
              cx={width/7 - xCircle - 20}
              cy="26"
              r="5"></circle>
      <text class="legend"
            x={width/7 - xCircle - 10} y="13">
        Incidents in the Mediterranean Sea</text>
      <text class="legend"
            x={width/7 - xCircle - 10} y="30">
        Other incidents</text>
    </g>
  </svg>
  {/if}
</div>

<style>
  .mapcropped {
    min-width: 350px;
    max-width: 900px;
  }

  .mapcropped .legend {
    text-anchor: "start";
    font-size: 10px;
    fill: var(--color-stone-800);
  }

  .mapcropped circle.missingOrDeceased.medRegion {
    fill: var(--color-red-800);
    opacity: 0.4;
    stroke: var(--color-red-950);
    stroke-width: 2;
  }

  .mapcropped circle.missingOrDeceased.otherRegions {
    fill: var(--color-red-400);
    opacity: 0.3;
    stroke: var(--color-red-700);
    stroke-width: 2;
  }

  .mapcropped circle.deceased.medRegion {
    fill: var(--color-stone-700);
    opacity: 0.4;
    stroke: var(--color-stone-900);
    stroke-width: 2;
  }
  .mapcropped circle.deceased.otherRegions {
    fill: var(--color-stone-400);
    opacity: 0.5;
    stroke: var(--color-stone-500);
    stroke-width: 2;
  }

  circle.legendValCrop {
    opacity: 0.3;
    fill: var(--color-stone-200);
    stroke: var(--color-stone-700) !important;
  }

  .mapLegendCrop {
    fill: var(--color-stone-900);
    text-anchor: "end";
    font-size: 8px;
  }

</style>

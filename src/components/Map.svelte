<script>
  import { geoPath, geoEqualEarth } from 'd3-geo';
  import { feature, mesh } from 'topojson-client';
  import { extent } from 'd3-array';
  import { scaleSqrt } from 'd3-scale';
  import { getContext } from 'svelte';
  import countries from './countries-50m.json';

  let { data = $bindable() } = $props();
  const selected = getContext('selected');

  let width = $state();
  let height = $derived(width/1.7);
  let margin = { top: 10, left: 10, right: 10, bottom: 40 };

  const land = feature(countries, countries.objects.land);
  const countrymesh = mesh(countries, countries.objects.countries, (a, b) => a !== b);
  let projection = $derived(geoEqualEarth()
                            .fitSize([width, height], feature(countries, countries.objects.land))
                            .center([0,20]) // GPS of location to zoom on
                            //.scale(130));     // This is like the zoom
                            .translate([ width/2 - width/15, height/2 - width/10]));
  let path = $derived(geoPath(projection));
  const valueExtent = extent(data, d => +d.victims)
  const size = scaleSqrt()
        .domain(valueExtent)  // What's in the data
  .range([1, 30])  // Size in pixel

  const legendValues = [10, 100, 500, 1000];
  const xCircle = 50;
  const xLabel = 100;
</script>

<div class="map flex-1 w-2/3" bind:clientWidth={width}>
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
        <circle class="{selected()}"
                cx={projection([+d.coordinates[1], +d.coordinates[0]])[0]}
                cy={projection([+d.coordinates[1], +d.coordinates[0]])[1]}
                r={size(+d.victims)}>
          <title>
            {d.date}
{d.country}
{d.incident}
{d.victims} {d.victims > 1 ? " victims" : " victim"}
          </title>
        </circle>
      {/each}

      {#each legendValues as val}
        <circle class="legendVal {selected()}"
                cx={xCircle}
                cy={height/1.2 - size(val)}
                r={size(val)}>
        </circle>
      {/each}

      {#each legendValues as val}
        <line   x1={xCircle + size(val)} y1={height/1.2 - size(val)*1.5}
                x2={xLabel} y2={height/1.2 - size(val)*1.5}
                stroke="black"
                stroke-dasharray="2.2">
        </line>
        <text x={xLabel + 5}
              y={height/1.2 - size(val)*1.5 + 1}
              font-size="9px" alignment-baseline="middle">
          {val} victims
        </text>
      {/each}

      <text class="mapLegend" x={width/2 - width/10}
            y={height - margin.top - width/25}>
        Map projection: <a target="_blank" href="https://en.wikipedia.org/wiki/Equal_Earth_projection">Equal Earth</a>
      </text>
    </g>
  </svg>
  {/if}
</div>

<style>
  .map {
    min-width: 350px;
    max-width: 950px;
  }

  circle.legendVal.missingOrDeceased {
    fill: var(--color-red-900);
    stroke: var(--color-red-400);
    stroke-width: 1;
    opacity: .2;
  }

  circle.legendVal.deceased {
    fill: var(--color-stone-800);
    stroke: var(--color-stone-500);
    stroke-width: 1;
    opacity: .2;
  }

  .mapLegend {
    fill: var(--color-stone-600);
    text-anchor: "end";
    font-size: 8px;
  }

  circle.missingOrDeceased {
    fill: var(--color-red-900);
    stroke: var(--color-red-400);
    stroke-width: 1;
    opacity: .2;
  }

  circle.deceased {
    fill: var(--color-stone-800);
    stroke: var(--color-stone-500);
    stroke-width: 1;
    opacity: .2;
  }
</style>

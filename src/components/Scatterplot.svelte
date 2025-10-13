<script>
  import { scaleLinear } from 'd3-scale';
  import { extent, nice } from 'd3-array';
  import { format } from 'd3-format';
  import { getContext } from 'svelte';

  let { data = $bindable() } = $props();
  const selected = getContext('selected');
  const yTicks = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000];
  const margin = { top: 10, right: 15, bottom: 10, left: 35 };
  const f = format(",d");

  let width = $state();
  let height = 450;
  let innerWidth = $derived(width - margin.left - margin.right);
  let catWidth = $derived(innerWidth / data.length);

  let regions = Array.from(new Set(data.map(d => d.region)));

  let years = Array.from(new Set(data.map(d => d.year)));

  let xScale = $derived(
    scaleLinear()
      .domain(extent(data, d => d.year)).nice()
      .range([margin.left, innerWidth + margin.left])
  );
  
  let values = $state(data.map(d => d.victims));

  let yScale = $derived(
    scaleLinear()
      .domain([0, Math.max(...values)])
      .range([height - margin.bottom - margin.top, margin.top])
  );

  // Shorten the date axis values for mobile
  function formatMobile(tick) {
    return "'" + tick.toString().slice(-2);
  }
</script>

<div class="scatterplot flex-1 w-1/3" bind:clientWidth={width}>
  <svg {width} {height}>
    <!-- Y axis -->
    <g class="axis y-axis">
      {#each yTicks as tick}
        <g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
          <line x2="100%" />
          <text y="-4" class="fill-slate-400"
            >{f(tick)}</text>
        </g>
      {/each}
    </g>
    <!-- X axis -->
    <g class="axis x-axis">
      {#each years as year}
        <g class="tick" transform="translate({xScale(year)}, {height + margin.top})">
          <text x={catWidth / 2} y="-10">
            {innerWidth > 380 ? year : formatMobile(year)}
          </text>
        </g>
      {/each}
    </g>
    <!-- data points -->
    <g>
      {#each data as d}
        <circle
          class="dot {selected()} {d.region === 'Mediterranean' ? 'medRegion' : 'otherRegions'}"
          cx={xScale(d.year)}
          cy={yScale(d.victims)}
          fill="none"
          stroke-width="3"
          stroke-opacity="0.7"
          r="4">
          <title>{d.year}
          {f(d.victims)} victims in {d.region}</title>
        </circle>
      {/each}
    </g>
    <g>
      <rect class="plotLegend"
            x={width/1.6 - 25}
            y="35"
            width={width/3 + 30}
            height={height/10 + 5}></rect>
      <circle class="dot {selected()} medRegion"
              cx={width/1.6 - 10}
              cy="50"
              fill="none"
              stroke-width="3"
              stroke-opacity="0.7"
              r="4"></circle>
      <circle class="dot {selected()} otherRegions"
              cx={width/1.6 - 10}
              cy="70"
              fill="none"
              stroke-width="3"
              stroke-opacity="0.7"
              r="4"></circle>
      <text class="legend"
            x={width/1.6} y="55">
        Crossing the Mediterranean Sea</text>
      <text class="legend"
            x={width/1.6} y="75">
        On other migration routes</text>
    </g>
  </svg>
</div>

<style>
  .plotLegend {
    fill: var(--color-stone-200);
    fill-opacity: 0.5;
  }

  .legend {
    text-anchor: "start";
    font-size: 11px;
    fill: var(--color-stone-600);
  }

  .scatterplot {
    min-width: 300px;
    max-width: 500px;
  }

  .dot.missingOrDeceased.medRegion {
    stroke: var(--color-red-950);
  }
  .dot.missingOrDeceased.otherRegions {
    stroke: var(--color-red-700);
  }

  .dot.deceased.medRegion {
    stroke: var(--color-stone-900);
  }
  .dot.deceased.otherRegions {
    stroke: var(--color-stone-500);
  }
  
  .x-axis .tick text {
    text-anchor: middle;
    color: --color-slate-800;
  }

  .tick {
    font-family: Poppins, sans-serif;
    font-size: 0.725em;
    font-weight: 200;
    color: --color-slate-800;
  }

  .y-axis .tick text {
    text-anchor: start;
  }

  .tick line {
    stroke: white;
    stroke-dasharray: 2;
    opacity: 1;
  }

  .tick.tick-0 line {
    display: inline-block;
    stroke-dasharray: 0;
  }
</style>

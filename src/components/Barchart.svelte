<script>
  import { scaleLinear } from 'd3-scale';
  import { format } from 'd3-format';
  // 1. Basic Setup: Get the data
  let { data } = $props();


  // 2. Dimensions, Margins & Scales

  // Data for plotting x-y axis
  const yTicks = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000];
  const padding = { top: 30, right: 15, bottom: 20, left: 35 };
  const f = format(",d");

  let width = $state(500);
  let height = $state(300);

  let xScale = $derived(
    scaleLinear()
      .domain([0, data.length])
      .range([padding.left, width - padding.right])
  );
  
  let values = data.map(d => d.victims);

  let yScale = scaleLinear()
    .domain([0, Math.max(...values)])
    .range([height - padding.bottom, padding.top]);

  let innerWidth = $derived(width - (padding.left + padding.right));
  let barWidth = $derived(innerWidth / data.length);

  // 3. Functions needed to create the Data elements or Helper functions, e.g d3.line d3.arc when needed

  // Shorten the date axis values for mobile
  function formatMobile(tick) {
    return "'" + tick.toString().slice(-2);
  }

  // 4. Create the main data elements (usually by iteration, using svelte each blocks)
  // We will do this in the html markup
</script>

<div class="barchart" 
     bind:clientWidth={width}
     bind:clientHeight={height}>
  <svg width={width} height={height}>
    
    <!-- Design y axis -->
    <g class="axis y-axis">
      {#each yTicks as tick}
        <g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
          <line x2="100%" />
          <text y="-4" class="fill-slate-400"
            >{f(tick)}</text>
        </g>
      {/each}
    </g>

    <!-- Design x axis -->
    <g class="axis x-axis">
      {#each data as d, i}
        <g class="tick" transform="translate({xScale(i)}, {height})">
          <text x={barWidth / 2} y="-4">
            {width > 380 ? d.year : formatMobile(d.year)}</text>
        </g>
      {/each}
    </g>

    <!-- 4. Design the bars -->
    <g class="bars">
      {#each data as d, i}
        <rect
          x={xScale(i) + 2}
          y={yScale(d.victims)}
          width={barWidth * 0.9}
          height={yScale(0) - yScale(d.victims)}>
          <title>{f(d.victims)} victims in {d.year}</title> 
         </rect>
      {/each}
    </g>
  </svg>
</div>

<style>
  
  .x-axis .tick text {
    text-anchor: middle;
    color: --color-slate-800;
  }

  .bars rect {
    fill: #8B2323;
    stroke: none;
    opacity: .8;
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

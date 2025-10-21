<script>
  /** @type {import('./$types').PageProps} */
  let { data } = $props();
  import Title from '../components/Title.svelte';
  import Barchart from '../components/Barchart.svelte';
  import Map from '../components/Map.svelte';
  import MapCrop from '../components/MapCrop.svelte';
  import Scatterplot from '../components/Scatterplot.svelte';
  import { format } from 'd3-format';
  import { setContext } from 'svelte';
  import { Container, Em, Scroller, ScrollerSection } from "@onsvisual/svelte-components";


  const scrollerColors = ["#ddd", "#777", "#222"];
  let scrollerColor = scrollerColors[0];

  let selected = $state("missingOrDeceased");
  setContext('selected', () => selected);

  let [dataForChart, dataForMap, dataForScatterplot] = data.iom.content;

  let chartData = $derived(dataForChart.map(d => new Object({
    year: d.year,
    victims: d[selected]
  })));
  let mapData = $derived(dataForMap.map(d => new Object({
    victims: d[selected],
    ...d
  })));
  let medRegions = ['Europe', 'Mediterranean', 'Northern Africa',
                    'Western Africa', 'Western Asia' ];
  let mapMed = $derived(mapData.filter(d => medRegions.includes(d.region)));
  let plotData = $derived(dataForScatterplot.map(d => new Object({
    victims: d[selected],
    ...d
  })));

  let totalVictims = $derived(chartData.reduce(
    (acc, curr) => acc + curr.victims, 0,
  ));
  let formattedTotal = $derived(format(",")(totalVictims));
  let { updated, source, link} = $state(data.iom.metadata);

  const options = ["missingOrDeceased", "deceased"];

</script>

<div class="@container">
  <Title bind:total={formattedTotal}
         updated={updated} source={source} link={link}
    />

  <Scroller
			id="scroller"
			splitscreen
			on:change={(e) => {
				scrollerColor = scrollerColors[e.detail.index];
				console.debug("change", e);
			}}
			on:enter={(e) => console.debug("enter", e)}
			on:exit={(e) => console.debug("exit", e)}
		>
			<div slot="background">
				<Container width="full" height="full" background={scrollerColor} />
			</div>
			<div slot="foreground">
				<ScrollerSection>
					<p>
						When this first caption is visible, the background will appear <Em
							color={scrollerColors[0]}>light grey</Em
						>.
					</p>
				</ScrollerSection>
				<ScrollerSection>
					<p>
						When this section caption is visible, the background will appear <Em
							color={scrollerColors[1]}>dark grey</Em
						>.
					</p>
				</ScrollerSection>
				<ScrollerSection>
					<p>
						When this third caption is visible, the background will appear <Em
							color={scrollerColors[2]}>black</Em
						>.
					</p>
				</ScrollerSection>
			</div>
		</Scroller>

  <div class="selector bg-slate-400/40 flex p-6">
    {#each options as option}
      <input style="margin-right:7px;"
             type="button" id="{option}"
             class="text-xs p-1 rounded-sm {option}"
             onclick="{() => (selected = option) }"
             disabled="{selected === option}"
             value="{option === 'deceased' ? 'People deceased' 
              : 'People missing or deceased'}"
      />
    {/each}
  </div>
  <div class="flex flex-wrap justify-around gap-4 p-6 bg-slate-400/40">
      <Barchart bind:data={chartData} />
      <Map bind:data={mapData} />
      <Scatterplot bind:data={plotData} />
      <MapCrop bind:data={mapMed} />
  </div>
</div>

<style>
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }

  .selector {
    width: 100%;
    height: 80px;
    font-size: 20px;
   }

    input.missingOrDeceased {
      background-color: var(--color-red-800);
      border: 2px solid var(--color-red-900);
      opacity: 0.8;
    }

    input.deceased {
      background-color: var(--color-stone-700);
      border: 2px solid var(--color-stone-800);
      opacity: 0.8;
    }

    input.missingOrDeceased:hover {
      background-color: var(--color-red-800);
      opacity: 1;
      color: white;
      cursor: pointer;
    }

    input.deceased:hover {
      background-color: var(--color-stone-700);
      opacity: 1;
      color: white;
      cursor: pointer;
    }

    input.missingOrDeceased:disabled {
      background-color: var(--color-red-900);
      opacity: 0.4;
      color: var(--color-stone-600);
    }

    input.missingOrDeceased:disabled:hover {
      background-color: var(--color-red-900);
      opacity: 0.5;
      color: var(--color-stone-600);
      cursor: default;
    }

    input.deceased:disabled {
      background-color: var(--color-stone-800);
      opacity: 0.4;
      color: var(--color-stone-600);
    }

    input.deceased:disabled:hover {
      background-color: var(--color-stone-800);
      opacity: 0.5;
      color: var(--color-stone-600);
      cursor: default;
    }
 
</style>

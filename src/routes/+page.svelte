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
  import { Container, Scroller, ScrollerSection } from "@onsvisual/svelte-components";


  let selected = $state("missingOrDeceased");
  setContext('selected', () => selected);

  let [dataForChart, dataForMap, dataForScatterplot] = data.iom.content;

  let chartData1 = $derived(dataForChart.map(d => new Object({
    year: d.year,
    victims: d["missingOrDeceased"]
  })));
  let chartData2 = $derived(dataForChart.map(d => new Object({
    year: d.year,
    victims: d["deceased"]
  })));
  
  let mapData1 = $derived(dataForMap.map(d => new Object({
    victims: d["missingOrDeceased"],
    ...d
  })));
  let mapData2 = $derived(dataForMap.map(d => new Object({
    victims: d["deceased"],
    ...d
  })));

  let medRegions = ['Europe', 'Mediterranean', 'Northern Africa',
                    'Western Africa', 'Western Asia'];
  let mapMed1 = $derived(mapData1.filter(d => medRegions.includes(d.region)));
  let mapMed2 = $derived(mapData2.filter(d => medRegions.includes(d.region)));
  let plotData = $derived(dataForScatterplot.map(d => new Object({
    victims: d[selected],
    ...d
  })));

  let totalVictims1 = chartData1.reduce(
    (acc, curr) => acc + curr.victims, 0,
  );
  let formattedTotal1 = $derived(format(",")(totalVictims1));
  let totalVictims2 = chartData2.reduce(
    (acc, curr) => acc + curr.victims, 0,
  );
  let formattedTotal2 = $derived(format(",")(totalVictims2));


  let { updated, source, link} = $state(data.iom.metadata);

  const options = ["missingOrDeceased", "deceased"];

</script>

<div class="@container">
  <Title updated={updated} source={source} link={link}/>

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
      <Container width="full" height="" background="var(--color-gray-100)">
        <Map bind:data={mapData1} selected={options[0]} />
      </Container>
    </div>
    <div slot="foreground">
      <ScrollerSection class="pl-2"> 
        <h2 class="text-2xl font-bold text-slate-800/90">
          According to the records of the International Organization for Migration (IOM),
          <span class={options[0]}>{formattedTotal1}</span> 
          people fell victim to a critical incident on their migration routes since 2014.
        </h2>
      </ScrollerSection>
      <ScrollerSection>
        <Barchart bind:data={chartData1}
                  selected={options[0]} />
      </ScrollerSection>
    </div>
  </Scroller>

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
      <Container width="full" height="" background="var(--color-gray-100)">
        <Map bind:data={mapData2} selected={options[1]} />
      </Container>
    </div>
    <div slot="foreground">
      <ScrollerSection class="pl-2"> 
        <h2 class="text-2xl font-bold text-slate-800/90">
          The same IOM dataset reveals that
          <span class={options[1]}>{formattedTotal2}</span> 
          people died on their migration routes since 2014.
        </h2>
      </ScrollerSection>
      <ScrollerSection>
        <Barchart bind:data={chartData2}
                  selected={options[1]} />
      </ScrollerSection>
    </div>
  </Scroller>

<Container width="full" height="" background="var(--color-gray-100)">
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
      <Scatterplot bind:data={plotData} />
  </div>
</Container>
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
      <Container width="full" height="" background="var(--color-gray-100)">
        <MapCrop bind:data={mapMed1} />
      </Container>
    </div>
    <div slot="foreground">
      <ScrollerSection class="pl-2"> 
        <h2 class="text-2xl font-bold text-slate-800/90">
          <span class={options[0]}> X % </span> of the people
          who died or went missing since 2014 did so in the Mediterranean Sea.
        </h2>
      </ScrollerSection>
    </div>
  </Scroller>

</div>

<style>
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }

  span.missingOrDeceased {
    background-color: var(--color-red-800);
    opacity: 0.8;
    color: white;
  }
 span.deceased {
    background-color: var(--color-stone-700);
    opacity: 0.9;
    color: white;
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

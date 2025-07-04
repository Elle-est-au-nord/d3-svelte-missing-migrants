<script>
  /** @type {import('./$types').PageProps} */
  import Barchart from '../components/Barchart.svelte';
  import { format } from 'd3-format';


  let { data } = $props();
  let points = $state(data.iom.content);
  let totalVictims = points.reduce(
    (acc, curr) => acc + curr.victims, 0,
  );
  let formattedTotal = format(",")(totalVictims)
  let { updated, source, link} = $state(data.iom.metadata)

</script>

<div class="@container">
  <div class="flex flex-col gap-2 p-8">
    <h1 class="text-3xl font-semibold underline text-slate-700/80">
      Visualizing Missing Migrants
    </h1>
    <h4 class="text-slate-700/80">Project by <a class="text-sky-700/90 hover:text-green-700/80" href="https://elle-est-au-nord.com/" target="_blank">Eleonore M.</a> © 2025</h4>
    <p class="text-xs text-slate-700/80">Data source: <span class="text-sky-700/90"><a href="{link}" target="_blank">{source}</a></span>, data updated in {updated}</p>
  </div>
  <div class="flex flex-col md:flex-row p-6 pb-0 bg-slate-400/40">
    <h2 class="text-2xl font-bold text-slate-800/90">According to IOM's records, <span class="text-rose-900/90">{formattedTotal}</span> people have died or gone missing on their migration routes</h2>
  </div>
    <div class="flex gap-6 p-6 md:flex-row bg-slate-400/40">
      <Barchart data={points} />
    </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>

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

</script>

<div class="@container">
  <div class="flex flex-col gap-2 p-8 md:flex-row">
    <h1 class="text-3xl font-semibold underline text-slate-700/80">
      Visualizing Missing Migrants
    </h1>
  </div>
  <div class="flex flex-col md:flex-row p-6 pb-0 bg-slate-400/40">
    <h2 class="text-2xl font-bold text-slate-800/90">According to IOM's records, {formattedTotal} people have died or gone missing on their migration routes</h2>
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

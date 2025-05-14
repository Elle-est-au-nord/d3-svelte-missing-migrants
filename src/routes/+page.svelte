<script>
  import Barchart from '../components/Barchart.svelte';

  let points = $state([
    { year: 2014, victims: 5441 },
    { year: 2015, victims: 6957 },
    { year: 2016, victims: 8099 },
    { year: 2017, victims: 6293 },
    { year: 2018, victims: 5016 },
    { year: 2019, victims: 5430 },
    { year: 2020, victims: 4330 },
    { year: 2021, victims: 6276 },
    { year: 2022, victims: 7205 },
    { year: 2023, victims: 8746 },
    { year: 2024, victims: 8279 },
    { year: 2025, victims: 432 }
  ]);
</script>

<div class="@container">
  <div class="flex flex-col gap-2 p-8 md:flex-row">
    <h1 class="text-3xl font-semibold underline text-slate-700/80">
      Visualizing Missing Migrants
    </h1>
  </div>
  <div class="flex flex-col md:flex-row p-6 pb-0 bg-slate-400/40">
    <h2 class="text-2xl font-bold text-slate-800/90">Over 72 thousands people have died or gone missing on their migration route</h2>
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

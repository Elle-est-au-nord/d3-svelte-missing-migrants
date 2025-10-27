<script>
  import { getContext } from 'svelte';


  let { 
    total = $bindable(), updated, source, link 
  } = $props();

  const selected = getContext('selected');

</script>

<div class="flex flex-col gap-2 p-8">
    <h1 class="text-3xl font-semibold underline text-slate-700/80">
      Visualizing Missing Migrants
    </h1>
    <h4 class="text-slate-700/80">Project by <a class="text-sky-700/90 hover:text-green-700/80" href="https://elle-est-au-nord.com/" target="_blank">Eleonore M.</a> © 2025</h4>
    <p class="text-xs text-slate-700/80">Data source: the International Organization for Migration (<span class="text-sky-700/90"><a href="{link}" target="_blank">{source}</a></span>), data updated in {updated}</p>
  </div>
<!--<div class="bg-slate-400/40 flex flex-col md:flex-row p-6 pb-0">
  <h2 class="text-2xl font-bold text-slate-800/90">
      According to IOM's records, 
      <span class={selected()}>
        {total}
      </span> 
      {selected() === 'deceased' ? "people have died"
      : "people have died or gone missing"} on their migration routes
  </h2>
</div>-->

<style>
  .missingOrDeceased {
    background-color: var(--color-red-800);
    opacity: 0.8;
    color: white;
  }
 .deceased {
    background-color: var(--color-stone-700);
    opacity: 0.9;
    color: white;
 }
 </style>

<script>
  let { 
    total = $bindable(), updated, source, link 
  } = $props();

</script>

<div class="flex flex-col gap-2 p-8">
    <h1 class="text-3xl font-semibold underline text-slate-700/80">
      Visualizing Missing Migrants
    </h1>
    <h4 class="text-slate-700/80">Project by <a class="text-sky-700/90 hover:text-green-700/80" href="https://elle-est-au-nord.com/" target="_blank">Eleonore M.</a> © 2025</h4>
    <p class="text-xs text-slate-700/80">Data source: the International Organization for Migration (<span class="text-sky-700/90"><a href="{link}" target="_blank">{source}</a></span>), data updated in {updated}</p>
  </div>

<style>

 </style>

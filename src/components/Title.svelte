<script>
  let { 
    total = $bindable(), updated, source, link 
  } = $props();

</script>

<div class="grid grid-cols-6 gap-1 flex flex-wrap text-center p-6">
    <h1 class="col-span-2 col-start-3 text-3xl font-semibold underline text-slate-700/80">
      Visualizing Missing Migrants
    </h1>
    <h4 class="col-span-2 col-start-3 text-slate-700/80">Project by <a class="text-sky-700/90 hover:text-green-700/80" href="https://elle-est-au-nord.com/" target="_blank">Eleonore M.</a> © 2025</h4>
    <p class="col-span-2 col-start-3 text-xs text-slate-700/80">Data source: the International Organization for Migration (<span class="text-sky-700/90"><a href="{link}" target="_blank">{source}</a></span>), data updated in {updated}</p>
    <h5 class="col-span-2 col-start-3 blink-text text-slate-700/80">scroll ↓ to find out more</h5>
  </div>

<style>
  .blink-text {
    animation: blinker 5s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

 </style>

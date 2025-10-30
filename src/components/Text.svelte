<script>
  let { number, percentage } = $props();

</script>

<div class="flex flex-col gap-1 px-8 py-6">
    <p class="text-xl text-slate-800/90">
      <span class="hl-victims3">{number} people</span> or
            <span class="hl-victims3">{percentage}% 
            </span> of all people who died or went missing since 2014 did so in the Mediterranean Sea.
    </p>
</div>

<style>
  span.hl-victims3 {
    background-color: var(--color-red-900);
    opacity: 0.9;
    color: white;
  }

 </style>

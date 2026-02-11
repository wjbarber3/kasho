<template>
  <div class="w-screen h-auto bg-slate-100 flex items-center justify-center">
    <the-hero />
  </div>
  
  <!-- Timeline -->
  <div class="w-screen h-auto bg-slate-100 flex items-center justify-center py-24">
    <the-timeline />
  </div>

  <div id="d3" class="py-28 bg-stone-900">
    <warming-chart />
  </div>

  <div class="py-28 bg-slate-100">
    <insurance-timeline />
  </div>

  <div id="contact" class="w-screen h-screen bg-slate-100 flex items-center justify-center">
    <!-- <contact-form /> -->
  </div>
</template>

<script setup></script>
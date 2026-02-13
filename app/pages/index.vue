<template>
  <div class="w-screen h-auto bg-slate-100 flex items-center justify-center">
    <the-hero />
  </div>
  
  <!-- Timeline -->
  <div class="w-screen h-auto bg-slate-100 flex items-center justify-center pb-24 pt-10">
    <the-timeline />
  </div>

  <div class="w-screen h-auto bg-slate-100 flex items-center justify-center pb-24 pt-10">
    <d3-intro />
  </div>

  <div class="py-28 bg-stone-900">
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
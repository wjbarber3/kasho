<template>
  <div class="max-w-3xl grid md:grid-cols-2 w-full items-center pt-16 md:pt-10">
    <img src="/images/hero2.png" class="w-[90%] hidden md:block" />
    <div class="flex items-center justify-center px-6">
      <div class="max-w-3xl w-full">
        
        <!-- Intro -->
        <div class="text-sm tracking-widest text-gray-500 uppercase mb-4 flex items-center gap-x-3">
          <div class="w-4 h-0.5 bg-slate-500"></div>
          <p>Hey there. I'm a <span class="bg-sky-100 px-1">Senior</span></p>
        </div>

        <!-- Main Heading -->
        <h1 class="text-xl md:text-4xl font-bold font-serif text-gray-800 tracking-tight mb-6">
          Frontend Engineer
        </h1>

        <!-- Supporting Text -->
        <p class="text-lg text-gray-600 leading-relaxed">
          I <span class="bg-violet-200 px-1">design and scale frontend systems</span> that help teams move faster and products perform better.
          I specialize in architecture, design systems, and performance-driven user experiences.
        </p>

        <div class="flex items-center gap-x-8 mt-6">
          <NuxtLink to="#resume">
            <Button class="bg-amber-300! text-slate-950! border-amber-300!">
              <i class="pi pi-arrow-down text-slate-950"></i>
              Work History
            </Button>
          </NuxtLink>
          <p>
            <NuxtLink to="#contact" class="text-emerald-500 underline font-bold">Get in touch</NuxtLink>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>

import Button from 'primevue/button'

</script>
<template>
  <div class="w-screen h-auto bg-slate-100 flex items-center justify-center">
    <the-hero />
  </div>
  
  <div id="resume" class="w-screen h-auto bg-slate-100 flex items-center justify-center pb-16 md:pb-24 pt-10">
    <the-timeline />
  </div>

  <div id="contact" class="w-screen h-aut bg-slate-100 flex items-center justify-center pt-4 pb-16 md:pb-40">
    <contact-form />
  </div>

  <div id="d3" class="w-screen h-auto bg-teal-500 flex items-center justify-center py-16 md:py-24 relative overflow-hidden">
    <d3-intro />
    <div class="hidden sm:block w-[400px] h-[200px] absolute bottom-0 -right-52 
            bg-linear-to-r from-teal-500 to-teal-100
            [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)]">
    </div>
    <div class="hidden sm:block w-[400px] h-[200px] absolute -top-2 -left-52 
            bg-linear-to-r from-teal-500 to-teal-100
            [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)] rotate-180">
    </div>
    <div class="hidden lg:block w-[40px] h-[20px] absolute bottom-0 right-[520px] bg-linear-to-r from-teal-500 to-teal-400"></div>
    <div class="hidden lg:block w-[40px] h-[40px] absolute bottom-0 right-[480px] bg-linear-to-r from-teal-500 to-teal-400"></div>
    <div class="hidden lg:block w-[40px] h-[60px] absolute bottom-0 right-[440px] bg-linear-to-r from-teal-500 to-teal-400"></div>
    <div class="hidden lg:block w-[40px] h-[80px] absolute bottom-0 right-[400px] bg-linear-to-r from-teal-500 to-teal-400"></div>
    <div class="hidden lg:block w-[40px] h-[100px] absolute bottom-0 right-[360px] bg-linear-to-r from-teal-500 to-teal-400"></div>
    <div class="hidden lg:block w-[40px] h-[120px] absolute bottom-0 right-[320px] bg-linear-to-r from-teal-500 to-teal-400"></div>
    <div class="hidden lg:block w-[40px] h-[140px] absolute bottom-0 right-[280px] bg-linear-to-r from-teal-500 to-teal-400"></div>
    <div class="hidden sm:block z-0 rounded-full bg-linear-to-r from-teal-300 to-teal-500 w-72 h-72 absolute -bottom-36 -left-24"></div>

  </div>

  <div class="py-16 md:py-28 bg-stone-900">
    <warming-chart />
  </div>

  <div class="py-16 md:py-28 bg-slate-100">
    <insurance-timeline />
  </div>

  <the-footer class="bg-white" />

</template>

<script setup></script>

<script setup>
  useHead({
    title: 'Jordan Barber | Portfolio',
    meta: [
      { name: 'description', content: 'Jordan Barber - Senior Frontend Engineer' }
    ]
  })
</script>
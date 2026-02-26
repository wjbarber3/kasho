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

    <!-- Bar Chart -->
    <div class="hidden lg:block w-[40px] h-[20px] absolute bottom-0 right-[520px] bg-linear-to-r from-teal-500 to-teal-400 animate-pulse duration-1000"></div>
    <div class="hidden lg:block w-[40px] h-[40px] absolute bottom-0 right-[480px] bg-linear-to-r from-teal-500 to-teal-400 animate-pulse duration-1000 delay-200"></div>
    <div class="hidden lg:block w-[40px] h-[60px] absolute bottom-0 right-[440px] bg-linear-to-r from-teal-500 to-teal-400 animate-pulse duration-1000 delay-400"></div>
    <div class="hidden lg:block w-[40px] h-[80px] absolute bottom-0 right-[400px] bg-linear-to-r from-teal-500 to-teal-400 animate-pulse duration-1000 delay-600"></div>
    <div class="hidden lg:block w-[40px] h-[100px] absolute bottom-0 right-[360px] bg-linear-to-r from-teal-500 to-teal-400 animate-pulse duration-1000 delay-800"></div>
    <div class="hidden lg:block w-[40px] h-[120px] absolute bottom-0 right-[320px] bg-linear-to-r from-teal-500 to-teal-400 animate-pulse duration-1000 delay-1000"></div>
    <div class="hidden lg:block w-[40px] h-[140px] absolute bottom-0 right-[280px] bg-linear-to-r from-teal-500 to-teal-400 animate-pulse duration-1000 delay-1000"></div>

    <!-- Scatter Plot Background -->
    <div class="hidden z-10 lg:block absolute bottom-[0px] left-[360px] w-[8px] h-[8px] rounded-full bg-teal-300 opacity-20 mix-blend-overlay animate-pulse duration-1200"></div>
    <div class="hidden z-10 lg:block absolute bottom-[50px] left-[420px] w-[12px] h-[12px] rounded-full bg-teal-200/70 blur-[1px] opacity-10 mix-blend-overlay animate-pulse duration-1400 delay-200"></div>
    <div class="hidden z-10 lg:block absolute bottom-[10px] left-[480px] w-[6px] h-[6px] rounded-full bg-teal-400 opacity-20 mix-blend-overlay animate-pulse duration-1000 delay-400"></div>
    <div class="hidden z-10 lg:block absolute bottom-[90px] left-[380px] w-[10px] h-[10px] rounded-full bg-teal-300/70 opacity-10 mix-blend-overlay animate-pulse duration-1300 delay-600"></div>
    <div class="hidden z-10 lg:block absolute bottom-[130px] left-[460px] w-[14px] h-[14px] rounded-full bg-gradient-to-r from-teal-400 to-teal-200 opacity-5 blur-[2px] mix-blend-overlay animate-pulse duration-1500 delay-800"></div>
    <div class="hidden z-10 lg:block absolute bottom-[70px] left-[540px] w-[7px] h-[7px] rounded-full bg-teal-200 opacity-10 blur-[2px] mix-blend-overlay animate-pulse duration-1200 delay-1000"></div>
    <div class="hidden z-10 lg:block absolute bottom-[0px] left-[520px] w-[9px] h-[9px] rounded-full bg-teal-300 opacity-15 mix-blend-overlay animate-pulse duration-1600 delay-1200"></div>
    <div class="hidden z-10 lg:block absolute bottom-[160px] left-[400px] w-[11px] h-[11px] rounded-full bg-teal-200/80 opacity-5 blur-[1px] mix-blend-overlay animate-pulse duration-1300 delay-1400"></div>
    <div class="hidden z-10 lg:block absolute bottom-[110px] left-[340px] w-[6px] h-[6px] rounded-full bg-teal-400 opacity-15 mix-blend-overlay animate-pulse duration-1100 delay-1600"></div>

    <!-- Circle -->
    <div class="hidden z-0 sm:block rounded-full bg-linear-to-r from-teal-300 to-teal-500 w-72 h-72 absolute pie-circle"></div>

  </div>

  <div class="py-16 md:py-28 bg-stone-900" id="global-warming-chart">
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

<style>
.pie-circle {
  left: -56px;
  bottom: -168px;
  transform: rotate(-36deg);
}
</style>
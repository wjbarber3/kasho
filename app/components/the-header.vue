<template>
  <div class="max-w-7xl z-10 flex items-center gap-4 w-full pt-4 sticky top-0 mx-auto text-nowrap">
    <nav class="w-full flex relative items-center">
      <div class="rounded px-4 py-2 w-full bg-white text-slate-900 flex items-center border border-slate-200 opacity-95">
        <div class="flex justify-between items-center w-full">
          <div class="flex justify-between items-center gap-x-8">
            <div class="flex items-center gap-x-4">
              <h1 class="font-bold text-xl">Jordan Barber</h1>
            </div>
            <div class="flex items-center gap-x-4">
              <a class="nav-item" href="https://www.linkedin.com/in/jrdnbrbr/" target="_blank">
                Linkedin
                <i class="pi pi-arrow-up-right"></i>
              </a>
            </div>
          </div>
          <div class="flex items-center gap-x-4">
            <div class="flex items-center gap-x-4">
              <NuxtLink to="#d3" class="nav-item">Data Visualization</NuxtLink>
              <NuxtLink to="#resume" class="nav-item">Résumé</NuxtLink>
              <NuxtLink to="#contact" class="nav-item">Contact</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
  import Button from 'primevue/button'
</script>

<style scoped>

h1 {
  font-family: 'Rethink Sans', sans-serif;
}

.nav-item {
  cursor: pointer;
  flex-flow: row;
  place-content: center flex-start;
  align-items: center;
  gap: 10px;
  width: min-content;
  height: min-content;
  padding: 6px 16px;
  text-decoration: none;
  display: flex;
  position: relative;
  overflow: visible;
  background-color: white;
  transition: all .2s ease-in-out;
}

.nav-item:hover {
  background-color: #F5F5F4;
  border-radius: 4px;
}

</style>
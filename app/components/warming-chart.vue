<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-y-8">
    <div class="flex justify-between flex-col items center w-full items-center gap-y-1 mb-8">
      <h1 class="text-3xl font-bold">Warming is Not Linear</h1>
      <p>Global temperature anomaly relative to 1951-1980 average.</p>
    </div>
    <svg class="mx-auto" ref="svg" :width="width" :height="height"></svg>
    <div class="flex item-center justify-center gap-x-4">
      <div class="flex items-center w-full gap-x-2 justify-center">
        <span>Show Context</span>
        <ToggleSwitch v-model="showAnnotations" />
      </div>
    </div>
  </div>
</template>

<script setup>

import * as d3 from 'd3'
import ToggleSwitch from 'primevue/toggleswitch';
import Button from 'primevue/button';

const svg = ref(null)
const showAnnotations = ref(true)
const isCelcius = ref(true)
const showBaseline = ref(true)
const contextButtonLabel = computed(() => {
  return showAnnotations.value ? 'Hide Context' : 'Show Context'
})

const filePath = computed(() => {
  return isCelcius.value ? '/data/global-temperature-anomaly-c.csv' : '/data/global-temperature-anomaly-c.csv'
})

const width = 800
const height = 400
const margin = { top: 20, right: 20, bottom: 50, left: 60 }

onMounted(async () => {
  const data = await d3.csv('/data/global-temperature-anomaly-c.csv', d => ({
    year: +d.year,
    anomaly: +d.anomaly
  }))

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const svgEl = d3.select(svg.value)

  const g = svgEl
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth])

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.anomaly))
    .range([innerHeight, 0])

  const parisX = x(2015)
  const cleanAirX = x(1970)
  const rapidX = x(1980)
  const kyotoX = x(1997)
  const ipccX = x(1988)
  const anthroX = x(1896)

  // handle the 1950 - 1981 baseline
  const baselineMin = 0.0  // bottom of band
  const baselineMax = 0.1
  const bandTop = y(baselineMax)
  const bandBottom = y(baselineMin)


  // 🔑 zero position in pixel space
  const zeroY = y(0)

  // ---------- GRADIENT ----------
  const defs = svgEl.append('defs')

  const gradient = defs.append('linearGradient')
    .attr('id', 'anomaly-gradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', innerHeight)
    .attr('y2', 0)

  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#23c2ed') // cooler past

  gradient.append('stop')
    .attr('offset', `${(zeroY / innerHeight) * 100}%`)
    .attr('stop-color', '#c9c9c9') // neutral at 0°C

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#ED4E23') // warming present
  // --------------------------------

  // line generator
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.anomaly))
    .curve(d3.curveLinear)

  const area = d3.area()
  .x(d => x(d.year))
  .y0(zeroY)
  .y1(d => y(d.anomaly))
  .curve(d3.curveLinear)

    const focus = g.append('circle')
  .attr('r', 4)
  .attr('fill', 'black')
  .attr('stroke', '#fff')
  .attr('stroke-width', 1.5)
  .style('opacity', 0)

  const overlay = g.append('rect')
  .attr('width', innerWidth)
  .attr('height', innerHeight)
  .attr('fill', 'transparent')
  .style('pointer-events', 'all')

  // draw area
  g.append('path')
  .datum(data)
  .attr('fill', 'url(#anomaly-gradient)')
  .attr('opacity', 0.35)
  .attr('d', area)
  .attr('pointer-events', 'none')

  g.select('path') // the area
  .attr('opacity', 0)
  .transition()
  .duration(800)
  .attr('opacity', 0.35)

  const bisectYear = d3.bisector(d => d.year).left

  overlay
  .on('mousemove', (event) => {
    const [mouseX] = d3.pointer(event)
    const year = Math.round(x.invert(mouseX))

    const index = bisectYear(data, year)
    const d = data[index]

    if (!d) return

    const cx = x(d.year)
    const cy = y(d.anomaly)

    // move focus dot
    focus
      .attr('cx', cx)
      .attr('cy', cy)
      .style('opacity', 1)

    // update tooltip
    tooltip
      .html(`
        <strong>${d.year}</strong><br/>
        ${d.anomaly.toFixed(2)}°C
      `)
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY - 28}px`)
      .style('opacity', 1)
  })
  .on('mouseleave', () => {
    focus.style('opacity', 0)
    tooltip.style('opacity', 0)
  })


  // draw line
  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'url(#anomaly-gradient)')
    .attr('stroke-width', 2)
    .attr('d', line)

  // 1950 - 81 baseline (horizontal)
  g.append('rect')
  .attr('class', 'baseline-band')
  .attr('x', 0)
  .attr('y', bandTop)
  .attr('width', innerWidth)
  .attr('height', bandBottom - bandTop)
  .attr('fill', '#c9c9c9')    // light neutral color
  .attr('opacity', 0.3)
  .style('pointer-events', 'none')

  g.select('.baseline-band')
  .attr('height', 0)
  .transition()
  .duration(600)
  .attr('height', bandBottom - bandTop)

  g.append('text')
  .attr('x', 10)
  .attr('y', bandTop + 15)
  .text('1951–1980 Average -->')
  .attr('fill', 'black')
  .attr('font-size', '12px')
  .attr('font-family', 'Geist')

  // ANNOTATIONS

  const annotationsGroup = g.append('g')
  .attr('class', 'annotations')

  // Paris
  const parisAnnotation = annotationsGroup.append('g')
  .attr('class', 'annotation paris')
  .attr('opacity', 0)

  parisAnnotation.append('line')
    .attr('x1', parisX)
    .attr('x2', parisX)
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#b0b0b0')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  parisAnnotation.append('text')
    .attr('x', parisX - 50)
    .attr('y', 20)
    .text('Paris Agreement')
    .attr('fill', '#c9c9c9')
    .attr('font-size', '12px')
    .attr('font-family', 'sans-serif')
    .attr('stroke', 'black')
    .attr('stroke-width', '4px')
    .attr('paint-order', 'stroke fill')
    .attr('stroke-linejoin', 'round')

  parisAnnotation
    .attr('transform', 'translate(0, 6)')
    .transition()
    .delay(200)
    .duration(600)
    .ease(d3.easeCubicOut)
    .attr('opacity', 1)
    .attr('transform', 'translate(0, 0)')
  
  // Rapid
  const rapidAnnotation = annotationsGroup.append('g')
    .attr('class', 'annotation rapid')
    .attr('opacity', 0)

  rapidAnnotation.append('line')
    .attr('x1', rapidX)
    .attr('x2', rapidX)
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#b0b0b0')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  rapidAnnotation.append('text')
    .attr('x', rapidX - 40)
    .attr('y', 50)
    .text('Rapid Acceleration')
    .attr('fill', '#c9c9c9')
    .attr('font-size', '12px')
    .attr('font-family', 'sans-serif')
    .attr('stroke', 'black')
    .attr('stroke-width', '4px')
    .attr('paint-order', 'stroke fill')
    .attr('stroke-linejoin', 'round')

  rapidAnnotation
    .transition()
    .delay(350) // nice stagger
    .duration(600)
    .ease(d3.easeCubicOut)
    .attr('opacity', 1)
  
  // Clean Air
  const cleanAirAnnotation = annotationsGroup.append('g')
    .attr('class', 'annotation clean-air')
    .attr('opacity', 0)

  cleanAirAnnotation.append('line')
    .attr('x1', cleanAirX)
    .attr('x2', cleanAirX)
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#b0b0b0')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  cleanAirAnnotation.append('text')
    .attr('x', cleanAirX - 34)
    .attr('y', 100)
    .text('Clean Air Act')
    .attr('fill', '#c9c9c9')
    .attr('font-size', '12px')
    .attr('font-family', 'sans-serif')
    .attr('stroke', 'black')
    .attr('stroke-width', '4px')
    .attr('paint-order', 'stroke fill')
    .attr('stroke-linejoin', 'round')

  cleanAirAnnotation
    .transition()
    .delay(500)
    .duration(600)
    .ease(d3.easeCubicOut)
    .attr('opacity', 1)

  const kyotoAnnotation = annotationsGroup.append('g')
    .attr('class', 'annotation kyoto')
    .attr('opacity', 0)

  kyotoAnnotation.append('line')
    .attr('x1', kyotoX)
    .attr('x2', kyotoX)
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#b0b0b0')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  kyotoAnnotation.append('text')
    .attr('x', kyotoX - 34)
    .attr('y', 80)
    .text('Kyoto Protocol')
    .attr('fill', '#c9c9c9')
    .attr('font-size', '12px')
    .attr('font-family', 'sans-serif')
    .attr('stroke', 'black')
    .attr('stroke-width', '4px')
    .attr('paint-order', 'stroke fill')
    .attr('stroke-linejoin', 'round')

  kyotoAnnotation
    .transition()
    .delay(500)
    .duration(600)
    .ease(d3.easeCubicOut)
    .attr('opacity', 1)

  const ipccAnnotation = annotationsGroup.append('g')
    .attr('class', 'annotation ipcc')
    .attr('opacity', 0)

  ipccAnnotation.append('line')
    .attr('x1', ipccX)
    .attr('x2', ipccX)
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#b0b0b0')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  ipccAnnotation.append('text')
    .attr('x', ipccX - 13)
    .attr('y', 120)
    .text('IPCC')
    .attr('fill', '#c9c9c9')
    .attr('font-size', '12px')
    .attr('font-family', 'sans-serif')
    .attr('stroke', 'black')
    .attr('stroke-width', '4px')
    .attr('paint-order', 'stroke fill')
    .attr('stroke-linejoin', 'round')

  ipccAnnotation
    .transition()
    .delay(500)
    .duration(600)
    .ease(d3.easeCubicOut)
    .attr('opacity', 1)

  const anthroAnnotation = annotationsGroup.append('g')
    .attr('class', 'annotation anthro')
    .attr('opacity', 0)

  ipccAnnotation.append('line')
    .attr('x1', anthroX)
    .attr('x2', anthroX)
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#b0b0b0')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  ipccAnnotation.append('text')
    .attr('x', anthroX - 63)
    .attr('y', 120)
    .text('Anthropogenic Warming')
    .attr('fill', '#c9c9c9')
    .attr('font-size', '12px')
    .attr('font-family', 'sans-serif')
    .attr('stroke', 'black')
    .attr('stroke-width', '4px')
    .attr('paint-order', 'stroke fill')
    .attr('stroke-linejoin', 'round')

  ipccAnnotation
    .transition()
    .delay(500)
    .duration(600)
    .ease(d3.easeCubicOut)
    .attr('opacity', 1)


  // axes (still here for now)
  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).ticks(12).tickFormat(d3.format('d')))
    .style('font-size', '10px')
    .style('color', '#666')

  g.append('g')
    .call(d3.axisLeft(y))
    .style('font-size', '10px')
    .style('color', '#666')

  const yAxisGroup = g.append('g')
  const yLabel = yAxisGroup.append('text')
    .attr('class', 'y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -margin.left + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '12px')
    .text('Degrees Celsius')
    .attr('letter-spacing', '.1em')
    .attr('font-weight', 400)
    .attr('font-family', 'Geist')

  const xAxisGroup = g.append('g')
  .attr('transform', `translate(0, ${innerHeight})`)

  const xLabel = xAxisGroup.append('text')
  .attr('class', 'x-axis-label')
  .attr('x', innerWidth / 2)
  .attr('y', margin.bottom - 10)
  .attr('text-anchor', 'middle')
  .attr('fill', '#666')
  .attr('font-size', '12px')
  .text('Year')
  .attr('letter-spacing', '.1em')
  .attr('font-weight', 400)
  .attr('font-family', 'Geist')
    

  const tooltip = d3.select('body')
  .append('div')
  .style('position', 'absolute')
  .style('pointer-events', 'none')
  .style('background', '#fff')
  .style('border', '1px solid #ddd')
  .style('padding', '6px 8px')
  .style('font-size', '12px')
  .style('color', '#333')
  .style('opacity', 0)
  })

watch(showAnnotations, (visible) => {
  d3.select('.annotations')
    .style('pointer-events', visible ? 'all' : 'none')
    .transition()
    .duration(300)
    .ease(d3.easeCubicInOut)
    .style('opacity', visible ? 1 : 0)
    .style('transform', visible ? 'translateY(0)' : 'translateY(4px)')
})

</script>

<style>
h1 {
  font-family: 'Rethink Sans', sans-serif;
}

p {
  font-family: 'Geist', sans-serif;
}
</style>
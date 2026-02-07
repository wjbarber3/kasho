<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-y-4 text-slate-100">
    <div class="flex justify-between flex-col items center w-full items-center gap-y-1 mb-8">
      <h1 class="text-4xl font-bold">Warming is Not Linear</h1>
      <p class="mb-2 italic">
        Global temperature anomaly relative to 1951-1980 average.
      </p>

      <Divider class="max-w-xl" />

      <p class="text-sm flex items-center gap-x-2">
        <i class="pi pi-sparkles text-yellow-200"></i>
        <span>Hover across the chart to see the temperature anomaly for a given year</span>
      </p>

      <p class="text-sm flex items-center gap-x-2">
        <i class="pi pi-sparkles text-yellow-200"></i>
        <span>Click each context title to learn more about the given event</span>
      </p>

      <p class="text-sm flex items-center gap-x-2">
        <i class="pi pi-sparkles text-yellow-200"></i>
        <span>You can also hover a context event to highlight its line relevant to the chart</span>
      </p>

    </div>

    <svg class="mx-auto" ref="svg" :width="width" :height="height"></svg>
    
    <div class="flex item-center justify-center gap-x-4">
      <div class="flex items-center w-full gap-x-2 justify-center">
        <span>Show Annotations</span>
        <ToggleSwitch v-model="showAnnotations" />
      </div>
    </div>
    <div class="flex items-center justify-center w-full gap-x-2 text-xs italic">
      <p>Data Sources:</p>
      <a class="underline text-primary" href="https://data.giss.nasa.gov/gistemp/" target="_blank">Nasa Gistemp</a>
      <span>|</span>
      <a class="underline text-primary" href="https://berkeleyearth.org/data/" target="_blank">Berkeley Earth</a>
    </div>

    <Dialog v-if="activeAnnotation" v-model:visible="activeAnnotation" modal :header="annotationDetails[activeAnnotation].title" :style="{ width: '25rem' }">
      <h3 class="mb-4 text-md italic font-[Rethink_Sans] text-primary">{{ annotationDetails[activeAnnotation].subtitle }}</h3>
      <p class="text-xs">{{ annotationDetails[activeAnnotation].description }}</p>
    </Dialog>
  </div>
</template>

<script setup>

import * as d3 from 'd3'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'

const svg = ref(null)
const showAnnotations = ref(true)
const isCelcius = ref(true)
const showBaseline = ref(true)
const activeAnnotation = ref(null)


const filePath = computed(() => {
  return isCelcius.value ? '/data/global-temperature-anomaly-c.csv' : '/data/global-temperature-anomaly-c.csv'
})

// Annotation Details
const annotationDetails = {
  paris: {
    title: 'Paris Agreement (2015)',
    subtitle: 'A global turning point — and a warning',
    description:
      'In 2015, nearly every country on Earth agreed to limit global warming to well below 2°C, with an aspirational target of 1.5°C above pre-industrial levels, marking the first time the world formally acknowledged the scale of the climate crisis and committed—at least on paper—to act together. Despite this milestone, global temperatures have continued to rise, and the 1.5°C threshold is no longer a distant goal but an imminent boundary that scientists warn may be crossed within the next decade. The Paris Agreement remains a critical framework, but the data shows that ambition has yet to translate into sufficient action.',
  },

  rapid: {
    title: 'Rapid Acceleration (Beginning Late 70s)',
    subtitle: 'When warming begins to steepen',
    description:
      'Beginning in the late 1970s, global temperature records show a marked increase in the rate of warming, signaling a shift from gradual change to sustained acceleration. This period aligns with rapid industrial growth, rising fossil fuel use, and increasing greenhouse gas concentrations in the atmosphere. The steeper trajectory seen in the data underscores how human activity began to dominate natural variability, setting the stage for the warming trends that define the modern climate era.',
  },

  cleanAir: {
    title: 'Clean Air Act (1970)',
    subtitle: 'Clearer skies, unintended consequences',
    description:
      'The U.S. Clean Air Act of 1970 dramatically reduced air pollutants such as sulfur dioxide and particulate matter, improving public health and visibility across much of the country. While these regulations were a major environmental success, they also reduced aerosol pollution that had been reflecting sunlight and slightly masking global warming. As cleaner air spread, the underlying warming effect of greenhouse gases became more apparent in temperature records.',
  },

  kyotoProtocol: {
    title: 'Kyoto Protocol (1997)',
    subtitle: 'The first binding climate treaty',
    description:
      'Adopted in 1997, the Kyoto Protocol marked the first international agreement to set legally binding greenhouse gas reduction targets for developed nations. While historically significant, its impact was limited by the absence of major emitters and uneven enforcement. The protocol highlighted both the possibility and the difficulty of coordinated global climate action, revealing the gap between political commitment and the scale of emissions reductions required.',
  },

  ipcc: {
    title: 'IPCC Established (1988)',
    subtitle: 'Science enters the global stage',
    description:
      'In 1988, the United Nations and the World Meteorological Organization established the Intergovernmental Panel on Climate Change to assess the growing body of climate science. The IPCC does not conduct research itself, but synthesizes thousands of studies to inform policymakers. Its assessment reports have become the authoritative scientific foundation for understanding climate change, its causes, and its projected impacts.',
  },

  anthro: {
    title: 'Anthropogenic Warming Proposed (1896)',
    subtitle: 'The idea predates the data',
    description:
      'In 1896, Swedish scientist Svante Arrhenius published the first quantitative calculations suggesting that carbon dioxide emissions from human activity could raise Earth’s global temperature. At the time, the idea was largely theoretical and far removed from observable climate impacts. More than a century later, Arrhenius’s early work stands as a remarkably prescient foundation for modern climate science, demonstrating that the core mechanism behind human-caused warming was understood long before its consequences became visible.',
  }
}

// Annotation Config
const annotationsConfig = [
  {
    key: 'anthro',
    year: 1896,
    label: 'Anthropogenic Warming',
    y: 120,
    dx: -63,
    delay: 200,
  },
  {
    key: 'cleanAir',
    year: 1970,
    label: 'Clean Air Act',
    y: 100,
    dx: -34,
    delay: 350,
  },
  {
    key: 'rapid',
    year: 1980,
    label: 'Rapid Acceleration',
    y: 50,
    dx: -40,
    delay: 500,
  },
  {
    key: 'ipcc',
    year: 1988,
    label: 'IPCC',
    y: 120,
    dx: -13,
    delay: 650,
  },
  {
    key: 'kyotoProtocol',
    year: 1997,
    label: 'Kyoto Protocol',
    y: 80,
    dx: -34,
    delay: 800,
  },
  {
    key: 'paris',
    year: 2015,
    label: 'Paris Agreement',
    y: 20,
    dx: -50,
    delay: 950,
  },
]


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

  function drawAnnotations({ g, x, innerHeight }) {
    const group = g.append('g')
      .attr('class', 'annotations')

    annotationsConfig.forEach((a) => {
      const xPos = x(a.year)

      const annotation = group.append('g')
        .attr('class', `annotation ${a.key}`)
        .attr('opacity', 0)
        .attr('transform', 'translate(0, 6)')

      // vertical line
      annotation.append('line')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#b0b0b0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')

      annotation.append('text')
        .attr('x', xPos + a.dx)
        .attr('y', a.y)
        .text(a.label)
        .attr('fill', '#c9c9c9')
        .attr('font-size', '13px')
        .attr('font-family', 'sans-serif')
        .attr('stroke', '#1B1917')
        .attr('stroke-width', '4px')
        .attr('paint-order', 'stroke fill')
        .attr('stroke-linejoin', 'round')
        .style('cursor', 'pointer')

  // 🔹 HOVER IN
  .on('mouseenter', () => {
    const d = getDataForYear(a.year)
    if (!d) return

    // highlight vertical line
    annotation.select('line')
      .transition()
      .duration(200)
      .attr('stroke', '#ED4E23')
      .attr('stroke-width', 1.5)

    // show dot
    highlightDot
      .attr('cx', x(d.year))
      .attr('cy', y(d.anomaly))
      .transition()
      .duration(200)
      .style('opacity', 1)
  })

  // 🔹 HOVER OUT
  .on('mouseleave', () => {
    annotation.select('line')
      .transition()
      .duration(200)
      .attr('stroke', '#b0b0b0')
      .attr('stroke-width', 1)

    highlightDot
      .transition()
      .duration(200)
      .style('opacity', 0)
  })

  // 🔹 CLICK
  .on('click', () => {
    activeAnnotation.value = a.key
  })

      // animation
      annotation
        .transition()
        .delay(a.delay)
        .duration(600)
        .ease(d3.easeCubicOut)
        .attr('opacity', 1)
        .attr('transform', 'translate(0, 0)')
      })
    }


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

  const highlightDot = g.append('circle')
    .attr('r', 5)
    .attr('fill', '#ED4E23')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .style('opacity', 0)
    .style('pointer-events', 'none')

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

  function getDataForYear(year) {
    const index = bisectYear(data, year)
    return data[index]
  }

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
        <div class="flex flex-col gap-y-2">
          <div class="flex items-center gap-x-2">
            <i class="pi pi-circle-fill text-green-900" style="font-size: .7rem"></i>
            <p class="font-semibold text-[Geist]">
              <span class="underline">Year:</span>
              ${d.year}
            </p>
          </div>
          <div class="flex items-center gap-x-2">
            <i class="pi pi-circle-fill text-red-900" style="font-size: .7rem"></i>
            <p class="font-semibold text-[Geist]">
              <span class="underline">Anomaly:</span>
              ${d.anomaly.toFixed(2)}° Celcius
            </p>
          </div>
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
  .text('1951–1980 Baseline -->')
  .attr('fill', '#fff')
  .attr('font-size', '12px')
  .attr('font-family', 'Geist')

  drawAnnotations({
    g,
    x,
    innerHeight,
  })

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
    .text('Anomaly Degrees Celsius')
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
    .style('border-radius', '5px')
    .style('padding', '10px')
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

<style scoped>
body {
  font-family: 'Geist', sans-serif;
}

h1 {
  font-family: 'Rethink Sans', sans-serif;
}

p {
  font-family: 'Geist', sans-serif;
}

</style>
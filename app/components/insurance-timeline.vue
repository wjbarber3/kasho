<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-y-4">
    <div class="flex justify-between flex-col items center w-full items-center gap-y-1 text-slate-800">
      <h1 class="text-4xl font-bold">Insurance Policy Timeline</h1>
      <p class="mb-2 italic">
        Coverage terms and change endorsements over time
      </p>

      <Divider type="dashed" class="max-w-xl text-slate-200 bg-slate-200" />

      <div class="flex items-center justify-center gap-x-3 text-sm font-bold text-slate-400">
        <i class="pi pi-moon" style="font-size: 1rem" />
        <p>=</p>
        <p>Twilight Period</p>
      </div>
    </div>

    <svg class="mx-auto" ref="svg" :width="width" :height="height"></svg>

    <div class="flex gap-x-8 mt-4 flex-wrap justify-center text-xs">
      <div
        v-for="term in policyTimeline.terms"
        :key="term.id"
        class="flex items-center gap-x-2"
      >
        <Checkbox
          :binary="true"
          :modelValue="visibleTerms.has(term.id)"
          @update:modelValue="() => toggleTerm(term.id)"
          :inputId="term.id"
          :pt="{
            root: {
              style: {
                '--term-color': termColorMap[term.id],
              }
            }
          }"
          class="term-checkbox"
        />
        <label
          :for="term.id"
          class="text-xs cursor-pointer font-bold text-slate-600"
        >
          {{ term.label }}
        </label>
      </div>
    </div>


  </div>
</template>

<script setup>
import * as d3 from 'd3'
import Checkbox from 'primevue/checkbox'

/* -----------------------------------
  SVG refs + dimensions
----------------------------------- */

const svg = ref(null)

const width = 800
const height = 400
const margin = { top: 20, right: 20, bottom: 50, left: 40 }

const leftPadding = 12

/* -----------------------------------
  Data model (Option B + lanes)
----------------------------------- */

const policyTimeline = {
  policyId: 'POL-12345',

  terms: [
    {
      id: 'term-1',
      label: 'Term 1',
      start: '2024-02-01',
      end: '2025-02-01',
      status: 'expired',
    },
    {
      id: 'term-2',
      label: 'Term 2',
      start: '2025-02-01',
      end: '2026-02-01',
      status: 'expired',
    },
    {
      id: 'term-3',
      label: 'Term 3',
      start: '2026-02-01',
      end: '2027-02-01',
      status: 'active',
    },
  ],

  endorsements: [
    // Term 1
    {
      id: 'endorsement-1',
      termId: 'term-1',
      start: '2024-04-20',
      end: '2025-02-01',
      oos: true,
      type: 'Change',
      description: 'Increased liability limit',
    },
    {
      id: 'endorsement-2',
      termId: 'term-1',
      start: '2024-04-01',
      end: '2025-02-01',
      type: 'Change',
      description: 'Corrected rating basis',
    },
    {
      id: 'endorsement-3',
      termId: 'term-1',
      start: '2024-06-29',
      end: '2025-02-01',
      type: 'Change',
      description: 'Higher deductible applied',
    },

    // Term 2
    {
      id: 'endorsement-4',
      termId: 'term-2',
      start: '2025-02-01',
      end: '2026-02-01',
      type: 'Renewal',
      description: 'Added additional insured',
    },

    // Term 3
    {
      id: 'endorsement-6',
      termId: 'term-3',
      start: '2026-02-01',
      end: '2027-02-01',
      type: 'Renewal',
      description: 'Premium adjusted at renewal',
    },
    {
      id: 'endorsement-7',
      termId: 'term-3',
      start: '2026-08-01',
      end: '2027-02-01',
      type: 'Change',
      description: 'Expanded property coverage',
    },
  ],
}

const visibleTerms = ref(
  new Set(policyTimeline.terms.map(t => t.id))
)

/* -----------------------------------
  Lane assignment logic (per term)
----------------------------------- */

// function assignLanes(endorsements) {
//   const sorted = endorsements
//     .slice()
//     .sort((a, b) => new Date(a.start) - new Date(b.start))

//   const lanes = []

//   sorted.forEach(e => {
//     const start = new Date(e.start)

//     let laneIndex = lanes.findIndex(lane =>
//       new Date(lane[lane.length - 1].end) <= start
//     )

//     if (laneIndex === -1) {
//       laneIndex = lanes.length
//       lanes.push([])
//     }

//     lanes[laneIndex].push(e)
//     e._lane = laneIndex
//   })

//   return lanes
// }

/* -----------------------------------
  D3 setup
----------------------------------- */

const termColors = [
  '#94C5FD',
  '#2DD4BF',
  '#C5B5FD',
]

const termColorPalette = [
  '#94C5FD',
  '#34D399',
  '#C5B5FD',
]

const termIndexMap = {}
policyTimeline.terms.forEach((term, i) => {
  termIndexMap[term.id] = i + 1
})

const termColorMap = computed(() => {
  const map = {}
  policyTimeline.terms.forEach((term, index) => {
    map[term.id] = termColorPalette[index % termColorPalette.length]
  })
  return map
})

onMounted(() => {
  const color = (termId) => termColorMap.value[termId]
  const today = new Date()

  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'term-tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('background', '#ffffff')
    .style('border', '1px solid #e5e7eb')
    .style('border-radius', '6px')
    .style('padding', '10px 12px')
    .style('font-size', '12px')
    .style('color', '#111827')
    .style('box-shadow', '0 10px 25px rgba(0,0,0,0.12)')
    .style('opacity', 0)

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const svgEl = d3.select(svg.value)

  const g = svgEl
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  /* -------------------------------
    Scales
  ------------------------------- */

  const x = d3.scaleTime()
    .domain([
      d3.min(policyTimeline.terms, d => new Date(d.start)),
      d3.max(policyTimeline.terms, d => new Date(d.end)),
    ])
    .range([leftPadding, innerWidth])

  const y = d3.scaleBand()
    .domain(policyTimeline.terms.map(d => d.id))
    .range([0, innerHeight])
    .padding(0.4)

  /* -------------------------------
    Layout constants
  ------------------------------- */

  const termBarHeight = y.bandwidth() * 0.45
  const endorsementLaneHeight = 18
  const endorsementLaneGap = 4
  const endorsementTopOffset = termBarHeight + 4

  /* -------------------------------
    Layers
  ------------------------------- */

  const gridLayer = g.append('g')
  const termLayer = g.append('g')
  const annotationLayer = g.append('g')
  // const scrubberLayer = g.append('g')
  const twilightLayer = g.append('g')
  const endorsementLayer = g.append('g')

  /* -------------------------------
    Axes
  ------------------------------- */

  gridLayer.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(
      d3.axisBottom(x)
        .ticks(d3.timeMonth.every(4))
        .tickFormat(d3.timeFormat('%b %Y'))
    )
    .style('font-size', '10px')
    .style('color', '#475569')

  /* -------------------------------
    Term bars
  ------------------------------- */

  termLayer
    .selectAll('.term-bar')
    .data(policyTimeline.terms)
    .enter()
    .append('rect')
    .attr('class', 'term-bar')
    .attr('data-term-id', d => d.id)
    .attr('x', d => x(new Date(d.start)))
    .attr('y', d => y(d.id))
    .attr('width', d =>
      x(new Date(d.end)) - x(new Date(d.start))
    )
    .attr('height', termBarHeight)
    .attr('rx', 6)
    .attr('fill', d => color(d.id))
    // handle hover
    .on('mouseenter', function (event, d) {
      console.log(d)
      const termId = d.id

      // Dim all terms
      d3.selectAll('.term-bar')
        .classed('dimmed', true)

      // Dim all endorsements
      d3.selectAll('.endorsement-bar')
        .classed('dimmed', true)

      // Undim hovered term
      d3.selectAll(`.term-bar[data-term-id="${termId}"]`)
        .classed('dimmed', false)

      // Undim endorsements belonging to this term
      d3.selectAll(`.endorsement-bar[data-term-id="${termId}"]`)
        .classed('dimmed', false)

      // handle tooltip
      tooltip
        .html(`
          <div class="flex flex-col gap-y-2">
          <p class="text-base font-bold">${d.label}</p>
          <div class="flex items-center gap-x-2">
            <i class="pi pi-circle-fill text-emerald-400" style="font-size: .7rem"></i>
            <p class="font-semibold text-[Geist]">
              <span class="underline">Effective:</span>
              ${d3.timeFormat('%m/%d/%Y')(new Date(d.start))}
            </p>
          </div>
          <div class="flex items-center gap-x-2">
            <i class="pi pi-circle-fill text-rose-400" style="font-size: .7rem"></i>
            <p class="font-semibold text-[Geist]">
              <span class="underline">Expiration:</span>
              ${d3.timeFormat('%m/%d/%Y')(new Date(d.end))}
            </p>
          </div>
        `)
        .style('left', `${event.pageX + 12}px`)
        .style('top', `${event.pageY + 12}px`)
        .style('opacity', 1)
    })
    .on('mousemove', (event) => {
      tooltip
        .style('left', `${event.pageX + 12}px`)
        .style('top', `${event.pageY + 12}px`)
    })
    .on('mouseleave', () => {
      d3.selectAll('.term-bar').classed('dimmed', false)
      d3.selectAll('.endorsement-bar').classed('dimmed', false)

      tooltip.style('opacity', 0)
    })

  termLayer
    .selectAll('.term-label')
    .data(policyTimeline.terms)
    .enter()
    .append('text')
    .attr('class', 'term-label')
    .attr('x', d => x(new Date(d.start)) + 8) // small left padding
    .attr('y', d => y(d.id) + termBarHeight / 1.8)
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#ffffff')
    .attr('font-size', '12px')
    .attr('font-weight', 700)
    .attr('font-family', 'Geist, sans-serif')
    .text(d => d.label)
    .style('pointer-events', 'none')

  /* -------------------------------
    Endorsements with lane packing
  ------------------------------- */

  const endorsementsByTerm = d3.group(
    policyTimeline.endorsements,
    d => d.termId
  )

  endorsementsByTerm.forEach((endorsements, termId) => {

    endorsementLayer
    .selectAll(`.endorsement-${termId}`)
    .data(endorsements)
    .enter()
    .append('rect')
    .attr('class', 'endorsement-bar')
    .attr('data-term-id', d => d.termId)
    .attr('x', d => x(new Date(d.start)))
    .attr('y', (d, i) => {
      const termY = y(termId)          // ✅ THIS fixes "termY undefined"
      return (
        termY +
        endorsementTopOffset +
        i * (endorsementLaneHeight + endorsementLaneGap)
      )
    })
    .attr('width', d =>
      x(new Date(d.end)) - x(new Date(d.start))
    )
    .attr('height', endorsementLaneHeight)
    .attr('rx', 3)
    .attr('fill', d => {
      return d.oos ? '#FEA4AF' : color(d.termId)
    })
    .attr('opacity', 0.35)

    endorsementLayer
      .selectAll('.endorsement-label')
      .data(endorsements)
      .enter()
      .append('text')
      .attr('class', 'term-label')
      .attr('x', d => x(new Date(d.start)) + 6) // small left padding
      .attr('y', (d, i) => {
        const termY = y(termId)
        return (
          termY +
          endorsementTopOffset +
          i * (endorsementLaneHeight + endorsementLaneGap) +
          endorsementLaneHeight / 1.8
        )
      })
      .attr('dominant-baseline', 'middle')
      .attr('fill', (d, i) => {
        return d.oos ? '#FB7185' : color(d.termId)
      })
      .attr('fill-opacity', '1')
      .attr('font-size', '11px')
      .attr('font-weight', 700)
      .attr('font-family', 'Geist, sans-serif')
      .text((d, i) => {
        const term = d.termId.replace('term-', '')
        let baseText = `${term}.${i + 1}: ${d.type}`
        if (d.oos) {
          baseText += ': Out of Sequence'
        }
        return baseText
      })
      .style('pointer-events', 'none')

  })

  /* -------------------------------
    Today Annotation
  ------------------------------- */

  const todayX = x(today)
  const xPos = x(today)

  const todayAnnotation = annotationLayer
    .append('g')
    .attr('class', 'today-annotation')
    .attr('opacity', 1)

  todayAnnotation
    .append('line')
    .attr('x1', todayX)
    .attr('x2', todayX)
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#64748b')          // slate
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')

  todayAnnotation
    .append('text')
    .attr('x', todayX + 6)
    .attr('y', 12)
    .text('Today')
    .attr('fill', '#475569')
    .attr('font-size', '11px')
    .attr('font-weight', 600)
    .attr('font-family', 'Geist, sans-serif')
    .attr('paint-order', 'stroke')
    .attr('stroke', 'white')
    .attr('stroke-width', 3)

  /* -------------------------------
    Scrubber
  ------------------------------- */

  // const scrubberLine = scrubberLayer
  //   .append('line')
  //   .attr('y1', 0)
  //   .attr('y2', innerHeight)
  //   .attr('stroke', '#334155')        // slate-700
  //   .attr('stroke-width', 1)
  //   .attr('stroke-dasharray', '4,4')
  //   .attr('opacity', 0)
  //   .style('pointer-events', 'none')

  // const overlay = g.append('rect')
  //   .attr('width', innerWidth)
  //   .attr('height', innerHeight)
  //   .attr('fill', 'transparent')
  //   .style('pointer-events', 'all')
  //   // .style('cursor', 'pointer')

  // overlay
  //   .on('mousemove', (event) => {
  //     const [mouseX] = d3.pointer(event)

  //     scrubberLine
  //       .attr('x1', mouseX)
  //       .attr('x2', mouseX)
  //       .attr('opacity', 1)

  //     const clampedX = Math.max(leftPadding, Math.min(mouseX, innerWidth))

  //     scrubberLine
  //       .attr('x1', clampedX)
  //       .attr('x2', clampedX)
  //   })
  //   .on('mouseleave', () => {
  //     scrubberLine.attr('opacity', 0)
  //   })

  /* -------------------------------
    Handle Twilight
  ------------------------------- */

  const TWILIGHT_DAYS = 60

  const twilightWindows = policyTimeline.terms.map(term => {
    const end = new Date(term.end)

    return {
      id: `twilight-${term.id}`,
      termId: term.id,
      start: d3.timeDay.offset(end, -TWILIGHT_DAYS),
      end: end,
    }
  })

  twilightLayer
    .selectAll('.twilight-band')
    .data(twilightWindows)
    .enter()
    .append('rect')
    .attr('class', 'twilight-band')
    .attr('x', d => x(d.start))
    .attr('y', 0)
    .attr('width', d => x(d.end) - x(d.start))
    .attr('height', innerHeight)
    .attr('fill', d => color(d.termId))
    .attr('fill-opacity', 0.15)
    .attr('stroke-opacity', 1)
    .attr('stroke', d => color(d.fromTermId))
    .attr('stroke-dasharray', '4,4')
    .attr('stroke-width', 0.5)
    .attr('pointer-events', 'none')

    // TWILIGHT TEXT (MIGHT COME BACK TO THIS)
    // twilightLayer
    //   .selectAll('.twilight-label')
    //   .data(twilightWindows)
    //   .enter()
    //   .append('text')
    //   .attr('class', 'twilight-label')
    //   .attr('x', d => {
    //     return x(d.start) + (x(d.end) - x(d.start)) / 1.8
    //   })
    //   .attr('y', (d, i) => {
    //     // First twilight label at bottom, others at top
    //     return i === 0 ? innerHeight - 40 : 40
    //   })
    //   .attr('text-anchor', 'middle')
    //   .attr('fill', d => color(d.termId))
    //   .attr('fill-opacity', 1)
    //   .attr('font-size', '11px')
    //   .attr('font-family', 'Geist, sans-serif')
    //   .attr('letter-spacing', '0.18em')
    //   .text(d => {
    //     const term = policyTimeline.terms.find(t => t.id === d.termId)
    //     return `Twilight`
    //   })
    //   .attr('transform', (d, i) => {
    //     const cx =
    //       x(d.start) + (x(d.end) - x(d.start)) / 1.8
    //     const cy = i === 0 ? innerHeight - 40 : 40
    //     return `rotate(-90, ${cx}, ${cy})`
    //   })
    //   .style('pointer-events', 'none')

    twilightLayer
      .selectAll('.twilight-icon')
      .data(twilightWindows)
      .enter()
      .append('foreignObject')
      .attr('class', 'twilight-icon')
      .attr('x', d =>
        x(d.start) + (x(d.end) - x(d.start)) / 2 - 7
      )
      .attr('y', 10) // top of the band
      .attr('width', 16)
      .attr('height', 16)
      .html(d => `
        <i
          class="pi pi-moon"
          style="
            color: ${color(d.termId)};
            opacity: 0.5;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
          "
        ></i>
      `)
})

// Function
function toggleTerm(termId) {
  if (visibleTerms.value.has(termId)) {
    visibleTerms.value.delete(termId)
  } else {
    visibleTerms.value.add(termId)
  }
}

</script>

<style>
.term-bar {
  transition: all 0.2s ease;
  opacity: .9;
  cursor: pointer;
}

.term-bar:hover {
  /* fill: #94A3B8; */
  opacity: 1;
}

.endorsement-bar {
  cursor: pointer;
  transition: all 0.2s ease, opacity 0.2s ease;
}

.endorsement-bar:hover {
  opacity: .5;
}

.dimmed {
  opacity: 0.35;
}

.term-checkbox .p-checkbox-box {
  border-color: var(--term-color);
}

.term-checkbox.p-checkbox-checked .p-checkbox-box {
  background-color: var(--term-color);
  border-color: var(--term-color);
}

.term-checkbox .p-checkbox-icon {
  color: white;
}
</style>

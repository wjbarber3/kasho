<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-y-4">
    <div class="flex justify-between flex-col items center w-full items-center gap-y-1 mb-8 text-slate-800">
      <h1 class="text-4xl font-bold">Insurance Policy Timeline</h1>
      <p class="mb-2 italic">
        Coverage terms and change endorsements over time
      </p>

      <Divider type="dashed" class="max-w-xl text-slate-200 bg-slate-200" />

      <!-- <p class="text-sm flex items-center gap-x-2">
        <i class="pi pi-sparkles text-blue-400"></i>
        <span>Hover across the chart to see the temperature anomaly for a given year</span>
      </p>

      <p class="text-sm flex items-center gap-x-2">
        <i class="pi pi-sparkles text-blue-400"></i>
        <span>Click each context title to learn more about the given event</span>
      </p>

      <p class="text-sm flex items-center gap-x-2">
        <i class="pi pi-sparkles text-blue-400"></i>
        <span>You can also hover a context event to highlight its line relevant to the chart</span>
      </p> -->

    </div>

    <svg class="mx-auto" ref="svg" :width="width" :height="height"></svg>

  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'

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
      start: '2022-01-01',
      end: '2023-01-01',
      status: 'expired',
    },
    {
      id: 'term-2',
      label: 'Term 2',
      start: '2023-01-01',
      end: '2024-01-01',
      status: 'expired',
    },
    {
      id: 'term-3',
      label: 'Term 3',
      start: '2024-01-01',
      end: '2025-01-01',
      status: 'active',
    },
  ],

  endorsements: [
    // Term 1
    {
      id: 'endorsement-1',
      termId: 'term-1',
      start: '2022-03-01',
      end: '2022-09-01',
      type: 'Coverage Change',
      description: 'Increased liability limit',
    },
    {
      id: 'endorsement-2',
      termId: 'term-1',
      start: '2022-06-15',
      end: '2022-12-01',
      type: 'Backdated Adjustment',
      description: 'Corrected rating basis',
    },
    {
      id: 'endorsement-3',
      termId: 'term-1',
      start: '2022-10-01',
      end: '2023-01-01',
      type: 'Deductible Change',
      description: 'Higher deductible applied',
    },

    // Term 2
    {
      id: 'endorsement-4',
      termId: 'term-2',
      start: '2023-02-01',
      end: '2023-08-01',
      type: 'Coverage Expansion',
      description: 'Added additional insured',
    },
    {
      id: 'endorsement-5',
      termId: 'term-2',
      start: '2023-07-01',
      end: '2024-01-01',
      type: 'Limit Adjustment',
      description: 'Reduced liability limits',
    },

    // Term 3
    {
      id: 'endorsement-6',
      termId: 'term-3',
      start: '2024-01-01',
      end: '2024-06-01',
      type: 'Renewal Re-rating',
      description: 'Premium adjusted at renewal',
    },
    {
      id: 'endorsement-7',
      termId: 'term-3',
      start: '2024-05-01',
      end: '2025-01-01',
      type: 'Coverage Change',
      description: 'Expanded property coverage',
    },
  ],
}

/* -----------------------------------
  Lane assignment logic (per term)
----------------------------------- */

function assignLanes(endorsements) {
  const sorted = endorsements
    .slice()
    .sort((a, b) => new Date(a.start) - new Date(b.start))

  const lanes = []

  sorted.forEach(e => {
    const start = new Date(e.start)

    let laneIndex = lanes.findIndex(lane =>
      new Date(lane[lane.length - 1].end) <= start
    )

    if (laneIndex === -1) {
      laneIndex = lanes.length
      lanes.push([])
    }

    lanes[laneIndex].push(e)
    e._lane = laneIndex
  })

  return lanes
}

/* -----------------------------------
  D3 setup
----------------------------------- */

const termColors = [
  '#94C5FD',
  '#2DD4BF',
  '#C5B5FD',
]

onMounted(() => {
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
  const endorsementLaneHeight = 10
  const endorsementLaneGap = 4
  const endorsementTopOffset = termBarHeight + 4

  /* -------------------------------
    Layers
  ------------------------------- */

  const gridLayer = g.append('g')
  const termLayer = g.append('g')
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
    .style('color', '#9DA3AF')

  // gridLayer.append('g')
  //   .call(
  //     d3.axisLeft(y)
  //       .tickFormat(id => {
  //         const term = policyTimeline.terms.find(t => t.id === id)
  //         return term?.label ?? id
  //       })
  //   )
  //   .style('font-size', '12px')
  //   .style('color', '#9DA3AF')

  /* -------------------------------
    Term bars
  ------------------------------- */

  const color = d3.scaleOrdinal()
    .domain(policyTimeline.terms.map(d => d.id))
    .range(termColors)

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
    assignLanes(endorsements)

    endorsementLayer
      .selectAll(`.endorsement-${termId}`)
      .data(endorsements)
      .enter()
      .append('rect')
      .attr('class', 'endorsement-bar')
      .attr('data-term-id', d => d.termId)
      .attr('x', d => x(new Date(d.start)))
      .attr('y', d => {
        const baseY = y(termId) + endorsementTopOffset
        return baseY + d._lane * (endorsementLaneHeight + endorsementLaneGap)
      })
      .attr('width', d =>
        x(new Date(d.end)) - x(new Date(d.start))
      )
      .attr('height', endorsementLaneHeight)
      .attr('rx', 3)
      // .attr('fill', '#94A3B8')
      .attr('fill', d => color(d.termId))
      .attr('opacity', 0.35)
      // .attr('opacity', 0.9)
  })

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
    .attr('fill-opacity', 0.08)
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

</script>

<style>
.term-bar {
  transition: fill 0.2s ease;
  cursor: pointer;
}

.term-bar:hover {
  /* fill: #94A3B8; */
}

.endorsement-bar {
  cursor: pointer;
  transition: fill 0.2s ease, opacity 0.2s ease;
}

.endorsement-bar:hover {
  opacity: 1;
}

.dimmed {
  opacity: 0.15;
}
</style>

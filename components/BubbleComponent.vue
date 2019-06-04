<template>
  <div class="bubbles">
    <!-- SVG that renders the chart based on the "width" and "height" setting from the Vue instance’s data object -->
    <svg
      class="chart"
      :width="settings.width"
      :height="settings.height"
      :viewBox="'0 0 ' + settings.width + ' ' + settings.height"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- In contrast to D3’s "select" methods, we define the graphical elements explicitely here and use the template syntax to loop through collections and bind properties such as "d" or "r" to those elements. -->
      <transition-group tag="g" name="line">
        <!-- Links are represented as paths -->
        <path
          v-for="link in links"
          :key="link.id"
          class="link"
          :d="link.d"
          :style="link.style"
        ></path>
      </transition-group>

      <!-- We can now also use events to elements that will call respective methods on the Vue instance -->
      <transition-group tag="g" name="list">
        <g
          v-for="(node, index) in nodes"
          :key="node.id"
          class="node"
          :style="node.style"
          :class="[node.className, { highlight: node.highlight }]"
          @click="select(index, node)"
        >
          <!-- Circles for each node -->
          <circle
            :r="node.r"
            :class="node.id == selected ? 'selected' : ''"
          ></circle>

          <!-- Finally, text labels -->
          <text
            :dx="node.textpos.x"
            :dy="node.textpos.y"
            :style="node.textStyle"
          >
            {{ node.text }}
          </text>
        </g>
      </transition-group>
    </svg>
  </div>
</template>

<script>
import { parseGraph, findSubTree } from '~/utils/graph'

export default {
  props: { start: { type: String, required: true } },
  data: function() {
    return {
      graph: null,
      rawGraph: null,
      csv: null,
      selected: this.start,
      settings: {
        width: 900,
        height: 900
      }
    }
  },

  computed: {
    root: function() {
      // compute new root based on selected node

      if (this.csv) {
        const subtree = findSubTree(this.rawGraph, this.selected)
        // console.log(this.selected, subtree)

        const nodes = this.$d3
          .stratify()
          .id(d => d.subject)
          .parentId(d => d.supertype)(subtree)
          .sort(function(a, b) {
            return a.height - b.height || a.id.localeCompare(b.id)
          })

        return this.$d3
          .cluster()
          .size([this.settings.height, this.settings.width])(nodes)
      }
      return false
    },

    tree: function() {
      return this.$d3
        .cluster()
        .size([this.settings.height, this.settings.width])
    },

    nodes: function() {
      if (this.root) {
        return this.root.descendants().map(function(d) {
          // console.log('d', d)
          return {
            id: d.id,
            r: 25,
            className:
              'node' + (d.children ? ' node--internal' : ' node--leaf'),
            text: d.id.substring(d.id.lastIndexOf('.') + 1),
            style: {
              transform: 'translate(' + d.y + 'px,' + d.x + 'px)'
            },
            textpos: {
              x: d.children ? -8 : 8,
              y: 3
            },
            textStyle: {
              textAnchor: d.children ? 'end' : 'start'
            }
          }
        })
      }
      return null
    },

    links: function() {
      let that = this

      if (this.root) {
        // here we’ll calculate the "d" attribute for each path that is then used in the template where we use "v-for" to loop through all of the links to create <path> elements
        return this.root
          .descendants()
          .slice(1)
          .map(function(d) {
            return {
              id: d.id,
              d:
                'M' +
                d.y +
                ',' +
                d.x +
                'C' +
                (d.parent.y + 100) +
                ',' +
                d.x +
                ' ' +
                (d.parent.y + 100) +
                ',' +
                d.parent.x +
                ' ' +
                d.parent.y +
                ',' +
                d.parent.x,

              // here we could of course calculate colors depending on data but for now all links share the same color from the settings object that we can manipulate using UI controls and v-model

              style: {
                stroke: that.settings.strokeColor
              }
            }
          })
      }
      return null
    }
  },
  mounted: async function() {
    this.csv = await this.$axios.$get('/graph.csv')
    this.rawGraph = parseGraph(this.csv)
  },
  methods: {
    select: function(index, node) {
      // console.log('selected', node)
      this.selected = node.id
    }
  }
}
</script>

<style lang="scss" scoped>
.bubbles {
  height: 100vh;
  width: 100vw;
}
.chart {
  height: 100%;
  width: 100%;
}
svg {
  background-color: $global-text-color;
}
.node {
  opacity: 1;
}

.node circle {
  fill: #999;
  cursor: pointer;
}

.node text {
  cursor: pointer;
  font-size: 1.5rem;
}

.node--internal circle {
  fill: #555;
}

.node--internal text {
}

.link {
  fill: none;
  stroke: #555;
  stroke-opacity: 0.5;
  stroke-width: 0.5rem;
  stroke-dasharray: 1000;
}

.node:hover {
  pointer-events: all;

  circle {
    stroke: black;
  }
}

.node.highlight {
  fill: red;
}

circle {
  fill: '#bfbfbf';
  &.selected {
    fill: red;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

.line-enter-active,
.line-leave-active {
  transition: all 1s;
  stroke-dashoffset: 0;
}
.line-enter, .line-leave-to /* .list-leave-active for <2.1.8 */ {
  stroke-dashoffset: 1000;
}
</style>
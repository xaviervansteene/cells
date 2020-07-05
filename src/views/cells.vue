
<template lang="html">
  <div class='container py-5'>

    <!-- SVG filters -->
    <svg class="hidden">
			<defs>
				<filter id="filter">
					<feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="1" result="warp" />
					<feOffset dx="-0" result="warpOffset" />
					<feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpOffset" />
				</filter>
			</defs>
		</svg>

      <!-- Title -->
    <h1>Cells energy</h1>

  <!-- Filters -->
    <div class="row mt-5">
      <div class="col-4 form-group">
        <label>Number of steps</label>
        <input class="form-control" type="number" v-model="K"/>
      </div>
      <div class="col-4 form-group">
        <label>Cells quantity</label>
        <input class="form-control" type="number"  max="12" min="1" v-model="cellQuantity"/>
      </div>
      <div class="col-4 form-group">
        <label>Step duration (s)</label>
        <input class="form-control" type="number" v-model="stepDuration"/>
      </div>
    </div>

    <!-- Cells + array -->
    <div class="d-flex align-items-center justify-content-center mt-5">
      <div v-for="cell in cells" :class="[{'cell-active' : cell === 1},'cell mx-1']"></div>
    </div>
    <div class="d-flex align-items-center justify-content-center mt-2">
       <div class="text">{{cells}} </div>
    </div>

  <!-- Generate -->
    <div class="d-flex align-items-center justify-content-center mt-5">
       <div class="btn-launch rounded-pill shadow-lg" @click="dispatchEnergy()">generate</div>

    </div>
  </div>
</template>

<script>
import Vue from "vue";
import filter from "../scripts/filter";

export default Vue.extend({
  data() {
    return {
      K: 2,
      stepDuration: 1,
      cellQuantity: 4,
      initialSetOfCells: [1,0,1,1],
      cells: [1,0,1,1]
    };
  },
  methods : {
    dispatchFx () {
      document.querySelectorAll(".cell-active").forEach(element => {
        const cellFx = filter[0];
        const myCellFx = new cellFx(element);
      });
    },
    setCellElements (index, state) {
      let cellElements = {}

      // First cell gets last one as left neighbor
      if (index === 0) {
          cellElements.left = this.cells.length - 1
          cellElements.right = index + 1
        }
        // Last cell gets first one as right neighbor
        else if (index === this.cells.length - 1) {
          cellElements.right = 0
          cellElements.left = index - 1
        }
        // general case
        else {
          cellElements.right = index + 1
          cellElements.left = index - 1
        }

        cellElements.state = state

        return cellElements;
    },
    dispatchEnergy() {

      for (let step = 0; step < this.K; step++) {

        // set delay between each step
        setTimeout(() => {
          let cells_tmp = [...this.cells]

          // looping on each cell to set a new state ... or not
          for (const [index, state] of Object.entries(cells_tmp)) {
            index = parseInt(index)
            const cellElements = this.setCellElements(index, state)

            // Rules:
            // > If both neighbors get 1 as state current cell state is set to 0
            // > If both neightbors get 0 as state current state goes to 0
            // > In any other cases current state goes to 1

            if ((this.cells[cellElements.right] === 1 && this.cells[cellElements.left] === 1) || (this.cells[cellElements.right] === 0 && this.cells[cellElements.left] === 0 )) {
              cells_tmp[index] = 0
            }
            else {
              cells_tmp[index] = 1
            }
          }
          this.cells = [...cells_tmp]

          this.$nextTick(() => {
            this.dispatchFx()
          })

        }, step * this.stepDuration * 1000)
      }
    }
  },
  watch: {
    cellQuantity : function (newVal, oldVal) {
      if (newVal > oldVal) {
        this.cells.push(Math.round(Math.random()))
      }
      else {
        this.cells.splice(this.cells.length-1, 1)
      }

    }
  }
});
</script>

<style lang="scss">
@import "../style/main.scss";


</style>

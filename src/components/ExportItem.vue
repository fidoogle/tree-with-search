<template>
  <div class="node-export">
    <i class="material-icons" :class="{'nice-teal': checked, 'md-dark md-inactive': !checked }" @click="checkIt" v-if="depth===2">check_circle</i>
  </div>
</template>


<script>
import Vuex from 'vuex';
import _ from "lodash";

export default {  
    data() {
      return {
        selected: false
      };
    },
  
  
    props: {
      numbering: {
        type: String
      },
      depth: {
        type: Number
      }
    },
  
    computed: {
        ...Vuex.mapGetters([
            "getExportItems"
        ]),

        checked() {
            return _.includes(this.getExportItems, this.numbering);
        }
    },
  
    methods: {
        ...Vuex.mapMutations([
            "exportItemAdd", 
            "exportItemRemove"
        ]),

        checkIt() {
            this.selected = this.checked;
            this.selected = !this.selected;

            if (this.selected) {
                this.exportItemAdd(this.numbering);
            } else {
                this.exportItemRemove(this.numbering);
            }
        }
    }
};
</script>
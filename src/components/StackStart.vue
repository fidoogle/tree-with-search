<template>
  <div class="taxonomy-list">
      <stack-view
      :depth="0"
      :Counts="tree.Counts"
      :Level="tree.Level"
      :Nodes="tree.Nodes"
      :Numbering="tree.Numbering"
      :Owner="tree.Owner"
      :Title="tree.Title"
      >
      </stack-view>
  </div>
</template>


<script>
import Vuex from 'vuex';
import _ from "lodash";
import StackView from "@/components/StackView";

export default {  
    components: {
        "stack-view": StackView
    },
    
    computed: {
        ...Vuex.mapGetters(["getTaxonomy", "getSelectedTaxonomy"]),

        tree() {
          return this.$store.getters.getTaxonomy;
        }
    }

}
</script>
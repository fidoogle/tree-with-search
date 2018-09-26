<template>
  <div>
    <header class="taxonomy-title">
        <div class="taxonomy-title">CTDO TAXONOMY</div>
    </header>
    
    <div class="taxonomy-container">

        <tool-bar></tool-bar>

        <transition
        enter-active-class="animated bounceInRight"
        leave-active-class="animated bounceOutRight"
        mode="out-in">

            <router-view></router-view>

        </transition>

    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import axios from 'axios';
import ToolBar from '@/components/ToolBar';

export default {
  components: {
    "tool-bar": ToolBar
  },

  created() {
    axios.all([
        this.fetchTaxonomy()
    ])
  },

  methods: {
      ...Vuex.mapActions([
        "fetchTaxonomy"
      ])
  }
};
</script>
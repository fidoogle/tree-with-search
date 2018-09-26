<template>
  <div class="node-counts" v-show="analytics">
      <div v-for="(value, key) in items" class="node-count-box" :class="[key]" :key="key">
          {{ value }}
      </div>
  </div>
</template>

<script>

export default {
  props: {
    areaClass: {
      type: String,
      default() {
        return "CTDO";
      }
    },
    items: {
      type: Object,
      default() {
        return {};
      }
    },
    depth: {
      type: Number
    },
    analytics: {
      type: Boolean,
      default() {
        return false;
      }
    }
  }
};
</script>
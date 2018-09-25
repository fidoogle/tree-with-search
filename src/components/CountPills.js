/* Pattern for Vue components without webpack
 * https://medium.com/js-dojo/vue-js-single-file-javascript-components-in-the-browser-c03a0a1f13b8
 */

const CountPills = {
  template: `
        <div class="node-counts" v-show="analytics">
            <div v-for="(value, key) in items" class="node-count-box" :class="[key]" :key="key">
                {{ value }}
            </div>
        </div>
    `,

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

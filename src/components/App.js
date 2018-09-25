/* Pattern for Vue components without webpack
 * https://medium.com/js-dojo/vue-js-single-file-javascript-components-in-the-browser-c03a0a1f13b8
 */

const App = {
  template: `
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
    `,

  components: {
    "tool-bar": ToolBar
  }
};

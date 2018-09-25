/* Pattern for Vue components without webpack
 * https://medium.com/js-dojo/vue-js-single-file-javascript-components-in-the-browser-c03a0a1f13b8
 */

const ActionDropDown = {
    template: `
    <div class="node-ellipsis" v-click-outside="onClickOutside">
        <i class="material-icons" :class="{'gray-out': depth!=2 && depth!=3}" @click="visible = !visible">more_vert</i>
        <div class="ellipsis-dropdown" v-show="visible && depth===2">
            <a href="#" @click="getAction(numbering, title)" class="ellipsis-item">Action Items</a>
        </div>
        <div class="ellipsis-dropdown ellipsis-dropdown-big" v-show="visible && depth===3">
            <a href="#" @click="passToDeds(numbering, title)" class="ellipsis-item">DE Documentation Status</a>
        </div>
    </div>
    `,

    data() {
        return {
          visible: false
        };
    },
    
    props: {
        depth: {
            type: Number
        },
        numbering: {
            type: String
        },
        title: {
            type: String
        }
    },

    methods: {
        getAction(numbering, title) {
            window.parent.getActionItem(numbering, title);
        },

        onClickOutside(e, el) {
            this.visible = false;
        },

        passToDeds: function passToDeds(id, title) {
            window.open(window._spPageContextInfo.webAbsoluteUrl+'/Pages/DEDS.aspx?BD_Id='+id, '_blank');
        }
    }
}
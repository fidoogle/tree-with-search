const StackStart = {
    template: `
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
    `,
    components: {
        "stack-view": StackView
    },
    
    computed: {
        ...Vuex.mapGetters(["getSelectedTaxonomy"]),

        tree() {
            if (ENDPOINTS[this.getSelectedTaxonomy].treeData) {
                return ENDPOINTS[this.getSelectedTaxonomy].treeData;
            } else {
                return treeSample; //defined in store
            }
        }
    },

    methods: {
        ...Vuex.mapMutations(["updateSelectedTaxonomy"]), 
        ...Vuex.mapActions(["requestData"])
    },

    mounted() {
        const that = this;
        setTimeout(function () { //TODO: call an Action "requestData" instead
            that.updateSelectedTaxonomy("DEV");
            if (window.location.href.indexOf("/dev/") == -1) {
                that.updateSelectedTaxonomy("PROD");
            }
        }, 1500);
    }

}
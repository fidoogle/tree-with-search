var ExportGroup = {
    template: `
        <div class="node-export">
        <i class="material-icons" :class="{'nice-teal': selected, 'md-dark md-inactive': !selected }" @click="checkGroup">check_circle</i>
        </div>
    `,
  
    data() {
      return {
        selected: false
      };
    },
  
  
    props: {
      numbering: {
        type: String
      }
    },
  
    computed: {
        ...Vuex.mapGetters([
            "getExportItems", 
            "getSelectedTaxonomy"
        ]),

        checked() {
            //compare getExportItems to parentItem.Nodes
            const that = this;
            try {
                this.parentItem.Nodes.every(function (node, index) {
                    return _.includes(that.getExportItems, node.Numbering);
                });
            } catch (e) {
                //console.log("catch:");
                return false;
            }
        },
      
        parentItem() {
            try {
                return _.find(window.ENDPOINTS[this.getSelectedTaxonomy].treeData.Nodes, { Numbering: this.numbering });
            } catch (e) {
                return { Nodes: [] };
            }
        }
    },
  
    methods: {
        ...Vuex.mapMutations([
            "exportItemAdd", 
            "exportItemRemove"
        ]),
      
        checkGroup() {
            const that = this;

            this.selected = !this.selected;
    
            if (this.selected) {
                //console.log("add group: ", this.numbering);
                this.parentItem.Nodes.forEach(function (node, index) {
                    that.exportItemAdd(node.Numbering);
                });
            } else {
                //console.log("remove group: ", this.numbering);
                this.parentItem.Nodes.forEach(function (node, index) {
                    that.exportItemRemove(node.Numbering);
                });
            }
        }
    }
  };
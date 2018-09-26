<template>
  <div class="taxonomy-tool-bar sticky" id="sticky-toolbar">
      <div class="taxonomy-tool-bar-top">    
          <div class="tool-bar-search">
              <div>
                  <div class="search">
                      <i class="material-icons icon-search" v-if="search===''">search</i>
                      <i class="material-icons icon-close" v-else @click="search=''" v-show="!isIE">close</i>
                      <input id="searchInput" placeholder="Search number, title, description or owner" maxlength="40" v-model="search" @focus="delayExpandAll" type="text">           
                      <span v-show="search" class="search-results">Levels: {{searchCount}}</span>
                      </div>
              </div>
          </div>    
          <div class="tool-bar-expansion">
              <a class="btn-small white" @click="expandAll">          
                  <i class="material-icons md-dark">add</i>        
              </a>        
              <a class="btn-small white" @click="collapseAll">          
                  <i class="material-icons md-dark">remove</i>        
              </a>    
          </div>       
          <div class="tool-bar-export">        
              <a class="waves-effect waves-teal btn-small white black-text" @click="exportIt" :class="{'border-teal': getExportButtonState===1}">          
                  <i class="material-icons left md-dark">file_download</i>Export        
              </a>                                
          </div>    
          <div class="tool-bar-analytics">        
              <a class="waves-effect waves-teal btn-small white black-text" @click="updateAnalytics" :class="{'border-teal': checkAnalytics}">          
                  <i class="material-icons left md-dark">timeline</i>Analytics        
              </a>                                
          </div>
      </div>
      
      <div class="taxonomy-tool-bar-bottom">    
          <div class="legend-item">        
              <div class="legend-box level1">
                  <span v-show="checkAnalytics">{{(Counts)?Counts.level1:""}}</span>
              </div>        
              <div class="legend-team-name">High Level Team</div>    
          </div>    
          <div class="legend-item">        
              <div class="legend-box level2">
                  <span v-show="checkAnalytics">{{(Counts)?Counts.level2:""}}</span>
              </div>        
              <div class="legend-team-name">Team</div>    
          </div>    
          <div class="legend-item">        
              <div class="legend-box level3">
                  <span v-show="checkAnalytics">{{(Counts)?Counts.level3:""}}</span>
              </div>        
              <div class="legend-team-name">Business Deliverable</div>    
          </div>    
          <div class="legend-item">        
              <div class="legend-box level3m">
                  <span v-show="checkAnalytics">{{(Counts)?Counts.level3m:""}}</span>
              </div>        
              <div class="legend-team-name">Experience</div>    
          </div>    
          <div class="legend-item">        
              <div class="legend-box level4">
                  <span v-show="checkAnalytics">{{(Counts)?Counts.level4:""}}</span>
              </div>        
              <div class="legend-team-name">Process</div>    
          </div>
      </div>
      
  </div>
</template>

  
<script>
import Vuex from 'vuex';
import _ from "lodash";

export default {  

    data() {
        return {
        exportItState: 0,
        searchCount: null
        };
    },

    computed: {
        ...Vuex.mapGetters([
        "getAppId",
        "getAnalytics",
        "getExportItems",
        "getExportButtonState",
        "getTaxonomy",
        "getZoom"
        ]),

        areaClass() {
        return "PROD";
        },
        selectedTaxonomy: {
            get() {
                return this.$store.getters.getSelectedTaxonomy;
            },
            set(value) {
                this.$store.commit("updateSelectedTaxonomy", value);
            }
        },
        search: {
          get() {
            return this.$store.getters.getSearch;
           },
          set(value) {
            if (value.length>2 || value.length===0) {
              this.updateSearch(value);
             }
           }
        },
        checkAnalytics: {
            get() {
                return this.$store.getters.getAnalytics;
            },
            set(value) {
                this.$store.commit("updateAnalytics", value);
            }
        },
        checkFilterList: {
            get() {
                return this.$store.getters.getCheckFilterList;
            },
            set(value) {
                this.$store.commit("toggleCheckFilterList", value);
            }
        },
        results() {
            return this.$store.getters.getResults;
        },
        Counts() {
            try {
                return this.getTaxonomy.Counts;
            } catch (e) {
                return {
                level1: 0,
                level2: 0,
                level3: 0,
                level3m: 0,
                level4: 0
                };
            }
        },

        isIE() {
            return (window.navigator.userAgent.indexOf("MSIE ") > 0);
        }
    },

    methods: {
        ...Vuex.mapMutations(["setExpandAll", "updateAnalytics", "updateExportButtonState", "updateSearch"]),

        archive() {
            let dataStr = JSON.stringify(
                window.ENDPOINTS[this.selectedTaxonomy].flatData
            );
            //console.log("dataStr", dataStr);
            let dataUri =
                "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

            let exportFileDefaultName = this.selectedTaxonomy + ".json";

            let linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", exportFileDefaultName);
            linkElement.click();
        },

        navigateTo(target) {
            if (target === "grid") {
                this.$router.push("/grid/");
            } else if (target === "archive") {
                this.$router.push("/archive/");
            } else {
                this.$router.push("/tree/");
            }
        },

        collapseAll() {
            this.setExpandAll(2);
            this.updateSearch('');
        },

        delayExpandAll(event) {
            setTimeout(()=>{
                this.setExpandAll(1);
                this.updateSearchResults();
                /*const that = this;
                event.target.addEventListener("input", _.debounce(
                    () => { that.setExpandAll(1); console.warn('input:',event.target.value); },
                    300)
                );*/
            }, 3000);
        },

        expandAll() {
            this.setExpandAll(1);
        },

        exportIt() {
            if (this.isIE) { // If Internet Explorer
                alert("This functionality only works in Chrome. Please open this browser and try again.");
            } else {
                this.exportItState++;
                this.updateExportButtonState(this.exportItState);
                if (this.exportItState === 1) {
                    //show checkboxes
                    //color button
                } else {
                    if (this.getExportItems.length > 0) {
                      exportToExcel(this.getExportItems, this.getTaxonomy);
                    }
                    this.exportItState = 0;
                    this.updateExportButtonState(this.exportItState);
                }
            }
        },

        updateSearchResults() {
            //Allow DOM to be updated with search results
            setTimeout(()=>{
                this.searchCount = document.querySelectorAll('div.list-node:not(.filterList)').length;
            }, 100);
        },

        updateViewIds() {
            window.updateViewIds(this.getAppId);
        }
    },

    watch: {
        // whenever question changes, this function will run
        search: function() {
            this.updateSearchResults();
        }
    }
};
</script>
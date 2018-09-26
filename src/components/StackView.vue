<template>
  <div>
    <template v-if="depth===1">
      <div class="list-node use-pointer" :class="[Level, {filterList: getCheckFilterList && searchMatch(depth, Numbering, Title) }]" @click="toggleChildren">
        <div class="node-left">
            <div class="node-number-slot">
                <div class="node-number-color" :class="[Level]" v-html="highlightedNumbering"></div>
            </div>
            <div class="node-title" :class="[Level]" v-html="highlightedTitle"></div>
        </div>
        
        <div class="node-right">
            <count-pills :analytics="getAnalytics" :areaClass="areaClass" :depth="depth" :items="showCounts(Counts, depth)"></count-pills>
            
            <div class="node-owner"></div>

            <export-group :numbering="Numbering" v-show="getExportButtonState===1"></export-group>

            <div class="node-ellipsis"><i class="material-icons gray-out">more_vert</i></div>

            <div class="node-expansion">
              <i class="material-icons rotate" :class="{down: showChildren}" v-show="Nodes">expand_more</i>
            </div>
        </div>

      </div>
    </template>

    <template v-else-if="depth>1 && depth<5">
      <div class="list-node" :class="[Level, {'use-pointer': depth<4}, {filterList: getCheckFilterList && searchMatch(depth, Numbering, Title, Owner, Description) }]" @click="toggleChildren">
        <div class="node-left">
            <div class="node-number-slot">
                <div class="node-number-color" :class="[Level]"></div>
            </div>
            <div class="node-title" :class="[Level]">
                <span v-html="highlightedNumbering"></span>
                <span v-if="depth===4 && Description">
                    <a class="node-tooltip">
                        <span v-html="highlightedTitle"></span>
                        <span class="node-tooltiptext" :class="{wide: Description.length>150}" v-html="highlightedDescription"></span>
                    </a>
                    <i class="material-icons" v-show="highlightedDescription.indexOf('search-highlight')!=-1">comment</i>
                </span>
                <span v-else v-html="highlightedTitle"></span>
            </div>
        </div>
        
        <div class="node-right">
            <count-pills :analytics="getAnalytics" :areaClass="areaClass" :depth="depth" :items="showCounts(Counts, depth)"></count-pills>
            
            <div class="node-owner" v-html="highlightedOwner"></div>
            
            <export-item :numbering="Numbering" :depth="depth" v-show="getExportButtonState===1"></export-item>

            <action-drop-down :depth="depth" :numbering="Numbering" :title="Title"></action-drop-down>

            <div class="node-expansion">
              <i class="material-icons" v-show="Nodes && showChildren">remove</i>
              <i class="material-icons" v-show="Nodes && !showChildren">add</i>
            </div>
        </div>
      </div>
    </template>

    <stack-view 
      v-if="computedShow || depth===0"
      v-for="Node in Nodes"
        :analytics="getAnalytics"
        :Counts="Node.Counts"
        :depth="depth + 1"
        :Description="Node.Description"
        :key="Node.Numbering"
        :Level="Node.Level"
        :Nodes="Node.Nodes"
        :Numbering="Node.Numbering"
        :Owner="Node.Owner"
        :Title="Node.Title"
    >
    </stack-view>

  </div>
</template>

    
<script>
import Vuex from 'vuex';
import ActionDropDown from '@/components/ActionDropDown';
import CountPills from '@/components/CountPills';
import * as Service from '@/services/Service'
import ExportGroup from '@/components/ExportGroup';
import ExportItem from '@/components/ExportItem';

export default {  

    name: "stack-view",
    props: [
        "Counts",
        "depth",
        "Description",
        "Level",
        "Nodes",
        "Numbering",
        "Owner",
        "Title"
    ],

    components: {
        "action-drop-down": ActionDropDown,
        "count-pills": CountPills,
        "export-group": ExportGroup,
        "export-item": ExportItem
    },

    data() {
        return {
        showChildren: false
        };
    },

    computed: {
        ...Vuex.mapGetters([
        "getAppId",
        "getAnalytics",
        "getExpandAll",
        "getExportButtonState",
        "getZoom",
        "getCheckFilterList",
        "getTaxonomy"
        ]),

        areaClass() {
            return this.getTaxonomy.area;
        },

        computedShow() {
            if (this.getExpandAll === 0) {
                return this.showChildren;
            } else {
                this.showChildren = (this.getExpandAll === 1);
                return this.showChildren;
            }
        },

        search() {
            return this.$store.getters.getSearch;
        },

        showNodes() {
            return this.depth < this.getZoom;
        },

        highlightedDescription() {
            if (this.Description) {
                if (this.search) {
                    let query = new RegExp(this.search, "i");
                    let found = this.Description.search(query) !== -1;
                    if (found) {
                        return this.Description.replace(
                            query,
                            '<span class="search-highlight">$&</span>'
                        );
                    }
                }
                return this.Description;
            }
            return '';
        },

        highlightedOwner() {
            if (this.Owner.Title) {
                if (this.search) {
                    let query = new RegExp(this.search, "i");
                    let found = this.Owner.Title.search(query) !== -1;
                    if (found) {
                        return this.Owner.Title.replace(
                            query,
                            '<span class="search-highlight">$&</span>'
                        );
                    }
                }
                return this.Owner.Title;
            }
            return '';
        },

        highlightedNumbering() {
            if (this.search) {
                let query = new RegExp(this.search, "i");
                let found = this.Numbering.search(query) !== -1;
                if (found) {
                return this.Numbering.replace(
                    query,
                    '<span class="search-highlight">$&</span>'
                );
                }
            }
            return this.Numbering;
        },

        highlightedTitle() {
            if (this.search) {
                let query = new RegExp(this.search, "i");
                let found = this.Title.search(query) !== -1;
                if (found) {
                return this.Title.replace(
                    query,
                    '<span class="search-highlight">$&</span>'
                );
                }
            }
            return this.Title;
        }
    },

    methods: {
        ...Vuex.mapMutations(["setExpandAll"]),

        toggleChildren(e) {
            e = e || window.event;
            let target = e.target || e.srcElement;
            //Don't toggle for clicks on ellipsis icon or within ellipsis modal
            if ( target.textContent!='more_vert' && target.textContent!='check_circle' && target.className.indexOf('ellipsis')===-1 ) {
                this.showChildren = !this.showChildren;
                this.setExpandAll(0);
            }
        },

        searchMatch(depth, numbering, title, owner, description) {
            if (depth === 0) return false;

            let query = new RegExp(this.search, "i");
            let found = title.search(query) === -1 && numbering.search(query) === -1;

            if (owner && owner.Title) {
                found = found && owner.Title.search(query) === -1;
            }

            if (description) {
                found = found && description.search(query) === -1;
            }

            return found;
        },

        showCounts(Counts, depth) {
            return Service.showCountsForLevel(Counts, depth);
        }
    },

    created() {
        /*eventBus.$on("expandAll" + this.getAppId, show => {
            this.showChildren = show;
        });*/
    }
    /*watch: {
        $route(to, from) {
        this.showChildren = to.query.expandAll === "1";
        }
    }*/

}
</script>
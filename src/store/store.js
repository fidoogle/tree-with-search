"use strict";

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

var treeSample = {
  Numbering: "CTDO",
  Title: "Loading data...",
  Level: "root",
  Nodes: []
};

Vue.use(Vuex);

function createRouter(appId) {
  return new VueRouter([
    { path: "/stack/", component: StackStart },
    { path: "*", redirect: "/stack/" }
  ]);
}

function createStore(appId) {
  return new Vuex.Store({
    state: {
      appId: appId,
      analytics: false,
      checkFilterList: true,
      expandAll: 0, //0 = get local showChildren from tree node, 1 = expand all, 2 = hide all
      exportItems: [],
      exportButtonState: 0,
      query: "",
      results: 0,
      selectedTaxonomy: "PROD",
      zoom: 0,
      taxonomy: {}
    },
    getters: {
      getAppId: function getAppId(state) {
        return state.appId;
      },
      getExpandAll: function getExpandAll(state) {
        return state.expandAll;
      },
      getSearch: function getSearch(state) {
        return state.query;
      },
      filledSearch: function filledSearch(state) {
        return state.query !== "";
      },
      getResults: function getResults(state) {
        return state.results;
      },
      getAnalytics: function getAnalytics(state) {
        return state.analytics;
      },
      getTaxonomy: function getTaxonomy(state) {
        if (state.taxonomy) return state.taxonomy;
        else return treeSample;
      },
      getZoom: function getZoom(state) {
        return state.zoom;
      },
      getCheckFilterList: function getCheckFilterList(state) {
        return state.checkFilterList;
      },
      getSelectedTaxonomy: function getSelectedTaxonomy(state) {
        return state.selectedTaxonomy;
      },
      getExportItems: function getExportItems(state) {
        return window.sortNumbering(state.exportItems);
      },
      getExportButtonState: function getExportButtonState(state) {
        return state.exportButtonState;
      }
    },
    mutations: {
      setExpandAll: function setExpandAll(state, payload) {
        state.expandAll = payload;
      },
      updateAnalytics: function updateAnalytics(state) {
        state.analytics = !state.analytics;
      },
      incrementZoom: function incrementZoom(state) {
        state.zoom++;
      },
      setTaxonomy: function setTaxonomy(state, payload) {
        state.taxonomy = payload;
        console.log("payload", payload);
      },
      setZoom: function setZoom(state, payload) {
        state.zoom = payload;
      },
      updateSearch: function updateSearch(state, payload) {
        state.query = payload;
      },
      resetResults: function resetResults(state) {
        state.results = 0;
      },
      incrementResults: function incrementResults(state) {
        state.results++;
      },
      toggleCheckFilterList: function toggleCheckFilterList(state, payload) {
        state.checkFilterList = !state.checkFilterList;
      },
      updateSelectedTaxonomy: function updateSelectedTaxonomy(state, payload) {
        state.selectedTaxonomy = payload;
      },
      exportItemAdd: function exportItemAdd(state, item) {
        state.exportItems = Array.from(
          new Set([].concat(_toConsumableArray(state.exportItems), [item]))
        );
      },
      exportItemRemove: function exportItemRemove(state, item) {
        var items = new Set([].concat(_toConsumableArray(state.exportItems)));
        items.delete(item);
        state.exportItems = Array.from(items);
      },
      updateExportButtonState: function updateExportButtonState(
        state,
        payload
      ) {
        state.exportButtonState = payload;
      }
    }
  });
}

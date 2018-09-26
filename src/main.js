import Vue from "vue";
import axios from "axios";
import createRouter from "@/routes";
import createStore from "@/store/store";
import App from "@/components/App";

Vue.config.devtools = true;
Vue.config.productionTip = false;

//Create globals
var eventBus = new Vue();
//var _ = window._;

//Default request config
axios.defaults.baseURL = "https://storage.googleapis.com/dedashboard/mockdata";
axios.defaults.headers.common["Accept"] =
  "application/json;odata=verbose;charset=utf-8";

//loadTaxonomies(undefined); //TODO: Lazy load taxonomies and hold in memory only those that are visible in multi-view

/* Create Vue app for each component instance */
var x = document.querySelectorAll(".taxonomy_component");
for (var i = 0; i < x.length; i++) {
  const store = createStore(i);
  new Vue({
    el: x[i],
    store: store,
    router: createRouter(store),
    data: {
      appId: i
    },
    components: { App: App },
    template: "<App :appId='appId'></App>"
  });
}

"use strict";

Vue.config.productionTip = false;

//Create globals
var eventBus = new Vue();
//var _ = window._;

var router = new VueRouter({
  routes: routes
});

loadTaxonomies(undefined); //TODO: Lazy load taxonomies and hold in memory only those that are visible in multi-view

/* Create Vue app for each component instance */
var x = document.querySelectorAll(".taxonomy_component");
for (var i = 0; i < x.length; i++) {
  new Vue({
    el: x[i],
    router: router,
    store: window.createStore(i),
    data: {
      appId: i
    },
    components: { App: App },
    template: "<App :appId='appId'/>"
  });
}

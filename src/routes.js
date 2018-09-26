import Vue from "vue";
import Router from "vue-router";
import StackStart from "@/components/StackStart";

Vue.use(Router);

const routes = [
  {
    name: "Home",
    // Wildcard path
    path: "*",
    // Specify the component to be rendered for this route
    component: StackStart
  }
];

export default function createRouter(store) {
  var router = new Router({
    //mode: "history",
    routes: routes
  });

  return router;
}

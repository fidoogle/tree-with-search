import _ from "lodash";

/*** LOCAL MODULLE VARIABLES ***/
var DASH_TAXONOMY = [];
var TREE_DATA = {};
var GROUPED_DOTS = {};
var KEYS = [];

var MAXLEVELS = 7; //maximum # of expected levels in data, could be set high to ensure all possible levels are covered
var URL_prefx = "//team.usaa.com/sites/itpx/";
var URL_suffix =
  "/Web/Lists/GetByTitle('CTDO Taxonomy')/items?$select=ID,Description,Business_x0020_Needs,Title,Numbering,Only%5Fx0020%5Ffor%5Fx0020%5FLevel%5Fx0020&$top=1000";
var URL_suffix_with_Owner =
  "/Web/Lists/GetByTitle('CTDO Taxonomy')/items?$select=ID,Description,Business_x0020_Needs,Title,Numbering,Owner/Title,Only%5Fx0020%5Ffor%5Fx0020%5FLevel%5Fx0020&$expand=Owner&$top=1000";

var TREE_SAMPLE = {
  Numbering: "CTDO",
  Title: "Unavailable....could not load data",
  Level: "root",
  Nodes: []
};

/*** EXPORTED APP GLOBALS ***/
var VIEW_IDS = [0]; //Used to track what views are open. Zero always open

var ENDPOINTS = {
  PROD: {
    area: "CTDO",
    name: "PROD",
    url: URL_prefx + "_api" + URL_suffix_with_Owner,
    //testUrl: "https://storage.googleapis.com/dedashboard/mockdata/tax-prod.json",
    testUrl: "",
    actionItems:
      URL_prefx +
      "Lists/CTDO_Tax_Action_Items/CTDOTaxonomyView.aspx#InplviewHash7b0bf9e3-afa9-42b7-a02c-7ce90112017b",
    treeData: {},
    flatData: []
  },

  DEV: {
    area: "CTDO",
    name: "DEV",
    url: URL_prefx + "dev/itpx/_api" + URL_suffix_with_Owner,
    //testUrl: "https://storage.googleapis.com/dedashboard/mockdata/tax-dev.json",
    testUrl: "",
    actionItems:
      URL_prefx +
      "dev/itpx/Lists/CTDO%20Tax%20Action%20Items/CTDOTaxonomyView.aspx#InplviewHash4d758799-76ee-44f7-82f4-99785c3a9fab",
    treeData: {},
    flatData: []
  }
};

var CURRENT_TAXONOMY;

function loadTaxonomies() {
  _.each(ENDPOINTS, function(val, key) {
    getTaxonomy(val, false);
  });
}

export function showCountsForLevel(Counts, level) {
  var zeroDefaults = {
    level1: 0,
    level2: 0,
    level3: 0,
    level3m: 0,
    level4: 0,
    level5: 0,
    level6: 0
  };
  try {
    return _.merge(zeroDefaults, Counts);
  } catch (e) {
    return zeroDefaults;
  }
}

function updateViewIds() {
  if (!_.includes(VIEW_IDS, 1)) {
    VIEW_IDS.push(1);
  } else if (!_.includes(VIEW_IDS, 2)) {
    VIEW_IDS.push(2);
  } else if (!_.includes(VIEW_IDS, 3)) {
    VIEW_IDS.push(3);
  }
}

export function processData(data, archive) {
  if (archive) {
    DASH_TAXONOMY = sortNumbering(data);
  } else {
    DASH_TAXONOMY = sortNumbering(data.d.results);
  }
  GROUPED_DOTS = _.groupBy(DASH_TAXONOMY, groupByDots);
  startTree();
  //console.log("TREE_DATA:", TREE_DATA);
  return {
    treeData: TREE_DATA,
    flatData: DASH_TAXONOMY
  };
}

//Sort data by Numbering of type 1.3, 1.1, 1.2, 1.1.3, 1.2.4, etc, where each dot separates the levels.
//Assumes each level is an integer. Data may be of type ['1.3', '1.1'] or [{... Numbering: '1.3'}, {... Numbering: '1.1'}]
//Externally used in Store and here internally
function sortNumbering(data) {
  return data.sort(sortNumberingBy);
}

/*** LOCAL MODULE FUNCTIONS ***/
function getTaxonomy(taxonomy, test) {
  var url = taxonomy.url;
  if (test) url = taxonomy.testUrl;

  window
    .axios({
      url: url,
      method: "get",
      headers: { accept: "application/json;odata=verbose" }
    })
    .then(function(response) {
      var result = processData(response.data); //destructure returned object
      taxonomy.treeData = result.treeData;
      taxonomy.flatData = result.flatData;

      releaseMemory();
    })
    .catch(function(error) {
      console.warn(error);
      if (test) {
        console.warn(error);
        taxonomy.treeData = TREE_SAMPLE;
        taxonomy.flatData = [];
      } else {
        console.warn("loading test data...");
        getTaxonomy(taxonomy, true);
      }
    });
}

function releaseMemory() {
  DASH_TAXONOMY = null;
  TREE_DATA = null;
  GROUPED_DOTS = null;
  KEYS = null;
}
//Polyfill for startsWith for older browsers like IE
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

//Define compare expression up to MAXLEVELS
var compareExp = "0"; //start with zero (false) to prevent a trailing || at end
for (var i = 0; i < MAXLEVELS; i++) {
  compareExp += "|| num1[" + i + "] - num2[" + i + "]";
}

function sortNumberingBy(a, b) {
  var aLevels;
  var bLevels;

  if (a.Numbering) aLevels = a.Numbering.split(".");
  else if (a.Process && a.Process.Numbering)
    aLevels = a.Process.Numbering.split(".");
  //For BDDS
  else aLevels = a.split(".");
  if (b.Numbering) bLevels = b.Numbering.split(".");
  else if (b.Process && b.Process.Numbering)
    bLevels = b.Process.Numbering.split(".");
  //For BDDS
  else bLevels = b.split(".");

  var num1 = [];
  var num2 = [];

  //Pad levels with zeros if level is not present
  for (var i = 0; i < MAXLEVELS; i++) {
    if (aLevels[i]) {
      num1[i] = parseInt(aLevels[i], 10);
    } else {
      num1[i] = 0;
    }
    if (bLevels[i]) {
      num2[i] = parseInt(bLevels[i], 10);
    } else {
      num2[i] = 0;
    }
  }

  return eval(compareExp);
}

function groupByDots(item) {
  return item.Numbering.split(".").length - 1;
}

function levelOfItem(item) {
  var level = item.Numbering.split(".").length;
  if (level === 3) {
    if (
      item.MemberExperience === "Member Experience" ||
      item.Only_x0020_for_x0020_Level_x0020 === "Member Experience"
    ) {
      return "level3m";
    } else return "level3";
  } else {
    return "level" + level; //In case there's more than 4 levels, key will be "level#"
  }
}

function startTree() {
  KEYS = Object.keys(GROUPED_DOTS);
  TREE_DATA = GROUPED_DOTS[KEYS[0]];
  buildTree(1, TREE_DATA);
  GROUPED_DOTS = null; //release from memory
  KEYS = null; //release from memory
  var childNums = _.map(DASH_TAXONOMY, function(item) {
    //create a smaller new object from DASH_TAXONOMY for counting
    return {
      Numbering: item.Numbering,
      MemberExperience: item.Only_x0020_for_x0020_Level_x0020
        ? item.Only_x0020_for_x0020_Level_x0020
        : ""
    };
  });

  TREE_DATA = {
    Numbering: "CTDO",
    Title: "Taxonomy",
    Level: "root",
    Nodes: TREE_DATA,
    Counts: _.countBy(childNums, levelOfItem)
  };
  combineCounts(TREE_DATA.Nodes);
}

//Builds a tree structure of parent/children from a pre-sorted & flat numbering heirarchy
//Supports N levels. Recursively called until Nodes exhausted
function buildTree(i, tree) {
  _.each(tree, function(val, key) {
    try {
      var Nodes = _.filter(GROUPED_DOTS[KEYS[i]], function(item) {
        return item.Numbering.startsWith(val.Numbering + ".");
      });

      if (Nodes.length > 0) {
        val = Object.assign(val, { Nodes: Nodes });
        buildTree(i + 1, Nodes);
      } else {
        //val = Object.assign(val, {"Nodes":[]});
      }
      val = Object.assign(val, { Level: levelOfItem(val) });
    } catch (e) {} //if error, tree will be untouched
  });
}

//Combines counts of parent with counts of children.
//Assigns counts to a new property Counts on each level's object.
//Supports up to 5 levels.
function combineCounts(tree) {
  _.each(tree, function(val0, key0) {
    var acc0 = [];

    _.each(val0.Nodes, function(val1, key1) {
      var acc1 = [];

      _.each(val1.Nodes, function(val2, key2) {
        var acc2 = [];

        _.each(val2.Nodes, function(val3, key3) {
          var childNums = _.map(val3.Nodes, function(item) {
            return {
              Numbering: item.Numbering,
              MemberExperience: item.Only_x0020_for_x0020_Level_x0020
                ? item.Only_x0020_for_x0020_Level_x0020
                : ""
            };
          });
          val3 = Object.assign(val3, {
            Counts: _.countBy(childNums, levelOfItem)
          });
          acc2 = acc2.concat(childNums);
        });

        var childNums = _.map(val2.Nodes, function(item) {
          return {
            Numbering: item.Numbering,
            MemberExperience: item.Only_x0020_for_x0020_Level_x0020
              ? item.Only_x0020_for_x0020_Level_x0020
              : ""
          };
        });
        childNums = childNums.concat(acc2);
        val2 = Object.assign(val2, {
          Counts: _.countBy(childNums, levelOfItem)
        });
        acc1 = acc1.concat(childNums);
      });

      var childNums = _.map(val1.Nodes, function(item) {
        return {
          Numbering: item.Numbering,
          MemberExperience: item.Only_x0020_for_x0020_Level_x0020
            ? item.Only_x0020_for_x0020_Level_x0020
            : ""
        };
      });
      childNums = childNums.concat(acc1);
      val1 = Object.assign(val1, { Counts: _.countBy(childNums, levelOfItem) });
      acc0 = acc0.concat(childNums);
    });

    var childNums = _.map(val0.Nodes, function(item) {
      return {
        Numbering: item.Numbering,
        MemberExperience: item.Only_x0020_for_x0020_Level_x0020
          ? item.Only_x0020_for_x0020_Level_x0020
          : ""
      };
    });
    childNums = childNums.concat(acc0);
    val0 = Object.assign(val0, { Counts: _.countBy(childNums, levelOfItem) });
  });
}

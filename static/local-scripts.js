/* Code that interacts with local Sharepoint page, etc 
 * MUST BE COPIED TO PROD and REFERENCED FROM PROD
*/

//Javascript files served uniquely to PROD, DEV, and SANDBOXES. Additional urls can be added as properties in each object, if needed.
var URL_prefix = "../";

var ENDPNTS_PROD = {
  prefix: "../",
  actionItems:
    "Lists/CTDO_Tax_Action_Items/CTDOTaxonomyView.aspx#InplviewHash7b0bf9e3-afa9-42b7-a02c-7ce90112017b",
  export: "SiteAssets/CTDO%20TaxonomyV2/script-refs/services/ExportForChrome.js"
};

var ENDPNTS_DEV = {
  prefix: "../",
  actionItems:
    "Lists/CTDO%20Tax%20Action%20Items/CTDOTaxonomyView.aspx#InplviewHash4d758799-76ee-44f7-82f4-99785c3a9fab",
  export: "SiteAssets/CTDO%20TaxonomyV2/script-refs/services/ExportForChrome.js"
};

var ENDPNTS_SANDBOX1 = {
  prefix: "../",
  actionItems:
    "taxonomies/sandbox1/Lists/CTDO%20Tax%20Action%20Items/CTDOTaxonomyView.aspx#InplviewHashfdea1c95-6ae6-4aaf-8352-092ed35c5d30",
  export: "SiteAssets/CTDO%20TaxonomyV2/script-refs/services/ExportForChrome.js"
};

var ENDPNTS_SANDBOX2 = {
  prefix: "../",
  actionItems:
    "taxonomies/sandbox2/Lists/CTDO_Tax_Action_Items/CTDOTaxonomyView.aspx#InplviewHash55df84e9-dbe0-468c-b9d9-5832eee6dda9",
  export: "SiteAssets/CTDO%20TaxonomyV2/script-refs/services/ExportForChrome.js"
};

//Determine what ENDPNTS to use
var ENDPNTS = ENDPNTS_PROD; //default to PROD

if (window.location.href.indexOf("/dev/") != -1) {
  ENDPNTS = ENDPNTS_DEV;
} else if (window.location.href.indexOf("/sandbox1") != -1) {
  ENDPNTS = ENDPNTS_SANDBOX1;
} else if (window.location.href.indexOf("/sandbox2") != -1) {
  ENDPNTS = ENDPNTS_SANDBOX2;
}

var library;

//Inject correct Excel Export Code for non-IE browsers (Chrome)
if (window.navigator.userAgent.indexOf("MSIE ") < 0) {
  // If NOT Internet Explorer

  //export libraries for non-IE browsers, shared across DEV, PROD, SANDBOXES
  library = document.createElement("script");
  library.src =
    "../SiteAssets/CTDO%20TaxonomyV2/script-refs/static/exceljs.min.js";
  library.async = false; //maintains order of loading see https://www.html5rocks.com/en/tutorials/speed/script-loading/
  document.getElementById("app-scripts").appendChild(library);

  //next library
  library = document.createElement("script");
  library.src =
    "../SiteAssets/CTDO%20TaxonomyV2/script-refs/static/file-saver.min.js";
  library.async = false;
  document.getElementById("app-scripts").appendChild(library);

  //next script
  library = document.createElement("script");
  library.src = ENDPNTS.prefix + ENDPNTS.export;
  library.async = false;
  document.getElementById("app-scripts").appendChild(library);
}

//function to open pages in a dialog
function openInDialog(
  dlgWidth,
  dlgHeight,
  dlgAllowMaximize,
  dlgShowClose,
  needCallbackFunction,
  pageUrl
) {
  var options = {
    url: pageUrl,
    width: dlgWidth,
    height: dlgHeight,
    allowMaximize: dlgAllowMaximize,
    showClose: dlgShowClose
  };

  if (needCallbackFunction) {
    options.dialogReturnValueCallback = Function.createDelegate(
      null,
      CloseDialogCallback
    );
  }
  SP.SOD.execute(
    "sp.ui.dialog.js",
    "SP.UI.ModalDialog.showModalDialog",
    options
  );
}

function CloseDialogCallback(dialogResult, returnValue) {
  //if user click on OK or Save
  if (dialogResult == SP.UI.DialogResult.OK) {
    // refresh parent page
    SP.SOD.execute(
      "sp.ui.dialog.js",
      "SP.UI.ModalDialog.RefreshPage",
      SP.UI.DialogResult.OK
    );
  } else if (dialogResult == SP.UI.DialogResult.cancel) {
    // if user click on Close or Cancel
    // Do Nothing or add any logic you want
  } else {
    //alert("else " + dialogResult);
  }
}

function closeNav() {
  if (document.getElementById("dvPopupMain"))
    document.getElementById("dvPopupMain").style.display = "none";
  if (document.getElementById("dvPopdvPopupActionItemupMain"))
    document.getElementById("dvPopupActionItem").innerHTML = "";
}

function getActionItem(numbering, title) {
  if (document.getElementById("dvPopupActionItem"))
    document.getElementById("dvPopupActionItem").innerHTML =
      '<h3 id="actionItemTitle">Action Items</h3><iframe id="dvPopupActionItemIframe" src="' +
      ENDPNTS.prefix +
      ENDPNTS.actionItems +
      '" style="width:90%; min-width:700px; height:60vh;"></iframe>';

  if (document.getElementById("dvPopupMain"))
    document.getElementById("dvPopupMain").style.display = "block";

  var NumberTitle = numbering + " " + title;

  if (document.getElementById("NumTitle"))
    document.getElementById("NumTitle").innerHTML = NumberTitle;

  if (document.getElementById("actionItemTitle"))
    document.getElementById("actionItemTitle").innerHTML =
      "Action Items - " + NumberTitle;

  var pr = document.querySelector("#WebPartWPQ5 iframe");
  if (pr)
    pr.setAttribute(
      "src",
      ENDPNTS.prefix +
        ENDPNTS.actionItems +
        "=FilterField1%3Dnumbering-FilterValue1%3D" +
        numbering
    );

  var pAI = document.querySelector("#dvPopupActionItem iframe");
  if (pAI)
    pAI.setAttribute(
      "src",
      ENDPNTS.prefix +
        ENDPNTS.actionItems +
        "=FilterField1%3Dnumbering-FilterValue1%3D" +
        numbering
    );
}

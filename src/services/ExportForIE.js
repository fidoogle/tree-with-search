//This code for exporting excel files works in all browsers, but we limit its use to Internet Explorer
//The exported format is not as nice as the ExportForChrome.js


function exportToExcel(exportedItems, treeData) { //https://tableexport.v5.travismclarke.com/#tableexport
  var tableId = 'excelTable';
  buildExportTable(tableId, exportedItems, treeData);
  var ExportButtons = document.getElementById(tableId);

  var ExportInstance = new TableExport(ExportButtons, {
    formats: ['xls', 'csv'],
    exportButtons: false,
    filename: 'CTDO'
  });

  var XLS = ExportInstance.CONSTANTS.FORMAT.XLS;

  //                                          // "id"  // format
  var ExportData = ExportInstance.getExportData()[tableId][XLS];

  //                   // data          // mime              // name              // extension
  ExportInstance.export2file(ExportData.data, ExportData.mimeType, ExportData.filename, ExportData.fileExtension);

}

function emptyCells(num) {
  var html = '';
  for (var i = 0; i < num; i++) {
    html += '<td></td>';
  }
  return html;
}

function buildExportHeaders() {
  var html = '';
  var columns = { //keys with value definitions for fyi
    "CoSA": "CTDO",

    "Need": "Dash Area [Tag], 2 Digit [Business Need]",

    "Sr. Experience/Business Deliverable Owner": "",
    "Exp ID": "Dash Area [Tag], Digit [Numbering]",

    "Experience/Business Deliverable Name": "Digit Name [Title]",
    "Experience/Business Deliverable Output": "",
    "Classification": "Member Experience, Employee Experience, or Buiness Delivery",

    "Experience/Deliverable Owner": "",
    "Process ID": "Dash Area [Tag], Digit [Numbering]",

    "Process Name": "Digit Name [Title]",

    "Channel": "",
    "Process Description": "[Description]",
    "Process Owner": "",
    "Process Team": "Dash Area [Title]",

    "Process Subject Matter Experts": "",
    "Experience/ Deliverable Team": "",
    "Member Facing": "Default N (Will update exception)",

  }
  var headers = Object.keys(columns); //notice only using keys

  headers.forEach(function (value) {
    html += '<th class="tableexport-string">' + value + '</th>';
  });

  return html;
}

function buildExportTable(tableId, exportedItems, treeData) {
  var html = '<table id="' + tableId + '" border="1">';
  html += '<thead>';
  html += '<tr>';
  html += buildExportHeaders();
  html += '</tr>';
  html += '</thead>';
  html += '<tbody>';

  //Build Rows From Selected
  exportedItems.forEach(function (item) {
    html += buildLevelRows(item, treeData);
  });

  html += ' </tbody>';
  html += '</table>';
  
  document.getElementById('exportExcelForIE').innerHTML = html;
}


function buildLevelRows(numbering, treeData) { //builds properly formatted table rows for level [i,j]
  var rowspan;

  //get data structure for item
  var exportedParent = _.find(treeData.Nodes, { Numbering: numbering.split(".")[0] });
  var exportedItem = _.find(exportedParent.Nodes, { Numbering: numbering });

  var html = '<tr>';
  html += '<td>CTDO</td>';
  html += '<td class="tableexport-string">' + (exportedItem.Tag || '') + ', ' + exportedItem.Numbering + ' ' + (exportedItem.Business_x0020_Needs||'') + '</td>';

  if (exportedItem.Nodes) {

    exportedItem.Nodes.forEach(function (level3item, k) {
      rowspan = exportedItem.Nodes[k].Counts.Process || 0;
      rowspan = parseInt(rowspan, 10);
      html += emptyCells(1);
      if (k === 0) { //first
        if (rowspan > 0) {
          html += '<td class="tableexport-string">' + (level3item.Tag || '') + ', ' + level3item.Numbering + '</td>';
          //html+=emptyCells(1);
          html += '<td class="tableexport-string">' + level3item.Title + '</td>';
          html += '<td class="tableexport-string">' + (level3item.BD_x002f_Exp_x0020_Output || '') + '</td>'; //emptyCells(1);
          html += '<td>' + (level3item.Only_x0020_for_x0020_Level_x0020 || 'Business Deliverable') + '</td>';
          html += emptyCells(1);

          if (exportedItem.Nodes[k].Nodes) {
            exportedItem.Nodes[k].Nodes.forEach(function (level4item, m) {
              if (m === 0) { //first
                html += '<td class="tableexport-string">' + (level4item.Tag || '') + ', ' + level4item.Numbering + '</td>';
                //html+=emptyCells(1);
                html += '<td class="tableexport-string">' + level4item.Title + '</td>';
                html += emptyCells(1);
                html += '<td class="tableexport-string">' + (level4item.Description || '') + '</td>';//remove strange underscore in excel
                html += emptyCells(1);
                html += '<td></td>'; //Chief Digital Office
                //html+='<td></td>'; //Yes
                //html+='<td></td>'; //Digital Content Development
                html += emptyCells(1);
                html += '<td></td>';
                html += '<td>N</td>';
                html += '</tr>';
              } else {
                html += '<tr>';
                html += emptyCells(5);
                html += '<td class="tableexport-string">' + (level3item.BD_x002f_Exp_x0020_Output || '') + '</td>'; //emptyCells(1);
                html += emptyCells(2);
                html += '<td class="tableexport-string">' + (level4item.Tag || '') + ', ' + level4item.Numbering + '</td>';
                //html+=emptyCells(1);
                html += '<td class="tableexport-string">' + level4item.Title + '</td>';//careful
                html += emptyCells(1);
                html += '<td class="tableexport-string">' + (level4item.Description || '') + '</td>';//remove strange underscore in excel
                html += emptyCells(1);
                html += '<td></td>'; //Chief Digital Office
                //html+='<td></td>'; //Yes
                //html+='<td></td>'; //Digital Content Development
                html += emptyCells(1);
                html += '<td></td>';
                html += '<td>N</td>';
                html += '</tr>';
              }
            });
          }

        } else { //no level4items
          html += '<td class="tableexport-string">' + (level3item.Tag || '') + ', ' + level3item.Numbering + '</td>';
          //html+=emptyCells(1);
          html += '<td class="tableexport-string">' + level3item.Title + '</td>';
          html += '<td class="tableexport-string">' + (level3item.BD_x002f_Exp_x0020_Output || '') + '</td>'; //emptyCells(1);
          html += '<td>' + (level3item.Only_x0020_for_x0020_Level_x0020 || 'Business Deliverable') + '</td>';
          html += emptyCells(2);//maybe more
          html += '</tr>';
        }
      } else { //other
        html += '<tr>';
        html += emptyCells(3);
        html += '<td class="tableexport-string">' + (level3item.Tag || '') + ', ' + level3item.Numbering + '</td>';
        //html+=emptyCells(1);
        html += '<td class="tableexport-string">' + level3item.Title + '</td>';
        html += '<td class="tableexport-string">' + (level3item.BD_x002f_Exp_x0020_Output || '') + '</td>'; //emptyCells(1);
        html += '<td>' + (level3item.Only_x0020_for_x0020_Level_x0020 || 'Business Deliverable') + '</td>';
        html += emptyCells(1);

        if (exportedItem.Nodes[k].Nodes) {
          exportedItem.Nodes[k].Nodes.forEach(function (level4item, m) {
            if (m === 0) { //first
              html += '<td class="tableexport-string">' + (level4item.Tag || '') + ', ' + level4item.Numbering + '</td>';
              //html+=emptyCells(1);
              html += '<td class="tableexport-string">' + level4item.Title + '</td>';
              html += emptyCells(1);
              html += '<td class="tableexport-string">' + (level4item.Description || '') + '</td>';//remove strange underscore in excel
              html += emptyCells(1);
              html += '<td></td>'; //Chief Digital Office
              //html+='<td></td>'; //Yes
              //html+='<td></td>'; //Digital Content Development
              html += emptyCells(1);
              html += '<td></td>';
              html += '<td>N</td>';
              html += '</tr>';
            } else {
              //html+='<tr>';
              html += emptyCells(5);
              html += '<td class="tableexport-string">' + (level3item.BD_x002f_Exp_x0020_Output || '') + '</td>'; //emptyCells(1);
              html += emptyCells(2);
              html += '<td class="tableexport-string">' + (level4item.Tag || '') + ', ' + level4item.Numbering + '</td>';
              //html+=emptyCells(1);
              html += '<td class="tableexport-string">' + level4item.Title + '</td>';
              html += emptyCells(1);
              html += '<td class="tableexport-string">' + (level4item.Description || '') + '</td>';//remove strange underscore in excel
              html += emptyCells(1);
              html += '<td></td>'; //Chief Digital Office
              //html+='<td></td>'; //Yes
              //html+='<td></td>'; //Digital Content Development
              html += emptyCells(1);
              html += '<td></td>';
              html += '<td>N</td>';
              html += '</tr>';
            }
          });
        }

      }
    });

  } else {
    html += emptyCells(24);
    html += '</tr>';
  }

  return html;
}

//This code works only in non-IE browsers, like Chrome

function exportToExcel(exportedItems, treeData) {
  //Excel export from https://www.npmjs.com/package/exceljs

  var workbook = new ExcelJS.Workbook();

  var worksheet = workbook.addWorksheet("CTDO"); //Can include color {properties:{tabColor:{argb:'FF00FF00'}}}

  worksheet.columns = buildExportHeaders();

  formatHeaders(worksheet);

  //Build Rows From Selected
  exportedItems.forEach(function(item) {
    buildLevelRows(worksheet, item, treeData);
  });

  //end with empty row to help merging determine end of data
  worksheet.addRow({
    A: " ",
    B: " ",
    C: " ",
    D: " ",
    E: " ",
    F: " ",
    G: " ",
    H: " ",
    I: " ",
    J: " ",
    K: " ",
    L: " ",
    M: " ",
    N: " ",
    O: " ",
    P: " ",
    Q: " "
  });

  mergeCells(worksheet, "A");
  mergeCells(worksheet, "B");
  mergeCells(worksheet, "C", "B");
  mergeCells(worksheet, "D");
  mergeCells(worksheet, "E", "D");
  mergeCells(worksheet, "F", "E");
  mergeCells(worksheet, "G", "E");
  mergeCells(worksheet, "H", "E");

  workbook.xlsx.writeBuffer().then( function(data) {//cannot use writeFile without nodejs, https://github.com/guyonroche/exceljs/issues/299
      var blob = new Blob( [data], {type: "application/octet-stream"} );
      saveAs( blob, 'CTDO.xlsx');
  });
}

function buildExportHeaders() {
  //makes keys same as column letters
  return [
    { key: "A", width: 10, header: "CoSA" },
    { key: "B", width: 10, header: "Need" },
    { key: "C", width: 30, header: "Sr. Experience/Deliverable Owner" },
    { key: "D", width: 15, header: "Exp ID" },
    { key: "E", width: 32, header: "Experience/Business Deliverable Name" },
    { key: "F", width: 32, header: "Experience/Business Deliverable Output" },
    { key: "G", width: 16, header: "Classification" },
    { key: "H", width: 30, header: "Experience/Deliverable Owner" },
    { key: "I", width: 20, header: "Process ID" },
    { key: "J", width: 15, header: "Process Name" },
    { key: "K", width: 10, header: "Channel" },
    { key: "L", width: 20, header: "Process Description" },
    { key: "M", width: 17, header: "Process Owner" },
    { key: "N", width: 40, header: "Process Team" },
    { key: "O", width: 32, header: "Process Subject Matter Experts" },
    { key: "P", width: 32, header: "Experience/Deliverable Team" },
    { key: "Q", width: 16, header: "Member Facing" }
  ];
}

function formatHeaders(ws) {
  var cells = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q"
  ];
  //Colors from http://cloford.com/resources/colours/namedcol.htm
  cells.forEach(function(value, index) {
    //Column Titles
    ws.getCell(value + "1").alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center"
    };
    ws.getCell(value + "1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFC0C0C0" }
    };
    ws.getCell(value + "1").border = {
      top: { style: "thick" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    };
    ws.getCell(value + "1").font = {
      name: "Arial",
      color: { argb: "FF191970" },
      family: 2,
      size: 10,
      bold: true
    };
  });
}

//Merges cells with adjacent equal values in column specified by letter
//If "model" is passed, then column "letter" is merged just like "model"
function mergeCells(ws, letter, model) {
  var newValue = 0;
  var startRow = 2; //skip Header row
  var column = ws.getColumn(letter);

  if (model) {
    column = ws.getColumn(model);
  }

  column.eachCell(function(cell, rowNumber) {
    if (rowNumber > 1 && newValue != cell.value) {
      if (rowNumber - 1 > startRow) {
        ws.mergeCells(letter + startRow + ":" + letter + (rowNumber - 1));
      }
      formatCell(ws, letter, startRow);
      newValue = cell.value;
      startRow = rowNumber;
    }
  });
}

function formatCell(ws, letter, startRow) {
  var darkBlue = ["A", "B", "C", "D", "E"]; //dark blue cells
  var lightBlue = ["F", "G", "H", "I", "J", "K"]; //light blue cells

  //Common styles
  ws.getCell(letter + startRow).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center"
  };
  ws.getCell(letter + startRow).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };

  if (_.includes(darkBlue, letter)) {
    cellStyles(ws, "FF4682B4", letter, startRow);
  } else if (_.includes(lightBlue, letter)) {
    cellStyles(ws, "FFB0C4DE", letter, startRow);
  }
}

function cellStyles(ws, bgColor, letter, startRow) {
  //Colors from http://cloford.com/resources/colours/namedcol.htm
  ws.getCell(letter + startRow).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: bgColor }
  };
  ws.getCell(letter + startRow).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };
  ws.getCell(letter + startRow).font = {
    name: "Arial",
    color: { argb: "FFFFFFFF" },
    family: 2,
    size: 10,
    bold: true
  };
}

function defaultRowValues() {
  var val = " ";
  return {
    A: "CTDO",
    B: val,
    D: val,
    E: val,
    F: val,
    G: val,
    H: val,
    I: val,
    J: val,
    K: val,
    L: val,
    M: val,
    N: val,
    O: val,
    P: val,
    Q: "N"
  };
}

function buildLevelRows(ws, numbering, treeData) {
  //builds properly formatted table rows for level [i,j]

  var rowObj = Object.assign({}, defaultRowValues());
  var rowspan;

  //get data structure for item
  var exportedParent = _.find(treeData.Nodes, {
    Numbering: numbering.split(".")[0]
  });
  var exportedItem = _.find(exportedParent.Nodes, { Numbering: numbering });

  Object.assign(rowObj, {
    B:
      (exportedItem.Tag || "") +
      ", " +
      exportedItem.Numbering +
      " " +
      (exportedItem.Business_x0020_Needs || "")
  });

  if (exportedItem.Nodes) {
    exportedItem.Nodes.forEach(function(level3item, k) {
      rowspan = exportedItem.Nodes[k].Counts.level4 || 0;
      rowspan = parseInt(rowspan, 10);

      if (k === 0) {
        //first
        if (rowspan > 0) {
          Object.assign(rowObj, {
            D: (level3item.Tag || "") + ", " + level3item.Numbering
          });
          Object.assign(rowObj, { E: level3item.Title });
          Object.assign(rowObj, {
            F: level3item.BD_x002f_Exp_x0020_Output || ""
          });
          Object.assign(rowObj, {
            G:
              level3item.Only_x0020_for_x0020_Level_x0020 ||
              "Business Deliverable"
          });

          if (exportedItem.Nodes[k].Nodes) {
            exportedItem.Nodes[k].Nodes.forEach(function(level4item, m) {
              if (m === 0) {
                //first
                Object.assign(rowObj, {
                  I: (level4item.Tag || "") + ", " + level4item.Numbering
                });
                Object.assign(rowObj, { J: level4item.Title });
                Object.assign(rowObj, {
                  L: level4item.Description || ""
                }); //remove strange underscore in excel
                ws.addRow(rowObj);
              } else {
                Object.assign(rowObj, {
                  I: (level4item.Tag || "") + ", " + level4item.Numbering
                });
                Object.assign(rowObj, { J: level4item.Title });
                Object.assign(rowObj, {
                  L: level4item.Description || ""
                }); //remove strange underscore in excel
                ws.addRow(rowObj);
              }
            });
          }
        } else {
          //no level4items
          Object.assign(rowObj, {
            D: (level3item.Tag || "") + ", " + level3item.Numbering
          });
          Object.assign(rowObj, { E: level3item.Title });
          Object.assign(rowObj, {
            F: level3item.BD_x002f_Exp_x0020_Output || ""
          });
          Object.assign(rowObj, {
            G:
              level3item.Only_x0020_for_x0020_Level_x0020 ||
              "Business Deliverable"
          });
          ws.addRow(rowObj);
        }
      } else {
        //other

        Object.assign(rowObj, {
          D: (level3item.Tag || "") + ", " + level3item.Numbering
        });
        Object.assign(rowObj, { E: level3item.Title });
        Object.assign(rowObj, {
          F: level3item.BD_x002f_Exp_x0020_Output || ""
        });
        Object.assign(rowObj, {
          G:
            level3item.Only_x0020_for_x0020_Level_x0020 ||
            "Business Deliverable"
        });

        if (exportedItem.Nodes[k].Nodes) {
          exportedItem.Nodes[k].Nodes.forEach(function(level4item, m) {
            if (m === 0) {
              //first
              Object.assign(rowObj, {
                I: (level4item.Tag || "") + ", " + level4item.Numbering
              });
              Object.assign(rowObj, { J: level4item.Title });
              Object.assign(rowObj, {
                L: level4item.Description || ""
              }); //remove strange underscore in excel
              ws.addRow(rowObj);
            } else {
              Object.assign(rowObj, {
                I: (level4item.Tag || "") + ", " + level4item.Numbering
              });
              Object.assign(rowObj, { J: level4item.Title });
              Object.assign(rowObj, {
                L: level4item.Description || ""
              }); //remove strange underscore in excel
              ws.addRow(rowObj);
            }
          });
        } else {
          ws.addRow(rowObj);
        }
      }
    });
  } else {
    ws.addRow(rowObj);
  }
}

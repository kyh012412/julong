TreeGridLoaded ({ /* JSONP header, to be possible to load from xxx_Jsonp data source */ 
   "Cfg" : { "id": "GanttTree"   }, 
   "Cfg_2" : { "Group": "L", "GroupMain": "T", "Sort": "T"   },  // Groups by L column and displays tree in column T (Task / Subtask) 
   "Cfg_3" : { "NumberId": "1", "IdChars": "0123456789"   },  // Controls generation of new row ids 
   "Cfg_4" : { "ScrollLeftLap": "0"   },  // Saves horizontal scroll in Gantt to cookies 
   "Cfg_5" : { "GroupMoveFree": "2"   },  // Rows can be moved also as children to data rows, set it width DefParent and DefEmpty 
   "Cfg_6" : { "MaxHeight": "1"   },  // Maximizes height of the main tag 
   "Cfg_7" : { "DefaultDate": "5/1/2008"   },  // Default date in calendar for empty date 
   "Cfg_8" : { "LimitScroll": "23", "MinBodyRows": "6", "MinLeftWidth": "2000", "MinMidWidth": "160", "MinRightWidth": "450"   },   // Responsive design, for small windows sets NoVScroll and NoHScroll 
   "Cfg_9" : { "ImportRows": "3"   },  // Permits importing rows data from exported xlsx, accepts only xlsx exported by this sample 
   "Cfg_10" : { "ExportType": "Outline,ForceBorder,HideFiltered,HideGroupCols,Hidden,Hide,FixedRows,FixedCols,TreeGrid,ColNames,RangeComment,GroupRows"   },  // Settings for xlsx export, support also for importing xlsx back 
   "Def" : [ 
      { "Name": "Task", "Group": "1"   },  // The Default "Task" will be used for grouping 
      { "Name": "Task", "Expanded": "1", "Calculated": "1", "CalcOrder": "S,E,C,G"   },  // Group of task calculates summary of the tasks 
      { "Name": "Task", "SFormula": "minimum(min('S'),min('E'))"   },  // Gets the first start date from its children 
      { "Name": "Task", "EFormula": "maximum(max('S'),max('E'))"   },  // Gets the last end date from its children 
      { "Name": "Task", "CFormula": "ganttpercent('S','E','d')"   },  // Calculates average task completion from its children 
      { "Name": "Task", "GColor": "240,240,240"   },  // Changes background color 
      { "Name": "Task", "DButton": ""   },  // Cannot change dependency of group task 
      { "Name": "Task", "GGanttClass": "Group", "GGanttIcons": "1", "GGanttEdit": "0", "GGanttHover": "0"   },  // Gantt setting specific for Group rows, changes colors and restrict changes by a user 
      { "Name": "Task", "NoUpload": "1"   },  // Does not upload this row to the server 
      { "Name": "R", "DefParent": "Task"   },  // Changes the parent row to group row when it gets its first child 
      { "Name": "R", "DefEmpty": "R"   }   // Changes the parent row to data row when it looses its last child 
   ], 
   "Panel" : { "Copy": "7"   },  // Shows Add/Copy icon on left side panel 
   "LeftCols" : [ 
      { "Name": "id", "Width": "50", "Type": "Text", "CanEdit": "0"   }   // Row id, informational column 
   ], 
   "Cols" : [ 
      { "Name": "T", "Width": "180", "Type": "Text"   },  // Column Task / Section
      { "Name": "S", "Width": "80", "Type": "Date", "Format": "[y!=2008]yyyy, MMM dd;MMM dd"   },  // Column Start date
      { "Name": "E", "Width": "80", "Type": "Date", "Format": "[y!=2008]yyyy, MMM dd;MMM dd"   },  // Column End Date 
      { "Name": "C", "Width": "65", "Type": "Int", "Format": "##\\%;;0\\%"   },  // Column Complete 
      { "Name": "D", "Width": "70", "Type": "Text", "CanEdit": "0", "Button": "Defaults", "Defaults": "|*RowsColid*VariableDef", "Range": "1"   },  // Column dependencies (Next) 
      { "Name": "L", "Width": "150", "CanEdit": "0"   },  // Grouping levels definitions 
      { "Name": "L", "CanGroup": "2"   },  // Does not hide the column when is grouped by 
      { "Name": "L", "GroupChar": "/"   },  // The individual grouping level names are separated by '/' 
      { "Name": "L", "GroupEmpty": "0"   }   // Does not create groups for empty Levels 
   ], 
   "RightCols" : [ 
      // Gantt chart column, basic settings 
      { "Name": "G", "Type": "Gantt"   },  // Defines the Gantt column 
      { "Name": "G", "GanttStart": "S", "GanttEnd": "E", "GanttComplete": "C", "GanttDescendants": "D"   },  // Defines the source columns for Gantt 
      { "Name": "G", "GanttLastUnit": "d"   },  // The end date is the last day, not last date 
      { "Name": "G", "GanttUnits": "d", "GanttChartRound": "w", "GanttRight": "1"   },  // Defines the zoom settings 
      { "Name": "G", "GanttHeader1": "w#dddddd MMMM yyyy", "GanttHeader2": "d#ddddd", "GanttBackground": "w#1/6/2008~1/6/2008 0:01"   },  // Defines headers and background for the zoom 
      { "Name": "G", "GanttEdit": "Main,Dependency"   },  // Only main bar and dependency can be edited 
      { "Name": "G", "GanttSlack": "1"   }   // Calculates critical path 
   ], 
   "Header" : { "id": "ID", "T": "Task", "S": "Start", "E": "End", "C": "Com\u000Aplete", "G": "Gantt", "D": "Next", "L": "Tree Levels"   },  // Column captions 
   
   // Shows count of incorrect dependencies and on click corrects them 
   "Toolbar" : { "Styles": "2", "Formula": "ganttdependencyerrors(null,1)", "FormulaOnClick": "CorrectAllDependencies", "FormulaTip": "Click to correct the dependencies"   }, 

}) /* End of JSONP header */ 
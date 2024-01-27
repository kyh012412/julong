let _chart_data1;
let _chart_data2;
let _chart_data3;
$(document).ready(function() {
	$('#startDate').val(getYMD_pre(6));
	$('#endDate').val(getYMD());

//---------------------------
	$("#subCrawlingList").select2({
		multiple: true,
		dropdownParent: $("#subCrawlingList_p")
	});

    $("select").select2({
		placeholder: {
		id: '-1',
		text: '수집요청을 선택해주세요...'
		}
	});

	$.ajax({
		type: 'POST',
		url: '/crawlingcontrol/statistics/statistics' + '/crawlingListAjax',
		contentType: "application/json; charset=UTF-8",
	}).done(function(data) {
		if(data.message != undefined) {
			return;
		}
		data.forEach(item => {
			$("#subCrawlingList").append("<option value='"+item.crawlingKey+"'>"+item.siteName+"</option>");
		});
	}).fail(function() {
	});
//---------------------------
	search();
})

$(window).load(function () {

});

function search() {
	let subKeys = $('#subCrawlingList').val();
	let reSubKeys = "";
	if (subKeys != null && subKeys.length > 0) {
		reSubKeys = String(subKeys);
	}

	const _data = {
		startDate: $('#startDate').val()
		, endDate: $('#endDate').val()
		, subCrawlingList: reSubKeys
		, from: 0
		, size: 10
		, errorType : $('#errorType').val()
	};

	errorP1Ajax(_data); // 꺾은선
	errorP2Ajax(_data); // 막대->테이블
	errorP3Ajax(_data); // 파이
	errorListTable(_data);
}
$('#searchList').click(function(){
	search();
});

$('#resetPie').click(function(){
	$('#errorType').val('');
	search();
});

// 꺾은선 그래프 일자 클릭
$(document).on('click', $('#typeChart1').children('.highcharts-container ').children('.highcharts-root').children('.highcharts-series-group').children('.highcharts-markers').children('.highcharts-point'), function() {
	let valueStr = $(event.target).attr('aria-label'); // 형식 : 1. YYYY-MM-DD, 00,000.
	if(!valueStr || valueStr.indexOf('(') !== -1 || valueStr.indexOf('%') !== -1) return;
	let dateStr = valueStr.split(' ')[1].replace(',', '');
	$('#startDate').val(dateStr);
	$('#endDate').val(dateStr);
	search();
});

$('#searchExcel').click(function(){
	let subCrawlingList = $('#subCrawlingList').val();
	let selectedCrawlingKeys = "";
	if(subCrawlingList != null && subCrawlingList.length > 0) {
		selectedCrawlingKeys = subCrawlingList.join(",");
	}

	$.fileDownload(window.location.pathname+'/excel/download', {
		httpMethod: 'GET',
		data: {
			startDate: $("#startDate").val(),
			endDate: $("#endDate").val(),
			subCrawlingList: selectedCrawlingKeys
		},
		successCallback: function () {
			location.reload();
		},
		failCallback: function(response) {
			Swal.fire("엑셀 다운로드를 실패했습니다.", "", "error");
		}
	})

	// fnExcelReportP1("일자별 에러 발생수");
	// fnExcelReportP2("사이트 에러 발생수");
	// fnExcelReportP3("에러 유형별 발생수");
});

function fnDraw_p1(){
//console.log(_chart_data1);
	let i = 0, j = 0;
	let dataArray = [];
	let subKeys = $('#subCrawlingList').val();
	let reSubKeys_text = "";
	let bucketsYmdArray = null;

	if(subKeys != null && subKeys.length > 0 && _chart_data1.jsonListBuckets != null) {
	/*
		$('#subCrawlingList option:selected').each(function(index){
			if(reSubKeys_text != "") reSubKeys_text += ",";
			 reSubKeys_text += $(this).text();
		});
		reSubKeys_text = reSubKeys_text.substring(0,reSubKeys_text.length-1);
		let arr = reSubKeys_text.split(",");
		*/
		//-------------------
		let arr_nm = "";
		let bucketsLen = _chart_data1.jsonListBuckets.length;
		let bucketsLen1 = 0;
		let bucketsDataArray1;
		for(i = 0; i < bucketsLen; i++){
			bucketsLen1 = _chart_data1.jsonListBuckets[i].date_list.buckets.length;
			bucketsYmdArray = new Array(bucketsLen1);
			bucketsDataArray1 = new Array(bucketsLen1);
			for(j = 0; j < bucketsLen1; j++){
				bucketsYmdArray[j] = _chart_data1.jsonListBuckets[i].date_list.buckets[j].key_as_string;
				bucketsDataArray1[j] = _chart_data1.jsonListBuckets[i].date_list.buckets[j].doc_count;
			}
			//dataArray.push({"data":bucketsDataArray1, "name":arr[i]});
			arr_nm = getSitename(_chart_data1.jsonListBuckets[i].key);
			dataArray.push({"data":bucketsDataArray1, "name":arr_nm});
		}


		//----------------------
		let key_find = "";
		let key_chk = 0;
		$('#subCrawlingList option:selected').each(function(index){
			key_find = $(this).val();
			key_chk = 0;

			for(i = 0; i < bucketsLen; i++){
				if(key_find == _chart_data1.jsonListBuckets[i].key){
					key_chk = 1;
					//break;
				}
			}
			if(key_chk == 0){
				bucketsDataArray1 = new Array(bucketsLen1);
				for(j = 0; j < bucketsLen1; j++)
					bucketsDataArray1[j] = 0;

				dataArray.push({"data":bucketsDataArray1, "name":$(this).text()});
			}
		});

	}else{
		if(_chart_data1.jsonListBuckets != null) {
			let bucketsLen = _chart_data1.jsonListBuckets.length;
			bucketsYmdArray = new Array(bucketsLen);
			let bucketsDataArray = new Array(bucketsLen);
			for(i = 0; i < bucketsLen; i++){
				bucketsYmdArray[i] = _chart_data1.jsonListBuckets[i].key_as_string;
				bucketsDataArray[i] = _chart_data1.jsonListBuckets[i].doc_count;
			}
			dataArray.push({"data":bucketsDataArray, "name":"전체"});
		}
	}

	if(_chart_data1.jsonListBuckets.length == 0) {
		bucketsYmdArray = getDateRangeData($('#startDate').val(), $('#endDate').val()); 
		let bucketsLen = bucketsYmdArray.length;

		if(subKeys != null && subKeys.length > 0) {
			$('#subCrawlingList option:selected').each(function(index){
				bucketsDataArray = new Array(bucketsLen);
				for(i = 0; i < bucketsLen; i++){
					bucketsDataArray[i] = 0;
				}

				dataArray.push({"data":bucketsDataArray, "name":$(this).text()});
			});
		}else{
			let bucketsDataArray = new Array(bucketsLen);
			for(i = 0; i < bucketsLen; i++){
				bucketsDataArray[i] = 0;
				console.log(bucketsYmdArray[i]);
			}
			dataArray.push({"data":bucketsDataArray, "name":"전체"});
		}
	}

	let initChart_p1 = function(_data) {
		$('#typeChart1').highcharts({
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: bucketsYmdArray
				},
				yAxis: {
					title: {
						text: ''
					}
				},
				navigation: {
					buttonOptions: {
						enabled: false
					}
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					spline: {
						marker: {
							lineWidth: 1
						}
					},
					series: {
						label: {
							connectorAllowed: false
						}
					}
				},
				tooltip: {
					crosshairs: true,
					shared: true,
					headerFormat: '<strong style="font-size: 13px">{point.key}</strong><br/>',
				},
				series: dataArray,
				plotOptions: {
					series: {
						cursor: 'pointer',
						point: {
							events: {
								click: function() {
									//클릭이벤트!!!!!!
								}
							}
						}
					}
				}
			});
	};


	initChart_p1();
}

function fnDraw_p3(){
	let i = 0;
	let bucketsDataArray_p3 = [];
	var regexp = /\B(?=(\d{3})+(?!\d))/g;

	for(i = 0; i < _chart_data3.jsonListBuckets.length; i++){
		bucketsDataArray_p3.push({"y":Number(_chart_data3.jsonListBuckets[i].doc_count), "name":_chart_data3.jsonListBuckets[i].key});
	}
	let initChart_p3 = function(_data) {
	$('#typeChart3').highcharts({
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'pie'
				},
				title: {
					text: ''
				},
				legend: {
					align: 'right',
					verticalAlign: 'top',
					y: 10,
					layout: 'vertical',
					itemStyle: {
						fontWeight: 'normal',
						fontSize: '12px'
					}
				},
				tooltip: {
					headerFormat: '<strong style="font-size: 13px">{point.key}</strong><br/>',
					pointFormat: '<span style="font-size: 13px">{point.y} ({point.percentage:.1f}%)</span>'
				},
				accessibility: {
					point: {
						valueSuffix: '%'
					}
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						showInLegend: true,
						cursor: 'pointer',
						size: '100%',
						dataLabels: {
							fontWeight: 'normal',
							enabled: true,
							format: '<span style="font-weight: normal;"> {point.percentage:.1f}%, {point.y} </span>'
						}
					},
					series: {
						cursor: 'pointer',
						events: {
							click: function(event){
								let clickPoint = event.point;
								let pointName = clickPoint.name;
								$('#errorType').val(pointName);
								search();
							}
						}
					}
				},
				navigation: {
					buttonOptions: {
						enabled: false
					}
				},
				series: [{
					name: '',
					colorByPoint: true,
					data: bucketsDataArray_p3

				}]
			});
	};


	initChart_p3();
}

function getYMD(){
	let now = moment();
	return now.format('YYYY-MM-DD');
}

function getYMD_pre(d){
	let now = moment().subtract(d, 'days');
	return now.format('YYYY-MM-DD');
}

function http_remove(d){
//console.log(d);
	let p = d.indexOf("//");
	let s = d.substr(p+2, d.length);
//console.log(s);
	return s;
}

function getSitename(k){
    let s = "";
	$('#subCrawlingList option:selected').each(function(index){
		 if(k == $(this).val()){
			 s = $(this).text();
			 //break;
		 }
	});

	return s;
}


function getDateRangeData(param1, param2){  //param1은 시작일, param2는 종료일이다.
	let res_day = [];
 	let ss_day = new Date(param1);
   	let ee_day = new Date(param2);    	
	while(ss_day.getTime() <= ee_day.getTime()){
		let _mon_ = (ss_day.getMonth()+1);
		_mon_ = _mon_ < 10 ? '0'+_mon_ : _mon_;
		let _day_ = ss_day.getDate();
		_day_ = _day_ < 10 ? '0'+_day_ : _day_;
		res_day.push(ss_day.getFullYear() + '-' + _mon_ + '-' +  _day_);
		ss_day.setDate(ss_day.getDate() + 1);
   	}
   	return res_day;
}


function fnExcelReportP1(title) {
    let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text
            + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    tab_text = tab_text
            + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
    tab_text = tab_text + '<x:Name>'+title+'</x:Name>';
    tab_text = tab_text
            + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text
            + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
    tab_text = tab_text + "<table border='1px'>";
    //var exportTable = $('#' + id).clone();
    //exportTable.find('input').each(function(index, elem) {
    //    $(elem).remove();
    //});
	let i=0;
	let exportTable = '<thead>'
						+'<tr>'
							+'<th>수집요청</th>'
							+'<th>날짜</th>'
							+'<th>건수</th>'
						+'</tr>'
					+'</thead>'
					+'<tbody>';
	let subKeys = $('#subCrawlingList').val();
	if(subKeys != null && subKeys.length > 0 && _chart_data1.jsonListBuckets != null) {
		let bucketsLen = _chart_data1.jsonListBuckets.length;
		for(i = 0; i < bucketsLen; i++){
			let bucketsLen1 = _chart_data1.jsonListBuckets[i].date_list.buckets.length;
			for(j = 0; j < bucketsLen1; j++){
				exportTable += '<tr><td>'+getSitename(_chart_data1.jsonListBuckets[i].key)+'</td><td>'+_chart_data1.jsonListBuckets[i].date_list.buckets[j].key_as_string+'</td><td>'+_chart_data1.jsonListBuckets[i].date_list.buckets[j].doc_count+'</td></tr>';
			}
		}
	}else{
		if(_chart_data1.jsonListBuckets != null) {
			let bucketsLen = _chart_data1.jsonListBuckets.length;
			for(i = 0; i < bucketsLen; i++){
				exportTable += '<tr><td>전체</td><td>'+_chart_data1.jsonListBuckets[i].key_as_string+'</td><td>'+_chart_data1.jsonListBuckets[i].doc_count+'</td></tr>';
			}
		}
	}
	exportTable += '</tbody>';

    //tab_text = tab_text + exportTable.html();
    tab_text = tab_text + exportTable;
    tab_text = tab_text + '</table></body></html>';
    let data_type = 'data:application/vnd.ms-excel';
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf("MSIE ");
    let fileName = title + '.xls';
    //Explorer 환경에서 다운로드
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        if (window.navigator.msSaveBlob) {
            let blob = new Blob([ tab_text ], {
                type : "application/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, fileName);
        }
    } else {
        let blob2 = new Blob([ tab_text ], {
            type : "application/csv;charset=utf-8;"
        });
        let filename = fileName;
        let elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob2);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

function fnExcelReportP2(title) {
    let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text
            + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    tab_text = tab_text
            + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
    tab_text = tab_text + '<x:Name>'+title+'</x:Name>';
    tab_text = tab_text
            + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text
            + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
    tab_text = tab_text + "<table border='1px'>";
    //var exportTable = $('#' + id).clone();
    //exportTable.find('input').each(function(index, elem) {
    //    $(elem).remove();
    //});
	let i=0;
	let exportTable = '<thead>'
						+'<tr>'
							+'<th>사이트</th>'
							+'<th>건수</th>'
						+'</tr>'
					+'</thead>'
					+'<tbody>';
	if(_chart_data2.jsonListBuckets != null) {
		let bucketsLen = _chart_data2.jsonListBuckets.length;
		for(i = 0; i < bucketsLen; i++){
			exportTable += '<tr><td>'+http_remove(_chart_data2.jsonListBuckets[i].key)+'</td><td>'+_chart_data2.jsonListBuckets[i].doc_count+'</td></tr>';
		}
	}

	exportTable += '</tbody>';

    //tab_text = tab_text + exportTable.html();
    tab_text = tab_text + exportTable;
    tab_text = tab_text + '</table></body></html>';
    let data_type = 'data:application/vnd.ms-excel';
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf("MSIE ");
    let fileName = title + '.xls';
    //Explorer 환경에서 다운로드
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        if (window.navigator.msSaveBlob) {
            let blob = new Blob([ tab_text ], {
                type : "application/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, fileName);
        }
    } else {
        let blob2 = new Blob([ tab_text ], {
            type : "application/csv;charset=utf-8;"
        });
        let filename = fileName;
        let elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob2);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

function fnExcelReportP3(title) {
    let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text
            + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    tab_text = tab_text
            + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
    tab_text = tab_text + '<x:Name>'+title+'</x:Name>';
    tab_text = tab_text
            + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text
            + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
    tab_text = tab_text + "<table border='1px'>";
    //var exportTable = $('#' + id).clone();
    //exportTable.find('input').each(function(index, elem) {
    //    $(elem).remove();
    //});
	let i=0;
	let exportTable = '<thead>'
						+'<tr>'
							+'<th>수집유형</th>'
							+'<th>건수</th>'
						+'</tr>'
					+'</thead>'
					+'<tbody>';
	if(_chart_data3.jsonListBuckets != null) {
		let bucketsLen = _chart_data3.jsonListBuckets.length;
		for(i = 0; i < bucketsLen; i++){
			exportTable += '<tr><td>'+_chart_data3.jsonListBuckets[i].key+'</td><td>'+_chart_data3.jsonListBuckets[i].doc_count+'</td></tr>';
		}
	}

	exportTable += '</tbody>';

    //tab_text = tab_text + exportTable.html();
    tab_text = tab_text + exportTable;
    tab_text = tab_text + '</table></body></html>';
    let data_type = 'data:application/vnd.ms-excel';
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf("MSIE ");
    let fileName = title + '.xls';
    //Explorer 환경에서 다운로드
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        if (window.navigator.msSaveBlob) {
            let blob = new Blob([ tab_text ], {
                type : "application/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, fileName);
        }
    } else {
        let blob2 = new Blob([ tab_text ], {
            type : "application/csv;charset=utf-8;"
        });
        let filename = fileName;
        let elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob2);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}


//------------------------------------------------
// *** 데이터차트, 테이블 함수 ***
//------------------------------------------------
//--------------------------
//일자별 에러 발생수
function errorP1Ajax(_data){
	$.ajax({
		type: 'POST',
		url: window.location.pathname + '/errorP1Ajax',
		data: JSON.stringify(_data),
		contentType: "application/json; charset=UTF-8",
	}).done(function (data) {
		if (data) {
			_chart_data1 = data;
			fnDraw_p1();
		}
	}).fail(function (data) {

	});
}

//--------------------------
// 사이트별 에러 발생수
function errorP2Ajax(_data){
	$.fn.DataTable.ext.pager.numbers_length = 20;

	$('#errorCntCrawlingRequestList')
		.on('preXhr.dt', function (e, settings, data) {
			$("#errorCntCrawlingRequestList tbody").empty();
			_data.from = data.start;
		})
		.DataTable( {
			order: [0, 'desc'],
			ordering: false,
			paging : true,
			pageLength: 10,
			pagingType: "full_numbers_no_ellipses",
			lengthChange : false,
			language: {
				zeroRecords: "데이터가 존재하지 않습니다.",
				paginate: {
					first:"맨앞",
					previous:"이전",
					next: "다음",
					last:"맨뒤"
				}
			},
			select: true,
			autoWidth : false,
			searching: false,
			stateSave: false,
			serverSide: true,
			processing : true,
			destroy: true,
			ajax : function(data, callback, settings) {
				return $.ajax({
					url: window.location.pathname + '/errorP2Ajax',
					type : 'POST',
					data : JSON.stringify(_data),
					dataType : "json",
					contentType: "application/json; charset=utf-8",
					success: function(data) {
						callback({
							recordsTotal: data['param'].recordsTotal,
							recordsFiltered: data['param'].recordsFiltered,
							data: data['jsonListBuckets']
						});
					},
					error: function(data, status, error) {
						$("#errorCntCrawlingRequestList_processing").hide();
						$("#errorCntCrawlingRequestList tbody").empty()
							.append("<tr><td colspan='4'>데이터를 조회하는데 실패했습니다.</td></tr>");
					},
					fail: function() {
						$("#errorCntCrawlingRequestList_processing").hide();
						$("#errorCntCrawlingRequestList tbody").empty()
							.append("<tr><td colspan='4'>데이터를 조회하는데 실패했습니다.</td></tr>");
					}
				});
			},
			columns: [
				{ title: "<span class='ellipsis'>수집키</span>",		data : "key",			width : "20%"},
				{ title: "<span class='ellipsis'>사이트명</span>", 	data : "site_name",		width : "60%"},
				{ title: "<span class='ellipsis'>에러 건수</span>",  	data : "doc_count",	width : "20%"},

			],
			columnDefs: [
				{
					targets: 0,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis text-center'>" + data + "</span>";
						return html;
					}
				},{
					targets: 1,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis text-center'>" + data + "</span>";
						return html;
					}
				},{
					targets: 2,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis text-center'>" + data + "</span>";
						return html;
					}
				}
			]
		});
}
// 사이트 에러발생수 Row 클릭이벤트
$(document).on('click', '#errorCntCrawlingRequestList tbody tr', function () {
	let table = $('#errorCntCrawlingRequestList').DataTable();
	let rowData = table.row(this).data();
	let keyValue = rowData['key'];

	let select2List = [];
	let isSelect = false;
	select2List = $('#subCrawlingList').val();
	if(select2List !== null){
		select2List.forEach(function(item, index, array){
			if(item == keyValue){
				isSelect = true;
			}
		});
	}
	if(!isSelect){
		$('#subCrawlingList').val(keyValue).select2();
	}
	search();
});

//--------------------------
// 에러 유형별 발생수(파이차트)
function errorP3Ajax(_data){
	$.ajax({
		type: 'POST',
		url: window.location.pathname + '/errorP3Ajax',
		data: JSON.stringify(_data),
		contentType: "application/json; charset=UTF-8",
	}).done(function (data) {
		if (data) {
			_chart_data3 = data;
			fnDraw_p3();
		}
	}).fail(function (data) {

	});
}

//--------------------------
// 사이트 에러목록
function errorListTable(_data) {
	$.fn.DataTable.ext.pager.numbers_length = 20;

	$('#errorCrawlingRequestList')
		.on('preXhr.dt', function (e, settings, data) {
			$("#errorCrawlingRequestList tbody").empty();
			_data.from = data.start;
		})
		.DataTable( {
			order: [0, 'desc'],
			ordering: false,
			paging : true,
			pageLength: 10,
			pagingType: "full_numbers_no_ellipses",
			lengthChange : false,
			language: {
				zeroRecords: "데이터가 존재하지 않습니다.",
				paginate: {
					first:"맨앞",
					previous:"이전",
					next: "다음",
					last:"맨뒤"
				}
			},
			select: true,
			autoWidth : false,
			searching: false,
			stateSave: false,
			serverSide: true,
			processing : true,
			destroy: true,
			ajax : function(data, callback, settings) {
				return $.ajax({
					url: window.location.pathname + '/errorP4Ajax',
					type : 'POST',
					data : JSON.stringify(_data),
					dataType : "json",
					contentType: "application/json; charset=utf-8",
					success: function(data) {
						callback({
							recordsTotal: data['param'].recordsTotal,
							recordsFiltered: data['param'].recordsFiltered,
							data: data['jsonErrorList']
						});
					},
					error: function(data, status, error) {
						$("#errorCrawlingRequestList_processing").hide();
						$("#errorCrawlingRequestList tbody").empty()
							.append("<tr><td colspan='4'>데이터를 조회하는데 실패했습니다.</td></tr>");
					},
					fail: function() {
						$("#errorCrawlingRequestList_processing").hide();
						$("#errorCrawlingRequestList tbody").empty()
							.append("<tr><td colspan='4'>데이터를 조회하는데 실패했습니다.</td></tr>");
					}
				});
			},
			columns: [
				{ title: "<span class='ellipsis'>수집키</span>",		data : "crawl_id",			width : "5%"},
				{ title: "<span class='ellipsis'>스케쥴키</span>",		data : "crawl_schedule_key",			width : "6%"},
				{ title: "<span class='ellipsis'>사이트명</span>", 	data : "site_name",		width : "12%"},
				{ title: "<span class='ellipsis'>수집 URL</span>",  	data : "target_url",	width : "24%"},
				{ title: "<span class='ellipsis'>에러 내용</span>",  	data : "error_detail",		width : "43%"},
				{ title: "<span class='ellipsis'>에러 일시</span>",  	data : "@timestamp",		width : "10%"}

			],
			columnDefs: [
				{
					targets: 0,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis text-center'>" + data + "</span>";
						return html;
					}
				},{
					targets: 1,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis text-center'>" + data + "</span>";
						return html;
					}
				},{
					targets: 2,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis text-center'>" + data + "</span>";
						return html;
					}
				},{
					targets: 3,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis text-left'><a href='" + data + "' target='_blank'>" + data + "</span>";
						return html;
					}
				},{
					targets: 4,
					className: "",
					render : function (data, type, row){
						let html = "";
						if(data.search("Traceback") === -1){
							html += "<span class='ellipsis text-left'>" + "[" + row['code_name'] + "] " + data + "</span>";
						}else{
							html += "<span class='ellipsis text-left'>" + "[" + row['code_name'] + "] 기타 메세지(Traceback)</span>";
						}
						return html;
					}
				},{
					targets: 5,
					className: "",
					render : function (data, type, row){
						let date = data.substr(0, 10) + "&nbsp;";
						let time = data.substr(11, 5);
						let html = "<span class='ellipsis'>" + date + time + "</span>";
						return html;
					}
				}
			]
		});
}
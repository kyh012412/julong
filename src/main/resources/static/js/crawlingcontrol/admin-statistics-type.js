let _chart_data1;
let _chart_data2;
let _chart_data3;
$(document).ready(function() {
	$('#startDate').val(getYMD_pre(6));
	$('#endDate').val(getYMD());

	$("#subCrawlingList").select2({
		multiple: true,
		dropdownParent: $("#subCrawlingList_p")
	});

	$(".select").select2({
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

	search();
})
$(document).on('click', '#searchBtn', function (){
	fnDrawlP1Table();
})

$(window).load(function () {

});

$(document).on('click', '#searchList', function (){
	search();
})

function search(){
    const _data = {
        startDate: $('#startDate').val()
        , endDate: $('#endDate').val()
    };

	//-----------------------------------------------------
	//수집요청별 수집수
	fnDrawlP1Table();
	//-----------------------------------------------------
	//수집유형별 수집수
    $.ajax({
        type: 'POST',
        url: window.location.pathname + '/typeP2Ajax',
        data: JSON.stringify(_data),
        contentType: "application/json; charset=UTF-8",
	}).done(function (data) {
		if (data) {
			_chart_data2 = data;
			fnDrawP2();	
		}
	}).fail(function (data) {

	});
	//-----------------------------------------------------
	//수집기별 수집수
    $.ajax({
        type: 'POST',
        url: window.location.pathname + '/typeP3Ajax',
        data: JSON.stringify(_data),
        contentType: "application/json; charset=UTF-8",
	}).done(function (data) {
		if (data) {
			_chart_data3 = data;
			fnDrawP3();	
		}
	}).fail(function (data) {

	});
}

$('#typeSearch').change(function(){
	fnDrawlP1Table();
});

$('#searchExcel').click(function(){
	$.fileDownload(window.location.pathname+'/excel/download', {
		httpMethod: 'GET',
		data: {
			startDate: $("#startDate").val(),
			endDate: $("#endDate").val()
		},
		successCallback: function () {
			location.reload();
		},
		failCallback: function(response) {
			Swal.fire("엑셀 다운로드를 실패했습니다.", "", "error");
		}
	})
});


function fnDrawlP1Table() {
	$.fn.DataTable.ext.pager.numbers_length = 20;

	let start = 0;
	let length = 10;
	let subKeys = $('#subCrawlingList').val();
	let reSubKeys = "";
	if (subKeys != null && subKeys.length > 0) {
		reSubKeys = String(subKeys);
	}

	$('#typeCrawlingRequestList')
		.on('preXhr.dt', function (e, settings, data) {
			$("#typeCrawlingRequestList tbody").empty();
			start = data.start;
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
					url : window.location.pathname + '/typeP1Ajax',
					type : 'POST',
					data : JSON.stringify({
						from: start,
						size: length,
						startDate: $("#startDate").val().trim(),
						endDate: $("#endDate").val().trim(),
						search: $('#typeSearch').val(),
						subCrawlingList: reSubKeys
					}),
					dataType : "json",
					contentType: "application/json; charset=utf-8",
					success: function(data) {
						$('#totalCnt').text(data['param'].recordsTotal + ' 건');
						callback({
							recordsTotal: data['param'].recordsTotal,
							recordsFiltered: data['param'].recordsFiltered,
							data: data['typeCrawlingRequestList']
						});
					},
					error: function(data, status, error) {
						$("#typeCrawlingRequestList_processing").hide();
						$("#typeCrawlingRequestList tbody").empty()
							.append("<tr><td colspan='4'>데이터를 조회하는데 실패했습니다.</td></tr>");
					},
					fail: function() {
						$("#typeCrawlingRequestList_processing").hide();
						$("#typeCrawlingRequestList tbody").empty()
							.append("<tr><td colspan='4'>데이터를 조회하는데 실패했습니다.</td></tr>");
					}
				});
			},
			columns: [
				{ title: "<span class='ellipsis'>수집키</span>",		data : "key",			     width : "6%"},
				{ title: "<span class='ellipsis'>최근 수집일</span>",		data : "timestamp",	 	 width : "12%"},
				{ title: "<span class='ellipsis'>수집 유형</span>",	data : "code_category_name", width : "12%"},
				{ title: "<span class='ellipsis'>수집회사명</span>", 	data : "site_name",		     width : "14%"},
				{ title: "<span class='ellipsis'>수집 URL</span>",  	data : "target_link",	     width : "49%"},
				{ title: "<span class='ellipsis'>수집 건수</span>",  	data : "doc_count",		     width : "7%"},
			],
			columnDefs: [
				{
					targets: 0,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis'>" + data + "</span>";
						return html;
					}
				},{
					targets: 1,
					className: "",
					render : function (data, type, row){
						let date = data.substr(0, 10) + "&nbsp;";
						let time = data.substr(11, 5);
						let html = "<span class='ellipsis text-center'>" + date + time + "</span>";
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
						let html = "<span class='ellipsis text-left'>" + data + "</span>";
						return html;
					}
				},{
					targets: 4,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis text-left'><a href='"+ data +"' target='_blank'>"+ data +"</a></span>";
						return html;
					}
				},{
					targets: 5,
					className: "",
					render : function (data, type, row){
						let doc_count = data > 0? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
						let html = "<span class='ellipsis'>" + doc_count + "</span>";
						return html;
					}
				}
			]
		});

	var window_height =  $(window).height();
	var div_height = window_height - 1000;

	$(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
}

function fnDrawP1(){
	let bucketsDataArray = [];
	let bucketsYmdArray = null;

	bucketsYmdArray = new Array(_chart_data1.jsonListBuckets.length);
	for(let i=0; i<_chart_data1.jsonListBuckets.length; i++){
		bucketsDataArray.push({"y":Number(_chart_data1.jsonListBuckets[i].doc_count)});
		bucketsYmdArray[i] = _chart_data1.jsonListBuckets[i].site_name + "(" + _chart_data1.jsonListBuckets[i].key + ")";
	}

	let initChart = function(_data) {
	$('#typeChart1').highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			xAxis: {
				type: 'category',
				categories: bucketsYmdArray,
				labels: {
					rotation: 0,
					style: {
						fontSize: '12px',
					}
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: ''
				}
			},
			legend: {
				enabled: false
			},
			tooltip: {
				headerFormat: '<strong style="font-size: 13px">{point.key}</strong><br/>'
			},
			 plotOptions: {
				column: {
					pointPadding: 0.3,
					borderWidth: 0
				}
			},
			navigation: {
				buttonOptions: {
					enabled: false
				}
			},
			series: [{
				name: '',
				data : bucketsDataArray,
				dataLabels: {
					enabled: true,
					rotation: 0,
					align: 'center',
					y: 0,
					style: {
						fontSize: '12px',
						fontWeight: 'normal'
					}
				}
			}]
		});
	};

	initChart();
}


function fnDrawP2(){
	let i = 0;
	let bucketsDataArray = [];

	for(i = 0; i < _chart_data2.jsonListBuckets.length; i++){
		bucketsDataArray.push({"y":Number(_chart_data2.jsonListBuckets[i].doc_count), "name":_chart_data2.jsonListBuckets[i].key});
	}
	let initChart = function(_data) {
	$('#typeChart2').highcharts({
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
							format: '<span style="font-weight: normal;"> {point.percentage:.0f}%, {point.y} </span>'
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
					data: bucketsDataArray,

				}]
			});
	};
	
	initChart();
}

function fnDrawP3(){
	let i = 0;
	let bucketsDataArray = [];

	for(i = 0; i < _chart_data3.jsonListBuckets.length; i++){
		bucketsDataArray.push({"y":Number(_chart_data3.jsonListBuckets[i].doc_count), "name":_chart_data3.jsonListBuckets[i].key});
	}
	let initChart = function(_data) {
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
					data: bucketsDataArray,

				}]
			});
	};

	var lastAngle = 0;
	var moveToPoint = function (clickPoint) {
		var points = clickPoint.series.points;
		var startAngle = 0;
		for (var i = 0; i < points.length; i++){
			var p = points[i];
			if (p === clickPoint){
					break;
			}
			startAngle += (p.percentage/100.0 * 360.0);
		}
	};
	
	initChart();
}

function getYMD(){
	let now = moment();
	return now.format('YYYY-MM-DD');
}

function getYMD_pre(d){
	let now = moment().subtract(d, 'days');
	return now.format('YYYY-MM-DD');
}

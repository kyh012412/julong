let _chart_data1;

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

	initDailyCrawlingList();

	$('#detailStartDate').datepicker({
		autoHide: true,
		yearFirst: true,
		yearSuffix: '년',
		format: 'yyyy-mm-dd',
		daysMin: ['일', '월', '화', '수', '목', '금', '토'],
		months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		zIndex: 1051
	});
	$('#detailEndDate').datepicker({
		autoHide: true,
		yearFirst: true,
		yearSuffix: '년',
		format: 'yyyy-mm-dd',
		daysMin: ['일', '월', '화', '수', '목', '금', '토'],
		months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		zIndex: 1051
	});

	$('#detailStartDate').on('change', function () {
		$('#detailEndDate').datepicker('setStartDate', $('#detailStartDate').datepicker('getDate'));
	});
	$('#detailEndDate').on('change', function () {
		$('#detailStartDate').datepicker('setEndDate', $('#detailEndDate').datepicker('getDate'));
	});
})

$(window).resize(function() {
	var window_height =  $(window).height();
	var div_height = window_height - 330;

	$(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
});

/* 수집요청목록 */
$(document).on('click', '#btnDateSearch', function() {
	initDailyCrawlingList();
})

/* 일자별 수집데이터 날짜 검색 */
$(document).on('click', '#btnDetailDateSearch', function() {
	initDetailTable();
})

function initDailyCrawlingList() {

	$.fn.DataTable.ext.pager.numbers_length = 10;

	let start;
	let length;

	let subKeys = $('#subCrawlingList').val();
	let reSubKeys = "";
	if (subKeys != null && subKeys.length > 0) {
		reSubKeys = String(subKeys);
	}

	$('#dailyCrawlingList')
		.on('preXhr.dt', function (e, settings, data) {
			$("#dailyCrawlingList tbody").empty();
			start = data.start;
			length = data.length;
		})
		.DataTable( {
			order: [0, 'desc'],
			ordering: false,
			paging : true,
			pageLength: 20,
			pagingType: "full_numbers_no_ellipses",
			lengthMenu:  [20, 40, 60, 80, 100],
			lengthChange : false,
			language: {
				zeroRecords: "데이터가 존재하지 않습니다.",
				search: "",
				lengthMenu: "_MENU_개 보기",
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
					url : window.location.pathname + '/crawlingListAjax',
					type : 'POST',
					data : JSON.stringify({
						start: start,
						length: length,
						startDate: $('#startDate').val(),
						endDate: $('#endDate').val(),
						isZeroCnt : $('#isZeroCnt').val(),
						subCrawlingList: reSubKeys
					}),
					dataType : 'json',
					contentType: 'application/json; charset=utf-8',
					success: function(data) {
						callback({
							recordsTotal: data['param'].recordsTotal,
							recordsFiltered: data['param'].recordsFiltered,
							data: data['dailyCrawlingList']
						});
					},
					error: function(data, status, error) {
						$("#dailyCrawlingList_processing").hide();
						$("#dailyCrawlingList tbody").empty()
							.append("<tr><td colspan='6'>데이터를 조회하는데 실패했습니다.</td></tr>");
					},
					fail: function() {
						$("#dailyCrawlingList_processing").hide();
						$("#dailyCrawlingList tbody").empty()
							.append("<tr><td colspan='6'>데이터를 조회하는데 실패했습니다.</td></tr>");
					}
				});
			},
			columns: [
				{ title: "<span class='ellipsis'>수집키</span>",			data: "crawlingKey",			width: "8%"},
				{ title: "<span class='ellipsis'>수집일</span>",	data: "crawlingDate",			width: "10%"},
				{ title: "<span class='ellipsis'>분류</span>",			data: "codeCategoryName",		width: "8%"},
				{ title: "<span class='ellipsis'>유형</span>",			data: "codeCrawlingTypeName",	width: "15%"},
				{ title: "<span class='ellipsis'>수집회사명/이름</span>",	data: "siteName",				width: "15%"},
				{ title: "<span class='ellipsis'>수집경로(URL)</span>",	data: "crawlingUrl",			width: "37%"},
				{ title: "<span class='ellipsis'>수집건수</span>",	data: "esCrawlingCount",			width: "7%"},
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
						let parseDate = new Date(data.year, data.monthValue-1, data.dayOfMonth);
						const year = parseDate.getFullYear();
						const month = parseDate.getMonth()+1;
						const date = parseDate.getDate();
						let crawlingDate = `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
						let html = "<span class='ellipsis text-center'>" + crawlingDate + "</span>";
						return html;
					}
				},{
					targets: 2,
					className: "",
					render : function (data, type, row){
						let html = "";
						switch(data) {
							case "NEWS":  html = "<span class='ellipsis'>" + TEXT_CATEGORY_NEWS + "</span>"; break;
							case "MYCOMPANY":     html = "<span class='ellipsis'>" + TEXT_CATEGORY_MYCOMPANY + "</span>"; break;
							case "COMPETITOR": html = "<span class='ellipsis'>" + TEXT_CATEGORY_COMPETITOR + "</span>"; break;
							case "CUSTOMER":   html = "<span class='ellipsis'>" + TEXT_CATEGORY_CUSTOMER + "</span>"; break;
							case "BIDDING":   html = "<span class='ellipsis'>" + TEXT_CATEGORY_BIDDING + "</span>"; break;
							case "PERSON":   html = "<span class='ellipsis'>" + TEXT_CATEGORY_PEOPLE + "</span>"; break;
							default:         html = "<span class='ellipsis'>" + data + "</span>"; break;
						}
						return html;
					}
				},{
					targets: 3,
					className: "",
					render : function (data, type, row){
						let html = "";
						switch(data) {
							case "API":  html = "<span class='ellipsis'>API/RSS타입 수집</span>"; break;
							case "LIST":     html = "<span class='ellipsis'>리스트타입 수집</span>"; break;
							case "PEOPLE": html = "<span class='ellipsis'>인명정보 수집</span>"; break;
							case "GENERAL":   html = "<span class='ellipsis'>일반타입 수집</span>"; break;
							default:         html = "<span class='ellipsis'>" + data + "</span>"; break;
						}
						return html;
					}
				},{
					targets: 4,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis'>" + data + "</span>";
						return html;
					}
				},{
					targets: 5,
					className: "",
					render : function (data, type, row){
						let html = "";
						html = "<span class='ellipsis text-left url'>" + data + "</span>";
						// if(row['crawlingPeopleYn']) {
						// 	html += isEmpty(row['linkedinUrl'])? "" : "<span class='ellipsis text-left url'>"+ row['linkedinUrl'] +"</span>";
						// 	html += isEmpty(row['facebookUrl'])? "" : "<span class='ellipsis text-left url'>"+ row['facebookUrl'] +"</span>"
						// 	html += isEmpty(row['googleUrl'])? "" : "<span class='ellipsis text-left url'>"+ row['googleUrl'] +"</span>"
						// } else {
						// 	html = "<span class='ellipsis text-left url'>" + data + "</span>";
						// }
						return html;
					}
				},{
					targets: 6,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis'>" + data + "</span>";
						return html;
					}
				}
			]
		});

	let window_height = $(window).height();
	let div_height = window_height - 330;

	$(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
}

$(document).on('click', '#dailyCrawlingList tbody tr', function() {
	let table = $('#dailyCrawlingList').DataTable();
	$("#detailStartDate").val($('#startDate').val());
	$("#detailEndDate").val($('#endDate').val());

	let rowData = table.row(this).data();
	$("#detailCrawlingKeyText").text(rowData['crawlingKey']);
	$("#detailCrawlingSiteNameText").text(rowData['siteName']);
	initDetailTable();
})

function initDetailTable() {
	$("#statisticDailyDetailModal").modal("show");
	$('#detailCrawlingTotalCnt').text('');

	$.fn.DataTable.ext.pager.numbers_length = 10;

	let start;
	let length;
	$('#dailyDetailList')
		.on('preXhr.dt', function (e, settings, data) {
			$("#dailyDetailList tbody").empty();
			start = data.start;
			length = data.length;
		})
		.DataTable( {
			order: [0, 'desc'],
			ordering: false,
			paging : true,
			pageLength: 20,
			pagingType: "full_numbers_no_ellipses",
			lengthMenu:  [20, 40, 60, 80, 100],
			lengthChange : true,
			language: {
				zeroRecords: "데이터가 존재하지 않습니다.",
				search: "",
				lengthMenu: "_MENU_개 보기",
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
					url : window.location.pathname + '/detailListAjax',
					type : 'POST',
					data : JSON.stringify({
						start: start,
						length: length,
						startDate: $("#detailStartDate").val(),
						endDate: $("#detailEndDate").val(),
						crawlingKey: $("#detailCrawlingKeyText").text()
					}),
					dataType : 'json',
					contentType: 'application/json; charset=utf-8',
					success: function(data) {
						callback({
							recordsTotal: data['param'].recordsTotal,
							recordsFiltered: data['param'].recordsFiltered,
							data: data['dailyDetailList']
						});
						$('#detailCrawlingTotalCnt').text(data['param'].recordsTotal + '건');
					},
					error: function(data, status, error) {
						$("#dailyDetailList_processing").hide();
						$("#dailyDetailList tbody").empty()
							.append("<tr><td colspan='4'>데이터를 조회하는데 실패했습니다.</td></tr>");
					},
					fail: function() {
						$("#dailyDetailList_processing").hide();
						$("#dailyDetailList tbody").empty()
							.append("<tr><td colspan='4'>데이터를 조회하는데 실패했습니다.</td></tr>");
					}
				});
			},
			columns: [
				{ title: "<span class='ellipsis'>스케쥴 키</span>",	data: "schedule_key",		width: "14%"},
				{ title: "<span class='ellipsis'>제목</span>",		data: "title",		width: "28%"},
				{ title: "<span class='ellipsis'>수집 시각</span>",	data: "@timestamp",		width: "14%"},

				{ title: "", data:"target_link"},
				{ title: "", data:"content"}
			],
			columnDefs: [
				{
					targets: 0,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis'>"+ data +"</span>";
						return html;
					}
				},{
					targets: 1,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis text-left'><a href='"+ row['target_link'] +"' target='_blank'>"+ data +"</a></span>";
						return html;
					}
				},{
					targets: 2,
					className: "",
					render : function (data, type, row){
						let date = data.substr(0, 10) + "&nbsp;";
						let time = data.substr(11, 5);
						let html = "<span class='ellipsis'>" + date + time + "</span>";
						return html;
					}
				},{
					targets: 3,
					searchable:false,
					visible:false
				},{
					targets: 4,
					searchable:false,
					visible:false
				}
			]
		});

	let window_height = $(window).height();
	let div_height = window_height - 330;

	$(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
}


function getYMD(){
	let now = moment();
	return now.format('YYYY-MM-DD');
}

function getYMD_pre(d){
	let now = moment().subtract(d, 'days');
	return now.format('YYYY-MM-DD');
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


$('#searchExcel').click(function(){
	fnExcelReport("일자별 수집통계");
});


function fnExcelReport(title) {
	let startDate = new Date($("#startDate").val());
	let endDate = new Date($("#endDate").val());

	let div = document.createElement('div');
	div.setAttribute('id', 'divExcelDownload');
	let exportTable = '<table id="tableStatisticsDaily">'
		+  '<thead>'
		+ 	  '<tr>'
		+ 	    '<th>수집정보/날짜</th>';
	for(let i=0; i<=endDate.getDate()-startDate.getDate(); i++) {
		let tempDate = moment(startDate).add(i, 'day').format('YYYY-MM-DD');
		exportTable += '<th>'+tempDate+'</th>';
	}
	exportTable += '</tr></thead><tbody>';

	let subKeys = $('#subCrawlingList').val();
	if(subKeys != null && subKeys.length > 0 && _chart_data1.jsonListBuckets != null) {
		_chart_data1.jsonListBuckets.forEach(bucket => {
			exportTable += '<tr><th>'+getSitename(bucket.key)+'('+bucket.key+')</th>'
			let dateList = bucket.date_list.buckets;
			if(dateList.length != 0) { //결과 있을 경우
				dateList.forEach(date => {
					exportTable += '<td>' + date.doc_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>';
				});
			} else { //결과 없을 경우
				for(let j=0; i<=endDate.getDate()-startDate.getDate(); j++) {
					exportTable += '<td>0</td>';
				}
			}
			exportTable += '</tr>';
		});
	} else{	//전체 데이터
		if(_chart_data1.jsonListBuckets != null) {
			exportTable += '<tr><th>전체</th>';
			_chart_data1.jsonListBuckets.forEach(bucket => {
				exportTable += '<td>'+ bucket.doc_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +'</td>';
			});
			exportTable += '</tr>';
		}
	}
	exportTable += '</tbody></table>';
	div.innerHTML = exportTable;
	document.body.append(div);

	let workbook = XLSX.utils.table_to_book(document.getElementById('tableStatisticsDaily'), { sheet:title, raw:true });
	XLSX.writeFile(workbook, (title + '.xlsx'));

	document.querySelector("#divExcelDownload").remove();
}

// 0건 제외 체크박스 이벤트
$('#checkZeroCnt').on('change', function () {
	if($('#checkZeroCnt').is(":checked") == true){
		$('#isZeroCnt').val('N');
	}else if($('#checkZeroCnt').is(":checked") == false){
		$('#isZeroCnt').val('Y');
	}
	initDailyCrawlingList();
});
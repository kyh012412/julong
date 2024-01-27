$(document).ready(function() {
	initSiteList();
	initDateTime();
})

function initDateTime() {
    $.ajax({
        type: 'GET',
        url: "/price/crawlingMoneyDate",
        async: false,
        contentType: 'application/json; charset=utf-8'
    }).done(function (data){
        //date_result=data;
        $('#last_date_result').text(data);
    }).fail(function (){
    });

}




function initSiteList() {
	$.fn.DataTable.ext.pager.numbers_length = 10;

	let start = 0;
	let length = parseInt($("[name='siteList_length']").val());
	length = length == NaN? 20 : length;

	$('#siteList')
		.on('preXhr.dt', function (e, settings, data) {
			$("#siteList tbody").empty();
			start = data.start;
			length = data.length;
		})
		.DataTable( {
			order: [0, 'desc'],
			ordering: false,
			paging : false,
			pageLength: 20,
			pagingType: "full_numbers",
			lengthMenu: [20, 40, 60, 80, 100 ],
			lengthChange : true,
			language: {
				zeroRecords: "데이터가 존재하지 않습니다.",
				search: "",
				searchPlaceholder: "검색어 입력",
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
					url: window.location.pathname + '/siteAjax',
					type : "POST",
					data : JSON.stringify({
						start: start,
						length: length,
						//search: $("#search").val().trim(),
						//startDate: $("#startDate").val().trim(),
						//endDate: $("#endDate").val().trim(),
						//codeHostType: $("#hostTypeSearch").val()

					}),
					dataType : "json",
					contentType: "application/json; charset=utf-8",
					success: function(data) {
						callback({
							recordsTotal: data['param'].recordsTotal,
							recordsFiltered: data['param'].recordsFiltered,
							data: data['siteList']
						});
					},
					error: function(data, status, error) {
						$("#siteList tbody").empty()
							.append("<tr><td colspan='8'>데이터를 조회하는데 실패했습니다.</td></tr>");
					},
					fail: function() {
						$("#siteList tbody").empty()
							.append("<tr><td colspan='8'>데이터를 조회하는데 실패했습니다.</td></tr>");
					}
				});
			},



			columns: [
				{ title: "<span class='ellipsis'>통화명</span>",	         	data: "currency_name",	width: "18%"},
				{ title: "<span class='ellipsis'>매매기준율</span>",  			data: "price",	width: "10%"},
				{ title: "<span class='ellipsis'>전일대비</span>",  	        data: "before_price",			width: "9%"},
				{ title: "<span class='ellipsis'>등락율</span>",               data: "before_price_percent",	width: "19%"},
				{ title: "<span class='ellipsis'>현찰 살 때</span>",  		        data: "buy",			width: "12%"},
				{ title: "<span class='ellipsis'>현찰 팔 때</span>",  			data: "sell",		width: "10%"},
				{ title: "<span class='ellipsis'>송금 보낼 때</span>",  	     	data: "send",			width: "10%"},
				{ title: "<span class='ellipsis'>송금 받을 때</span>",  			    data: "receive",				width: "12%"},

				{ title: "",	data: "currency_name",		width: ""},
				{ title: "",	data: "price",					width: ""},
				{ title: "",	data: "before_price",			width: ""},
				{ title: "",	data: "before_price_percent",		width: ""},
				{ title: "",	data: "buy",				width: ""},
				{ title: "",	data: "sell",				width: ""},
				{ title: "",	data: "send",					width: ""},
				{ title: "",	data: "receive",					width: ""}
			],
			columnDefs: [
				{
					targets: 0,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis' style='font-weight:bold'>" + data + "</span>";
						return html;
					}
				},{
					targets: 1,
 					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis'>" + data + "</span>";
						return html;
					}
				},{
					targets: 2,
					className: "",
					render : function (data, type, row){
						let html =""// "<span class='ellipsis'>" + data + "</span>";
						if(data.indexOf('▲')){
						    html =  "<span class='ellipsis' style='color:blue;'>" + data + "</span>";
						}else{
						    html =  "<span class='ellipsis' style='color:red;'>" + data + "</span>";
						}
						return html;
					}
				},{
					targets: 3,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis'>" + data + "</span>";
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
						let html = "<span class='ellipsis'>" + data + "</span>";
						return html;
					}
				},{
					targets: 6,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis'>" + data + "</span>";
						return html;
					}
				},{
					targets: 7,
					className: "",
					render : function (data, type, row){
						let html = "<span class='ellipsis'>" + data + "</span>";
						return html;
					}
				},{
					targets: 8,
					searchable:false,
					visible:false
				},{
					targets: 9,
					searchable:false,
					visible:false
				},{
					targets: 10,
					searchable:false,
					visible:false
				},{
					targets: 11,
					searchable:false,
					visible:false
				},{
					targets: 12,
					searchable:false,
					visible:false
				},{
					targets: 13,
					searchable:false,
					visible:false
				},{
					targets: 14,
					searchable:false,
					visible:false
				}
			]
    	});

    let window_height =  $(window).height();
    let div_height = window_height - 330;

    $(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
}


//----------------------------------------------------------
//수집이력 불러오기
//----------------------------------------------------------
$(document).ready(function() {
    $('#monitoringStartDate').datepicker({
        autoHide: true,
        yearFirst: true,
        yearSuffix: '년',
        format: 'yyyy-mm-dd',
        daysMin: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        zIndex: 1051
    });
    $('#monitoringEndDate').datepicker({
        autoHide: true,
        yearFirst: true,
        yearSuffix: '년',
        format: 'yyyy-mm-dd',
        daysMin: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        zIndex: 1051
    });

    $('#monitoringStartDate').on('change', function () {
        $('#monitoringEndDate').datepicker('setStartDate', $('#monitoringStartDate').datepicker('getDate'));
    });
    $('#monitoringEndDate').on('change', function () {
        $('#monitoringStartDate').datepicker('setEndDate', $('#monitoringEndDate').datepicker('getDate'));
    });

    // 인물수집
    $('#monitoringStartDatePeople').datepicker({
        autoHide: true,
        yearFirst: true,
        yearSuffix: '년',
        format: 'yyyy-mm-dd',
        daysMin: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        zIndex: 1051
    });
    $('#monitoringEndDatePeople').datepicker({
        autoHide: true,
        yearFirst: true,
        yearSuffix: '년',
        format: 'yyyy-mm-dd',
        daysMin: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        zIndex: 1051
    });

    $('#monitoringStartDatePeople').on('change', function () {
        $('#monitoringEndDate').datepicker('setStartDate', $('#monitoringStartDatePeople').datepicker('getDate'));
    });
    $('#monitoringEndDatePeople').on('change', function () {
        $('#monitoringStartDate').datepicker('setEndDate', $('#monitoringEndDatePeople').datepicker('getDate'));
    });
})

//수집이력 - 검색
$(document).on('click', '#btnMonitoringDateSearch, #btnMonitoringSearch', function() {
    initMonitoringList();
})

$(document).on('change', '#listMonitoringNumSelect', function() {
    initMonitoringList();
})

$(document).on('keyup', '#monitoringSearch', function(key){
    if(key.keyCode==13) {
        initMonitoringList();
    }
});

//수집이력 - 검색(인물)
$(document).on('click', '#btnMonitoringDateSearchPeople, #btnMonitoringSearchPeople', function() {
    initPeopleMonitoringList();
})

$(document).on('keyup', '#monitoringSearchPeople', function(key){
    if(key.keyCode==13) {
        initPeopleMonitoringList();
    }
});

// length select box 값 바뀔때
$(document).on('change', '#peopleListMonitoringNumSelect', function() {
    initPeopleMonitoringList();
})


//수집이력목록 초기화
function initMonitoringList() {
   var cgsedate = $('#monitoringSearchDate').val().replace(/ /g,'').split('~');
           cgstartdate = cgsedate[0];
           cgenddate = cgsedate[1];

    $.fn.DataTable.ext.pager.numbers_length = 10;

    let start = 0;
    let length = $("#listMonitoringNumSelect").val();

    $('#MonitoringTbl')
        .on('preXhr.dt', function (e, settings, data) {
            $("#MonitoringTbl tbody").empty();
            start = data.start;
            length = length;
        })
        .DataTable( {
            order: [0, 'desc'],
            dom: `
                            <'thead-fixed'
                                <'scroll  admin2'tr>
                            > p`,
            ordering: false,
            paging : true,
            pageLength: length,
            pagingType: "full_numbers",
//            lengthMenu:  [20, 40, 60, 80, 100 ],
//            lengthChange : true,
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
                    url : '/api' + window.location.pathname + '/monitoring',
                    type : "POST",
                    data : JSON.stringify({
                        from: start,
                        size: length,
                        query: $("#monitoringSearch").val().trim(),
//                        startDate: cgstartdate,
                        startDate: '2012-04-06',
//                        endDate: cgenddate,
                        endDate: '2023-04-12',
                        crawlingKey: currentKey
                    }),
                    dataType : "json",
                    contentType: "application/json; charset=utf-8",
                    success: function(data) {
                        callback({
                            recordsTotal: data['param'].recordsTotal,
                            recordsFiltered: data['param'].recordsFiltered,
                            data: data['monitoringList']
                        });
                    },
                    error: function(data, status, error) {
                        $("#MonitoringTbl_processing").hide();
                        $("#MonitoringTbl tbody").empty()
                            .append("<tr><td colspan='6'>" + messages.error_requestFail + "</td></tr>");
                    },
                    fail: function() {
                        $("#MonitoringTbl_processing").hide();
                        $("#MonitoringTbl tbody").empty()
                            .append("<tr><td colspan='6'>" + messages.error_requestFail + "</td></tr>");
                    }
                });
            },
            columns: [
                { title: "<span class='ellipsis'>스케줄키</span>",	data : "crawlingScheduleKey",	width : "12%"},
                { title: "<span class='ellipsis'>총 건수</span>",  	data : "cntTotal",			    width : "14%"},
                { title: "<span class='ellipsis'>성공 건수</span>",  	data : "cntSuccess",			width : "14%"},
                { title: "<span class='ellipsis'>에러 건수</span>",  	data : "cntError",				width : "14%"},
                { title: "<span class='ellipsis'>시작시각</span>",	data : "startDatetime",		    width : "16%"},
                { title: "<span class='ellipsis'>종료시각</span>",	data : "finishDatetime",	    width : "16%"},
                { title: "<span class='ellipsis'>수행시간</span>",	data : "takenTime",			    width : "14%"},
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
                        let cntTotal = data > 0? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
                        let html = "<span class='ellipsis'>" + cntTotal + "</span>";
                        return html;
                    }
                },{
                    targets: 2,
                    className: "",
                    render : function (data, type, row){
                        let cntSuccess = data > 0? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
                        let html = "<span class='ellipsis'>" + cntSuccess + "</span>";
                        return html;
                    }
                },{
                    targets: 3,
                    className: "",
                    render : function (data, type, row) {
                        let cntError = data > 0? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
                        let html = "<span class='ellipsis'>" + cntError + "</span>";
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
                }
            ]
        });

    var window_height =  $(window).height();
    var div_height = window_height - 330;

    $(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
}

//수집이력목록 초기화(인물)
function initPeopleMonitoringList() {
    var pSearchDate = $('#peopleMonitoringSearchDate').val().replace(/ /g,'').split('~');
        pStartDate = pSearchDate[0];
        pEndDate = pSearchDate[1];

    $.fn.DataTable.ext.pager.numbers_length = 10;

    let start = 0;
    let length = $("#peopleListMonitoringNumSelect").val();

    $('#MonitoringTblPeople')
        .on('preXhr.dt', function (e, settings, data) {
            $("#MonitoringTblPeople tbody").empty();
            start = data.start;
            length = length;
        })
        .DataTable( {
            order: [0, 'desc'],
            dom: `
                            <'thead-fixed'
                                <'scroll  admin2'tr>
                            > p`,
            ordering: false,
            paging : true,
            pageLength: length,
            pagingType: "full_numbers",
//            lengthMenu:  [20, 40, 60, 80, 100 ],
//            lengthChange : true,
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
                    url : '/api' + window.location.pathname + '/monitoring/people',
                    type : "POST",
                    data : JSON.stringify({
                        from: start,
                        size: length,
                        query: $("#monitoringSearchPeople").val().trim(),
                        startDate: pStartDate,
                        endDate: pEndDate,
                        crawlingKey: currentKey
                    }),
                    dataType : "json",
                    contentType: "application/json; charset=utf-8",
                    success: function(data) {
                        callback({
                            recordsTotal: data['param'].recordsTotal,
                            recordsFiltered: data['param'].recordsFiltered,
                            data: data['monitoringList']
                        });
                    },
                    error: function(data, status, error) {
                        $("#MonitoringTblPeople_processing").hide();
                        $("#MonitoringTblPeople tbody").empty()
                            .append("<tr><td colspan='6'>" + messages.error_requestFail + "</td></tr>");
                            console.log("에러");
                    },
                    fail: function() {
                        $("#MonitoringTblPeople_processing").hide();
                        $("#MonitoringTblPeople tbody").empty()
                            .append("<tr><td colspan='6'>" + messages.error_requestFail + "</td></tr>");
                            console.log("실패");
                    }
                });
            },
            columns: [
                { title: "<span class='ellipsis'>스케줄키</span>",	data : "crawlingScheduleKey",	width : "12%"},
                { title: "<span class='ellipsis'>총 건수</span>",  	data : "cntTotal",			    width : "14%"},
                { title: "<span class='ellipsis'>성공 건수</span>",  	data : "cntSuccess",			width : "14%"},
                { title: "<span class='ellipsis'>에러 건수</span>",  	data : "cntError",				width : "14%"},
                { title: "<span class='ellipsis'>시작시각</span>",	data : "startDatetime",		    width : "16%"},
                { title: "<span class='ellipsis'>종료시각</span>",	data : "finishDatetime",	    width : "16%"},
                { title: "<span class='ellipsis'>수행시간</span>",	data : "takenTime",			    width : "14%"},
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
                        let cntTotal = data > 0? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
                        let html = "<span class='ellipsis'>" + cntTotal + "</span>";
                        return html;
                    }
                },{
                    targets: 2,
                    className: "",
                    render : function (data, type, row){
                        let cntSuccess = data > 0? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
                        let html = "<span class='ellipsis'>" + cntSuccess + "</span>";
                        return html;
                    }
                },{
                    targets: 3,
                    className: "",
                    render : function (data, type, row) {
                        let cntError = data > 0? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
                        let html = "<span class='ellipsis'>" + cntError + "</span>";
                        return html;
                    }
                },{
                    targets: 4,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis'>" + get_ymdhm(data) + "</span>";
                        return html;
                    }
                },{
                    targets: 5,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis'>" + get_ymdhm(data) + "</span>";
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

    var window_height =  $(window).height();
    var div_height = window_height - 330;

    $(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
}
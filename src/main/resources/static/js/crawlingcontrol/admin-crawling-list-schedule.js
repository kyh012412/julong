$(document).ready(function () {
     initDateRangePicker();

    // 인물 스케쥴
    $('#scheduleStartDatePeople').datepicker({
        autoHide: true,
        yearFirst: true,
        yearSuffix: '년',
        format: 'yyyy-mm-dd',
        daysMin: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        zIndex: 1051
    });
    $('#scheduleEndDatePeople').datepicker({
        autoHide: true,
        yearFirst: true,
        yearSuffix: '년',
        format: 'yyyy-mm-dd',
        daysMin: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        zIndex: 1051
    });

    $('#scheduleStartDatePeople').on('change', function () {
        $('#scheduleEndDate').datepicker('setStartDate', $('#scheduleStartDatePeople').datepicker('getDate'));
    });
    $('#scheduleEndDatePeople').on('change', function () {
        $('#scheduleStartDate').datepicker('setEndDate', $('#scheduleEndDatePeople').datepicker('getDate'));
    });
})
//----------------------------------------------------------
//수집스케줄 - 검색
$(document).on('change', '#scheduleStatusSearch, #scheduleServerSearch', function() {
    initScheduleList();
})
// length 변경 시
$(document).on('change', '#listScheduleNumSelect', function() {
    initScheduleList();
})

$(document).on('click', '#btnScheduleDateSearch, #btnScheduleSearch', function() {
    initScheduleList();
})


$(document).on('keyup', '#scheduleSearch', function(key){
    if(key.keyCode == 13) {
        initScheduleList();
    }
})
//수집스케줄 - 검색(인물)
$(document).on('change', '#scheduleStatusSearchPeople, #scheduleServerSearchPeople', function() {
    // ????????
    initScheduleList();
})

$(document).on('click', '#btnScheduleDateSearchPeople, #btnScheduleSearchPeople', function() {
    // ????????
    initScheduleList();
})

$(document).on('keyup', '#scheduleSearchPeople', function(key){
    if(key.keyCode == 13) {
        initPeopleScheduleList();
    }
})

// length select box 값 바뀔때
$(document).on('change', '#peoplelistScheduleNumSelect', function() {
    initPeopleScheduleList();
})



//----------------------------------------------------------
//수집스케쥴 불러오기
//--------------------------------------------------------
function getPSchedule(){
    const scheduleTbl = $('#p-ScheduleTbl');
    makeScheduleTbl(scheduleTbl);
}

//스케쥴 dataTable
function makeScheduleTbl(scheduleTbl){
    scheduleTbl.DataTable().destroy();

    let btnDelete = "";
    btnDelete += "<button type='button' class='btn btn-del' name='btnDeletePbl'>";
    btnDelete += "<span class='sr-only'>삭 제</span>";
    btnDelete += "</button>";

    let btnStopPbl = "";
    btnStopPbl += "<button type='button' class='btn btn-stop' name='btnStopPbl'>";
    btnStopPbl += "<span class='sr-only'>중 지</span>";
    btnStopPbl += "</button>";

    let status_stop ="";
    status_stop += "<span class='badge red'>정지</span>"

    let status_wait ="";
    status_wait += "<span class='badge blu'>대기</span>"

    let status_working ="";
    status_working += "<span class='badge org'>수행</span>"

    let status_done ="";
    status_done += "<span class='badge primary'>완료</span>"

    let status_error ="";
    status_error += "<span class='badge red-bg'>장애발생</span>"

    let status_skip = "";
    status_skip += "<span class='badge'>건너뜀</span>"

    let dt_columns = [
        { title: "스케줄 ID",  	data : "crawlingScheduleKey"	,width : "15%"},
        { title: "서버 ID",  	data : "serverKey"	,width : "10%"},
        { title: "예상 시작시간",   data : "crawlingStartDatetime"	,width : "25%"},
        { title: "종료시간",  	data : "crawlingFinishDatetime"	,width : "25%"},
        { title: "수집상태",  	data : "codeCrawlingStatus"	,width : "10%"},
        { title: "스케줄 변경",  	data : "codeCrawlingStatus"	,width : "15%"},
    ]

    $.ajax({
        type: 'post',
        url: "/api/crawlingcontrol/request/schedule",
        data: {crawlingKey: currentKey},
    }).done(function (data) {
            scheduleTbl.DataTable({
                data: data,
                columns: dt_columns,
                columnDefs: [
                    {
                        targets: 0,
                        className: ""
                    },{
                        targets: 1,
                        className: "text-center"
                    },{
                        targets: 2,
                        className: "text-center",
                        render : function (data) {
                            var val = get_ymdhm(data);
                            return val;
                        }
                    },{
                        targets: 3,
                        className: "text-center",
                        render : function (data) {
                            var val = get_ymdhm(data);
                            return val;
                        }
                    },{
                        targets: 4,
                        className: "text-center",
                        render : function (data) {
                            let val = "";
                            switch (data) {
                                case "정지" : val = status_stop; break;
                                case "대기" : val = status_wait; break;
                                case "수행" : val = status_working; break;
                                case "완료" : val = status_done; break;
                                case "장애발생" : val = status_error; break;
                                case "건너뜀" : val = status_skip; break;
                            }
                            return val;
                        }
                    },{
                        targets: 5,
                        className: "text-center",
                        render : function (data) {
                            let val = "";
                            if(data == '대기')
                                val = btnDelete;
                            else if(data == '수행')
                                val = btnStopPbl;
                            return val;
                        }
                    }
                ],
                order: [0, 'desc'],
                dom: `<'thead-fixed'<'scroll admin'tr>>p`,
                ordering: false,
                pageLength: 10,
                pagingType: "full_numbers",
                serverSide: false,
                select: true,
//                lengthMenu: [10, 20, 40, 60],
                language: {
                    zeroRecords: "데이터가 존재하지 않습니다.",
                    search: "",
                    searchPlaceholder: "검색어 입력",
                    lengthMenu: "_MENU_개 보기",
                    paginate: {
                        first: "맨앞",
                        previous: "이전",
                        next: "다음",
                        last: "맨뒤"
                    }
                }
            });
        }).fail(function (data) {
            Swal.fire({
                title: messages.error_,
                text: data.responseJSON.message,
                icon: "info"
            }).then(() => {
                return;
            })
        })

    let window_height =  $(window).height();
    let div_height = window_height - 330;
    $(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
}



function initScheduleList() {
//    원본
//    $("#scheduleStartDate").val($("#startDate").val());
//    $("#scheduleEndDate").val($("#endDate").val());

    var cgsedate = $('#scheduleSearchDate').val().replace(/ /g,'').split('~');
        cgstartdate = cgsedate[0];
        cgenddate = cgsedate[1];

    $.fn.DataTable.ext.pager.numbers_length = 10;

    let start = 0;
    // 원본
//    let length = parseInt($("[name='ScheduleTbl_length']").val());
//    length = length == NaN? 20 : length;

    let length = $("#listScheduleNumSelect").val();

    $("#ScheduleTbl")
        .on('preXhr.dt', function (e, settings, data) {
            $("#ScheduleTbl tbody").empty();
            start = data.start;
            length = length;
        })
        .DataTable( {
            order: [0, 'desc'],
            dom: `<'thead-fixed'<'scroll admin'tr>>p`,
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
                    url : '/api' + window.location.pathname + '/schedule',
                    type : "POST",
                    data : JSON.stringify({
                        start: start,
                        length: length,
                        search: $("#scheduleSearch").val(),
//                        startDate: cgstartdate,
                        startDate: '2012-04-06',
//                        endDate: cgenddate,
                        endDate: '2023-04-12',
                        serverKey: $("#scheduleServerSearch").val(),
                        codeCrawlingStatus: $("#scheduleStatusSearch").val(),
                        crawlingKey: currentKey
                    }),
                    dataType : "json",
                    contentType: "application/json; charset=utf-8",
                    success: function(data) {
                        callback({
                            recordsTotal: data['param'].recordsTotal,
                            recordsFiltered: data['param'].recordsFiltered,
                            data: data['scheduleList']
                        });
                    },
                    error: function(data, status, error) {
                        $("#scheduleList_processing").hide();
                        $("#scheduleTbl tbody").empty()
                            .append("<tr><td colspan='7'>데이터를 조회하는데 실패했습니다.</td></tr>");
                    },
                    fail: function() {
                        $("#scheduleList_processing").hide();
                        $("#scheduleTbl tbody").empty()
                            .append("<tr><td colspan='7'>데이터를 조회하는데 실패했습니다.</td></tr>");
                    }
                });
            },
            columns: [
                { title: "<span class='ellipsis'>스케줄 ID</span>",		data: "crawlingScheduleKey",		width : "13%"},
                { title: "<span class='ellipsis'>서버 ID</span>",  		data: "serverName",				    width : "17%"},
                { title: "<span class='ellipsis'>예상 시작시각</span>",  	data: "crawlingStartDatetime",		width : "19%"},
                { title: "<span class='ellipsis'>수집 종료시각</span>",  	data: "crawlingFinishDatetime",	    width : "19%"},
                { title: "<span class='ellipsis'>수집 건 수</span>",  	data: "crawlingCountLast",			width : "12%"},
                { title: "<span class='ellipsis'>수집 상태</span>",  		data: "codeCrawlingStatusName",	    width : "12%"},
                { title: "<span class='ellipsis'>관리</span>",  		    data: "codeCrawlingStatus",		    width : "8%"},

                { title: "", 	data: "serverKey",			width: ""},
                { title: "", 	data: "serverIp",			width: ""},
                { title: "", 	data: "serverPort",			width: ""},
                { title: "", 	data: "pid",				width: ""},
                { title: "",  	data: "crawlingKey",		width: ""},
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
                        let serverKey = row['serverKey'];
                        let html = "<span class='ellipsis'>" + data + "("+serverKey+")" + "</span>";
                        return html;
                    }
                },{
                    targets: 2,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis'>" + data + "</span>";
                        return html;
                    }
                },{
                    targets: 3,
                    className: "",
                    render : function (data, type, row){
                        let finishDatetime = "";
                        if(row['codeCrawlingStatus'] == 'COMPLETE') finishDatetime = data;	//완료

                        let html = "<span class='ellipsis'>" + finishDatetime + "</span>";
                        return html;
                    }
                },{
                    targets: 4,
                    className: "",
                    render : function (data, type, row){
                        let crawlingCountLast = "";
                        if(row['codeCrawlingStatus'] == 'COMPLETE') {
                            data > 0? crawlingCountLast = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
                        }

                        let html = "<span class='ellipsis'>" + crawlingCountLast + "</span>";
                        return html;
                    }
                },{
                    targets: 5,
                    className: "",
                    render : function (data, type, row){
                        let html = "";
                        switch(row['codeCrawlingStatus']) {
                            case "WAIT": 		html = "<span class='badge2 blu'>" + data + "</span>"; break;
                            case "RUN": 		html = "<span class='badge2 primary-line'>" + data + "</span>"; break;
                            case "COMPLETE": 	html = "<span class='badge2 primary'>" + data + "</span>"; break;
                            case "FAIL": 		html = "<span class='badge2 red-bg'>" + data + "</span>"; break;
                            case "STOP": 		html = "<span class='badge2 red'>" + data + "</span>"; break;
                            case "SKIP": 		html = "<span class='badge2 org'>" + data + "</span>"; break;
                            default: 		    html = "<span class='badge2'>" + data + "</span>"; break;
                        }
                        return html;
                    }
                },{
                    targets: 6,
                    className: "",
                    render : function (data, type, row, meta) {
                        let btnDelete = "<button type='button' class='btn btn-del' name='btnScheduleDelete'>";
                        btnDelete += "	<span class='sr-only'>삭제</span>";
                        btnDelete += "</button>";

                        let btnStop = "<button type='button' class='btn btn-stop' name='btnScheduleStop'>";
                        btnStop += "	<span class='sr-only'>중지</span>";
                        btnStop += "</button>";

                        let html = "";
                        switch(data) {
                            case 'WAIT': html = btnDelete; break;
//                            case 'RUN': html = btnDelete; break;
                            case 'RUN': html = btnStop; break;
                            default: html = ""; break;
                        }
                        return html;
                    }
                },{
                    targets: 7,
                    searchable: false,
                    visible: false
                },{
                    targets: 8,
                    searchable: false,
                    visible: false
                },{
                    targets: 9,
                    searchable: false,
                    visible: false
                },{
                    targets: 10,
                    searchable: false,
                    visible: false
                },{
                    targets: 11,
                    searchable: false,
                    visible: false
                }
            ]
        });

    let window_height =  $(window).height();
    let div_height = window_height - 330;
    $(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
}

function initPeopleScheduleList(){
     var pSearchDate = $('#peopleScheduleSearchDate').val().replace(/ /g,'').split('~');
         pStartDate = pSearchDate[0];
         pEndDate = pSearchDate[1];

    $.fn.DataTable.ext.pager.numbers_length = 10;

    let start = 0;
    let length = $("#peoplelistScheduleNumSelect").val();

    $("#ScheduleTblPeople")
        .on('preXhr.dt', function (e, settings, data) {
            $("#ScheduleTblPeople tbody").empty();
            start = data.start;
            length = length;
        })
        .DataTable( {
            order: [0, 'desc'],
            dom: `<'thead-fixed'<'scroll admin'tr>>p`,
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
                    url : '/api' + window.location.pathname + '/schedule',
                    type : "POST",
                    data : JSON.stringify({
                        start: start,
                        length: length,
                        search: $("#scheduleSearchPeople").val(),
                        startDate: pStartDate,
                        endDate: pEndDate,
                        serverKey: $("#scheduleServerSearchPeople").val(),
                        codeCrawlingStatus: $("#scheduleStatusSearchPeople").val(),
                        crawlingKey: currentKey
                    }),
                    dataType : "json",
                    contentType: "application/json; charset=utf-8",
                    success: function(data) {
                    console.log('aa')
                    console.log(data)
                        callback({
                            recordsTotal: data['param'].recordsTotal,
                            recordsFiltered: data['param'].recordsFiltered,
                            data: data['scheduleList']
                        });
                    },
                    error: function(data, status, error) {
                        $("#scheduleList_processing").hide();
                        $("#scheduleTblPeople tbody").empty()
                            .append("<tr><td colspan='7'>데이터를 조회하는데 실패했습니다.</td></tr>");
                    },
                    fail: function() {
                        $("#scheduleList_processing").hide();
                        $("#scheduleTblPeople tbody").empty()
                            .append("<tr><td colspan='7'>데이터를 조회하는데 실패했습니다.</td></tr>");
                    }
                });
            },
            columns: [
                { title: "<span class='ellipsis'>스케줄 ID</span>",		data: "crawlingScheduleKey",		width : "13%"},
                { title: "<span class='ellipsis'>서버 ID</span>",  		data: "serverName",				    width : "17%"},
                { title: "<span class='ellipsis'>예상 시작시각</span>",  	data: "crawlingStartDatetime",		width : "19%"},
                { title: "<span class='ellipsis'>수집 종료시각</span>",  	data: "crawlingFinishDatetime",	    width : "19%"},
                { title: "<span class='ellipsis'>수집 건 수</span>",  	data: "crawlingCountLast",			width : "12%"},
                { title: "<span class='ellipsis'>수집 상태</span>",  		data: "codeCrawlingStatusName",	    width : "12%"},
                { title: "<span class='ellipsis'>관리</span>",  		    data: "codeCrawlingStatus",		    width : "8%"},

                { title: "", 	data: "serverKey",			width: ""},
                { title: "", 	data: "serverIp",			width: ""},
                { title: "", 	data: "serverPort",			width: ""},
                { title: "", 	data: "pid",				width: ""},
                { title: "",  	data: "crawlingKey",		width: ""},
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
                        let serverKey = row['serverKey'];
                        let html = "<span class='ellipsis'>" + data + "("+serverKey+")" + "</span>";
                        return html;
                    }
                },{
                    targets: 2,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis'>" + get_ymdhm(data) + "</span>";
                        return html;
                    }
                },{
                    targets: 3,
                    className: "",
                    render : function (data, type, row){
                        let finishDatetime = "";
                        if(row['codeCrawlingStatus'] == 'COMPLETE') finishDatetime = get_ymdhm(data);	//완료

                        let html = "<span class='ellipsis'>" + finishDatetime + "</span>";
                        return html;
                    }
                },{
                    targets: 4,
                    className: "",
                    render : function (data, type, row){
                        let crawlingCountLast = "";
                        if(row['codeCrawlingStatus'] == 'COMPLETE') {
                            data > 0? crawlingCountLast = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
                        }

                        let html = "<span class='ellipsis'>" + crawlingCountLast + "</span>";
                        return html;
                    }
                },{
                    targets: 5,
                    className: "",
                    render : function (data, type, row){
                        let html = "";
                        switch(row['codeCrawlingStatus']) {
                            case "WAIT": 		html = "<span class='badge blu'>" + data + "</span>"; break;
                            case "RUN": 		html = "<span class='badge primary-line'>" + data + "</span>"; break;
                            case "COMPLETE": 	html = "<span class='badge primary'>" + data + "</span>"; break;
                            case "FAIL": 		html = "<span class='badge red-bg'>" + data + "</span>"; break;
                            case "STOP": 		html = "<span class='badge red'>" + data + "</span>"; break;
                            case "SKIP": 		html = "<span class='badge org'>" + data + "</span>"; break;
                            default: 		    html = "<span class='badge'>" + data + "</span>"; break;
                        }
                        return html;
                    }
                },{
                    targets: 6,
                    className: "",
                    render : function (data, type, row, meta) {
                        let btnDelete = "<button type='button' class='btn btn-del' name='btnScheduleDelete'>";
                        btnDelete += "	<span class='sr-only'>삭제</span>";
                        btnDelete += "</button>";

                        let btnStop = "<button type='button' class='btn btn-stop' name='btnScheduleStop'>";
                        btnStop += "	<span class='sr-only'>중지</span>";
                        btnStop += "</button>";

                        let html = "";
                        switch(data) {
                            case 'WAIT': html = btnDelete; break;
                            case 'RUN': html = btnStop; break;
                            default: html = ""; break;
                        }
                        return html;
                    }
                },{
                    targets: 7,
                    searchable: false,
                    visible: false
                },{
                    targets: 8,
                    searchable: false,
                    visible: false
                },{
                    targets: 9,
                    searchable: false,
                    visible: false
                },{
                    targets: 10,
                    searchable: false,
                    visible: false
                },{
                    targets: 11,
                    searchable: false,
                    visible: false
                }
            ]
        });

    let window_height =  $(window).height();
    let div_height = window_height - 330;
    $(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
}


//-----------------------------------------------------
//스케쥴 정지
$(document).on('click', '#ScheduleTbl [name=btnScheduleStop]', function (e) {
    let table = $('#ScheduleTbl').DataTable();
    let rowData = table.rows($(this).parents('tr')).data()[0];
    scheduleStop(rowData);
})
$(document).on('click', '#ScheduleTblPeople [name=btnPeopleScheduleStop]', function (e) {
    let table = $('#ScheduleTblPeople').DataTable();
    let rowData = table.rows($(this).parents('tr')).data()[0];
    peopleScheduleStop(rowData);
})

function scheduleStop(rowData) {

    Swal.fire({
        title: messages.confirm_stopSchedule,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "취소",
        confirmButtonText: "정지",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((_isConfirm) => {
        if (_isConfirm.isConfirmed) {
            const _data = {
                crawlingScheduleKey: rowData.crawlingScheduleKey,
                crawlingKey: rowData.crawlingKey,
                serverIp: rowData.serverIp,
                serverPort: rowData.serverPort,
                pid: rowData.pid
            };

            $.ajax({
                type: 'POST',
                url: '/api' + window.location.pathname + '/schedule/stop',
                data: JSON.stringify(_data),
                contentType: "application/json; charset=UTF-8"
            }).done(function (data) {
            console.log('bb')
            console.log(data)
                Swal.fire({
                    title: messages.success_stop,
                    icon: "success",
                }).then((_isConfirm) => {
                    initScheduleList();
                    Swal.close();
                })
            }).fail(function (data) {
                Swal.fire({
                    title: messages.error_stop,
                    text: data.responseJSON.message,
                    icon: "error"
                })
            });
        }
    });
}
function peopleScheduleStop(rowData){
    Swal.fire({
        title: messages.confirm_stopSchedule,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "취소",
        confirmButtonText: "정지",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((_isConfirm) => {
        if (_isConfirm.isConfirmed) {
            const _data = {
                crawlingScheduleKey: rowData.crawlingScheduleKey,
                crawlingKey: rowData.crawlingKey,
                serverIp: rowData.serverIp,
                serverPort: rowData.serverPort,
                pid: rowData.pid
            };

            $.ajax({
                type: 'POST',
                url: '/api' + window.location.pathname + '/schedule/stop',
                data: JSON.stringify(_data),
                contentType: "application/json; charset=UTF-8"
            }).done(function (data) {
                Swal.fire({
                    title: messages.success_stop,
                    icon: "success",
                }).then((_isConfirm) => {
                    initPeopleScheduleList();
                    Swal.close();
                })
            }).fail(function (data) {
                Swal.fire({
                    title: messages.error_stop,
                    text: data.responseJSON.message,
                    icon: "error"
                })
            });
        }
    });
}

//-------------------------------------------------
//스케쥴 삭제
$(document).on('click', '#ScheduleTbl [name=btnScheduleDelete]', function (e) {
    let table = $('#ScheduleTbl').DataTable();
    let rowData = table.rows($(this).parents('tr')).data()[0];
    scheduleDelete(rowData);
})
$(document).on('click', '#ScheduleTblPeople [name=btnScheduleDelete]', function (e) {
    let table = $('#ScheduleTblPeople').DataTable();
    let rowData = table.rows($(this).parents('tr')).data()[0];
    peopleScheduleDelete(rowData);
})

function scheduleDelete(rowData) {

    Swal.fire({
        title: messages.confirm_deleteSchedule,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "취소",
        confirmButtonText: "삭제",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((_isConfirm) => {
        if (_isConfirm.isConfirmed) {
            const _data = {
                crawlingScheduleKey: rowData.crawlingScheduleKey
            };

            $.ajax({
                type: 'POST',
                url: '/api' + window.location.pathname + '/schedule/delete',
                data: JSON.stringify(_data),
                contentType: "application/json; charset=UTF-8"
            }).done(function (res) {
                Swal.fire({
                    text: res.msg,
                    icon: "success",
                }).then((_isConfirm) => {
                    initScheduleList();
                    Swal.close();
                })
            }).fail(function (res) {
                Swal.fire({
                    text: messages.error_delete,
                    icon: "error"
                })
            });
        }
    });
}

function peopleScheduleDelete(rowData){
    Swal.fire({
        title: messages.confirm_deleteSchedule,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "취소",
        confirmButtonText: "삭제",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((_isConfirm) => {
        if (_isConfirm.isConfirmed) {
            const _data = {
                crawlingScheduleKey: rowData.crawlingScheduleKey
            };

            $.ajax({
                type: 'POST',
                url: '/api' + window.location.pathname + '/schedule/delete',
                data: JSON.stringify(_data),
                contentType: "application/json; charset=UTF-8"
            }).done(function (res) {
                Swal.fire({
                    text: res.msg,
                    icon: "success",
                }).then((_isConfirm) => {
                    initPeopleScheduleList();
                    Swal.close();
                })
            }).fail(function (data) {
                Swal.fire({
                    text: messages.error_delete,
                    icon: "error"
                })
            });
        }
    });
}

// ================================================
// datepicker 새로 만든 거
function initDateRangePicker() {
            $('input[name="daterange"]').daterangepicker({
                showDropdowns: true,
                "locale": {
                "format": "YYYY-MM-DD",
                "separator": " ~ ",
                "applyLabel": "확인",
                "cancelLabel": "취소",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "Custom",
                "weekLabel": "W",
                "daysOfWeek": ["월", "화", "수", "목", "금", "토", "일"],
                "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
                "firstDay": 1
            },
            //"startDate": "2020-10-21",
            //"endDate": "2020-10-23",
            "drops": "down"
            }, function (start, end, label) {
                console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
            });
};

//----------------------------------------------------
//스케줄 날짜형식 포맷
function get_ymdhm(dt){
    var dt1 = dt.year + "-" + zeroPad(dt.monthValue, 10) + "-" + zeroPad(dt.dayOfMonth, 10) + " " + zeroPad(dt.hour, 10) + ":" + zeroPad(dt.minute, 10);
    return dt1;
}
function zeroPad(nr,base){
    var  len = (String(base).length - String(nr).length)+1;
    return len > 0? new Array(len).join('0')+nr : nr;
}

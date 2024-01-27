//전역변수-------------------------------------------
let currentSpan;
let currentKey;
let currentTds;

const steps = new Map();
steps.set(1, '본문 테스트');
steps.set(2, '리스트 테스트');
steps.set(3, '페이징 테스트');

const loop = new Map();
loop.set('DAY', '일');
loop.set('HOUR', '시간');
loop.set('MINUTE', '분');
loop.set('MONTH', '개월');
loop.set('WEEK', '요일');

const week = ['일', '월', '화', '수', '목', '금', '토'];
const feedMapping = ['targetName', 'regDateName', 'contentName', 'duplicateName', 'listName'];
let messages; //message.properties values

//-----------------------------------------------------------------------

$(document).ready(function () {
    initDateRangePicker();
    initCollectionListAjax();
    getMessages();
});

$(window).resize(function () {
    let window_height = $(window).height();
    let div_height = window_height - 330;

    $(".dataTables_wrapper>.brd-top-box>.scroll").css("height", div_height + "px");
});

$(window).resize(function () {
    let window_height = $(window).height();
    let div_height = window_height - 330;

    $(".dataTables_wrapper>.brd-top-box>.scroll").css("height", div_height + "px");
});


$(document).on('change', '#permitSearch, #typeSearch, #categorySearch, #useYnSearch', function() {
    initCollectionListAjax();
})

$(document).on('click', '#btnDateSearch, #btnSearch', function() {
    initCollectionListAjax();
})

// length select box 값 바뀔때
$(document).on('change', '#listNumSelect', function() {
    initCollectionListAjax();
})

$(document).on('keyup', '#search', function(key) {
    if(key.keyCode==13) {
        initCollectionListAjax();
    }
})

function getMessages(){
    messages = JSON.parse($('#messages').val());
}

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

function initCollectionListAjax() {
    $.fn.DataTable.ext.pager.numbers_length = 10;

    //날짜 조회조건 새로입력
    var cgsedate = $('#requestsearchdate').val().replace(/ /g,'').split('~');
    cgstartdate = cgsedate[0];
    cgenddate = cgsedate[1];
    console.log(cgstartdate);
    let start;
    let length = $("#listNumSelect").val();

    $('#collectionList')
        .on('preXhr.dt', function (e, settings, data) {
            $("#collectionList tbody").empty();
            start = data.start;
            console.log(data)
//            length = data.length;
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
//            lengthMenu:  [20, 40, 60, 80, 100],
//            lengthChange : true,
            language: {
                zeroRecords: "데이터가 존재하지 않습니다.",
                search: "",
                searchPlaceholder: "검색어 입력",
                lengthMenu: "_MENU_개 보기",
                lengthMenu: "_MENU_",
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
                    url : '/api' + window.location.pathname, // /api/crawlingcontrol/request/list
                    type : "POST",
                    data : JSON.stringify({
                        start: start,
                        length: length,
                        search: $("#search").val(),
                        startDate: cgstartdate,
//                        startDate: '2012-04-06',
                        endDate: cgenddate,
//                        endDate: '2023-04-12',
                        codeCrawlingPermit: $("#permitSearch").val(),
                        codeCategory: $("#categorySearch").val(),
                        codeCrawlingType: $("#typeSearch").val(),
                        useYn: $("#useYnSearch").val()
                    }),
                    dataType : "json",
                    contentType: "application/json; charset=utf-8",
                    success: function(data) {
                        callback({
                            recordsTotal: data['param'].recordsTotal,
                            recordsFiltered: data['param'].recordsFiltered,
                            data: data['adminRequestList'],
                        });
                    },
                    error: function(data, status, error) {
                        $("#collectionList_processing").hide();
                        $("#collectionList tbody").empty()
                            .append("<tr><td colspan='12'>데이터를 조회하는데 실패했습니다.</td></tr>");
                    },
                    fail: function() {
                        $("#collectionList_processing").hide();
                        $("#collectionList tbody").empty()
                            .append("<tr><td colspan='12'>데이터를 조회하는데 실패했습니다.</td></tr>");
                    }
                });
            },
            columns: [
                { title: "<span class='ellipsis'>수집키</span>",             data: "crawlingKey",		        width: "5%"},
                { title: "<span class='ellipsis'>상태</span>",              data: "localeCrawlingPermit",	    width: "7%"},
                { title: "<span class='ellipsis'>요청자</span>",             data: "memberName",	                width: "5%"},
                { title: "<span class='ellipsis'>분류</span>",              data: "localeCategory",	        width: "6%"},
                { title: "<span class='ellipsis'>유형</span>",              data: "codeCrawlingTypeName",		width: "7%"},
                { title: "<span class='ellipsis'>수집회사명/이름</span>",      data: "siteName",		            width: "10%"},
                { title: "<span class='ellipsis'>수집경로(URL)</span>",      data: "siteUrl",	                    width: "23%"},
                { title: "<span class='ellipsis'>신규 수집 건수</span>",      data: "crawlingCountLast",	        width: "6%"},
                { title: "<span class='ellipsis'>누적 수집 건수</span>",      data: "crawlingCountSum",            width: "6%"},
                { title: "<span class='ellipsis'>수집 주기(/1회)</span>",     data: "codeLoopName",               width: "7%"},
                { title: "<span class='ellipsis'>마지막 수집 시작시각</span>",  data: "lastCrawlingStartDatetime",   width: "9%"},
                { title: "<span class='ellipsis'>마지막 수집 종료시각</span>",  data: "lastCrawlingFinishDatetime",  width: "9%"},

                { title: "",    data: "codeCrawlingPermit"},
                { title: "",    data: "linkedinUrl"},
                { title: "",    data: "facebookUrl"},
                { title: "",    data: "googleUrl"},
                { title: "",    data: "loopNoName"},
                { title: "",    data: "crawlingPeopleYn"},
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
                        let html = "";
                        switch(row['codeCrawlingPermit']) {
                            case "REQUEST":  html = "<span class='permits badge2 org'>"+ TEXT_PERMIT_REQUEST +"</span>"; break;
                            case "WAIT":     html = "<span class='permits badge2 blu'>"+ TEXT_PERMIT_WAIT +"</span>"; break;
                            case "APPROVED": html = "<span class='permits badge2 primary'>"+ TEXT_PERMIT_APPROVED +"</span>"; break;
                            case "REJECT":   html = "<span class='permits badge2 red-bg'>"+ TEXT_PERMIT_REJECT +"</span>"; break;
                            default:         html = "<span class='permits badge2'>"+ data +"</span>"; break;
                        }
                        return html;
                    }
                },{
                    targets: 2,
                    className: "",
                    render : function (data, type, row){
                        let memberName = data != null ? data : '';
                        let html = "<span class='ellipsis'>" + memberName + "</span>";
                        return html;
                    }
                },{
                    targets: 3,
                    className: "",
                    render : function (data, type, row){
                        let html = "";
                        switch (data) {
                            case "common.news": html = "<span class='ellipsis'>" + TEXT_CATEGORY_NEWS + "</span>"; break;
                            case "common.myCompany": html = "<span class='ellipsis'>" + TEXT_CATEGORY_MYCOMPANY + "</span>"; break;
                            case "common.competitor": html = "<span class='ellipsis'>" + TEXT_CATEGORY_COMPETITOR + "</span>"; break;
                            case "common.customer": html = "<span class='ellipsis'>" + TEXT_CATEGORY_CUSTOMER + "</span>"; break;
                            case "common.bidding": html = "<span class='ellipsis'>" + TEXT_CATEGORY_BIDDING + "</span>"; break;
                            case "common.person": html = "<span class='ellipsis'>" + TEXT_CATEGORY_PEOPLE + "</span>"; break;
                            default:     html = "<span class='ellipsis'>" + data + "</span>"; break;
                        }
                        return html;
                    }
                },{
                    targets: 4,
                    className: "",
                    render : function (data, type, row){
                        let crawlingType = data != null? data : "-";
                        let html = "<span class='ellipsis crawlingType'>" + crawlingType + "</span>";
                        return html;
                    }
                },{
                    targets: 5,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis text-left'>" + data + "</span>";
                        return html;
                    }
                },{
                    targets: 6,
                    className: "",
                    render : function (data, type, row){
                        let html = "";
                        if(row['crawlingPeopleYn']) {
                            html += isEmpty(row['linkedinUrl'])? "" : "<span class='ellipsis text-left url'>"+ row['linkedinUrl'] +"</span>";
                            html += isEmpty(row['facebookUrl'])? "" : "<span class='ellipsis text-left url'>"+ row['facebookUrl'] +"</span>"
                            html += isEmpty(row['googleUrl'])? "" : "<span class='ellipsis text-left url'>"+ row['googleUrl'] +"</span>"
                        } else {
                            html = "<span class='ellipsis text-left url'>" + data + "</span>";
                        }
                        return html;
                    }
                },{
                    targets: 7,
                    className: "",
                    render : function (data, type, row){
                        let countLast = data != 0? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
                        let html = "<span class='ellipsis countLast'>" + countLast + "</span>";
                        return html;
                    }
                },{
                    targets: 8,
                    className: "",
                    render : function (data, type, row){
                        let countSum = data != 0? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
                        let html = "<span class='ellipsis countSum'>" + countSum + "</span>";
                        return html;
                    }
                },{
                    targets: 9,
                    className: "",
                    render : function (data, type, row){
                        let crawlingLoop = data != null? row['loopNoName'] + data : "-";
                        let html = "<span class='ellipsis cwalingLoop'>" + crawlingLoop + "</span>";
                        return html;
                    }
                },{
                    targets: 10,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis'>" + data + "</span>";
                        return html;
                    }
                },{
                    targets: 11,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis'>" + data + "</span>";
                        return html;
                    }
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
                },{
                    targets: 15,
                    searchable:false,
                    visible:false
                },{
                    targets: 16,
                    searchable:false,
                    visible:false
                },{
                    targets: 17,
                    searchable:false,
                    visible:false
                }
            ],
            createdRow: function (row, data, index) {
                if(data.crawlingPeopleYn) $(row).addClass('people-tr');
                else $(row).addClass('normal-tr');
            },
        });

    let window_height = $(window).height();
    let div_height = window_height - 330;

    $(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");

}

function get_ymdhm(date){
    console.log("test", date);
    return date.year + "-"
        + zeroPad(date.monthValue, 10) + "-"
        + zeroPad(date.dayOfMonth, 10) + " "
        + zeroPad(date.hour, 10) + ":"
        + zeroPad(date.minute, 10);
}
function zeroPad(nr,base){
    let len = (String(base).length - String(nr).length)+1;
    return len > 0? new Array(len).join('0')+nr : nr;
}



//-------------------------------------------------------
//전체 리스트 부분 상태변경
function changeStatus(permit) {
    currentSpan.text(permit);
    currentSpan.removeClass('org blu primary red-bg');
    switch (permit) {
        case messages.common_request :
            currentSpan.addClass('org');
            break;
        case messages.common_wait :
            currentSpan.addClass('blu');
            break;
        case messages.common_approved :
            currentSpan.addClass('primary');
            break;
        case messages.common_reject :
            currentSpan.addClass('red-bg');
            break;
        case 'Request' :
            currentSpan.addClass('org');
            break;
        case 'Wait' :
            currentSpan.addClass('blu');
            break;
        case 'Approved' :
            currentSpan.addClass('primary');
            break;
        case 'Reject' :
            currentSpan.addClass('red-bg');
            break;
    }
}

//--------------------------------------------------
//수집 상세페이지
$(document).on('click', '.normal-tr', function () {
    $("#collectionList tr").removeClass('active');
    $(this).addClass('active');

    let tdsOfTr = $(this).children();
    setCurrentInfo(tdsOfTr);
    // setTimeout(function() {
    //     $('#collectModal_001').modal();
    // }, 500);

    let isAlarmRequired = false;
    console.log("common_request 로그" + messages.common_request);
    console.log("tdsOfTr 로그 " + tdsOfTr.eq(1).text()); // 상태
    console.log("tdsOfTr 로그 " + tdsOfTr.eq(5).text()); // 수집회사명
    if(messages.common_request == tdsOfTr.eq(1).text()) isAlarmRequired = true;
    getSiteView();

    if(isAlarmRequired) {
        const _sendMailData = {
            crawlingKey: currentKey,
            siteName: tdsOfTr.eq(5).text()
        }
        sendMailAlarm('/api/alarm/permit/wait', _sendMailData);
    }
})

//--------------------------------------------------
//현재 보여지는 crawling row 설정
function setCurrentInfo(tdsOfTr) {
    currentTds = tdsOfTr;
    currentSpan = currentTds.eq(1).children().eq(0);
    currentKey = tdsOfTr.eq(0).text();
}

//******************************************************
//상세페이지 ajax
//-----------------------------
//1.일반
function getSiteView() {
    $.ajax({
        type: 'post',
        url: "/api/crawlingcontrol/request/view/site",
        data: {crawlingKey: currentKey}
    })
    .done(function (info) {
        console.log("getSiteView 성공 info : "+JSON.stringify(info));
        let permitHtml = "";
        switch (info.codeCrawlingPermit) {
            case "common.request" :    permitHtml = TEXT_PERMIT_REQUEST; break;
            case "common.wait" :       permitHtml = TEXT_PERMIT_WAIT; break;
            case "common.approved" :   permitHtml = TEXT_PERMIT_APPROVED; break;
            case "common.reject" :     permitHtml = TEXT_PERMIT_REJECT; break;
            // default :                  permitHtml = info.codeCrawlingPermit; break;
        }
        changeStatus(permitHtml);
        // changeStatus(info.codeCrawlingPermit);
        $('.normal-key').text(info.crawlingKey);
        $('.switch-input').prop('checked', info.useYn);
        $('.crawlingKeyHidden').val(info.crawlingKey);
        $('#normal-permit').text(permitHtml);
        // $('#normal-permit').text(info.codeCrawlingPermit);
        switch(info.codeCategoryName) {
            case "common.news":  $("#normal-codeCategory").text(TEXT_CATEGORY_NEWS); break;
            case "common.myCompany":     $("#normal-codeCategory").text(TEXT_CATEGORY_MYCOMPANY); break;
            case "common.competitor": $("#normal-codeCategory").text(TEXT_CATEGORY_COMPETITOR); break;
            case "common.customer":   $("#normal-codeCategory").text(TEXT_CATEGORY_CUSTOMER); break;
            case "common.bidding":   $("#normal-codeCategory").text(TEXT_CATEGORY_BIDDING); break;
            case "common.person":   $("#normal-codeCategory").text(TEXT_CATEGORY_PEOPLE); break;
        }
        // $('#normal-codeCategory').text(info.codeCategoryName);
        $('#modify-hostName').val(info.hostName);
        $('#normal-hostName').text(isNullReturnBlank(info.hostName));
        $('#modify-parentsHostName').val(info.parentsHostName);
        $('#normal-parentsHostName').text(isNullReturnBlank(info.parentsHostName));
        $('#normal-url').text(info.siteUrl);
        $('#normal-login-url').text(isNullReturnBlank(info.loginUrl));
        $('#loginUrl').val(isNullReturnBlank(info.loginUrl));
        $('#normal-siteName').text(isNullReturnBlank(info.siteName));
        $('#modify-siteName').val(isNullReturnBlank(info.siteName));
        $('.normal-category').text(isNullReturnBlank(info.localeCodeCategory));
        $('#normal-nation').text(isNullReturnBlank(info.codeNationName));
        $('#parentsHostName').val(isNullReturnBlank(info.siteName));
        $('.default-url').val(info.siteUrl);
        $('.modify-url').val(info.crawlingUrl);
        $('.reset-crawling-url').val(info.crawlingUrl);
        $('.reset-isconfirmed-url').val(info.codeCrawlingPermit != 'common.wait');
        resetCheckUrl(info.codeCrawlingPermit != 'common.wait');
        $('#modify-remark').val(info.remark);
        $('#normal-remark').text(info.remark);
        $('.normal-codeLoop').val(info.codeLoop);
        $('.btnCrawlingDataDelete').hide();
        if(info.codeCrawlingPermit === 'common.approved'){
            $('.btnCrawlingDataDelete').show();
        }
        if (info.codeLoop != "요일" && info.loopNo == 0) {
            $('.normal-codeNo').val(1);
        } else {
            $('.normal-codeNo').val(info.loopNo);
        }
        $('.normal-archive').val(info.archiveYear == 0 ? 1 : info.archiveYear);
        $('.normal-failDay').val(info.crawlingFailRecogDay);
        let scheduleTime = info.scheduleTime;
        scheduleTime = scheduleTime.replace('AM', '오전').replace('PM', '오후')
        $('input[name=scheduleTime]').prop('value', (scheduleTime != null ? scheduleTime : "9:00 오전"));
        if(info.codeCategoryName!=null&&info.codeCategoryName!="") {
            $("select[name='codeCategory'] option").each(function () {
                if ($(this).text() == info.localeCodeCategory) {
                    $(this).prop('selected', true);
                }
            })
        }
        $('.normal-codeAnalysisType').val('');
        $('.normal-codeAnalysisTypeName').val('');
        if(info.codeAnalysisType!=null&&info.codeAnalysisType!="") {
            $("select[name='codeAnalysisType'] option").each(function () {
                if ($(this).text() == info.codeAnalysisType) {
                    $(this).prop('selected', true);
                }
            })
            $('.normal-codeAnalysisTypeName').val(info.item);
        }
        if (info.codeCrawlingType != "" && info.codeCrawlingType != null) {
            $('#typeSelect').val(info.codeCrawlingType);
            $('.crawlingTypeHidden').val(info.codeCrawlingType);
            //crawlingDetail 정보 불러오기
            setPathInfo(info.codeCrawlingType); // ajax  "/api/crawlingcontrol/request/path"
        } else {
            $('#typeSelect').val('option0');
            //crawlingDetail 정보 불러오기
            setPathInfo('0');
        }
        let result = $('#typeSelect option:selected').val();
        if (result == 'GENERAL') {
            $('#webType').show();
            $('#defaultType').hide();
        } else {
            $('#webType').hide();
        }
        if (result == 'LIST') {
            $('#listType').show();
            $('#defaultType').hide();
        } else {
            $('#listType').hide();
        }
        if (result == 'API') {
            $('#apiRssType').show();
            $('#defaultType').hide();
        } else {
            $('#apiRssType').hide();
        }

        if (info.siteId != "" && info.siteId != null) {
            $('#normal-id').text("아이디: " + info.siteId);
            $('#normal-pw').text("/ 비밀번호: " + info.decrypedSitePassword);
            $('.info-isLoginYn').text("로그인 필요");
            $('.normal-id').val(info.siteId).prop("readOnly", true);
            $('.normal-pw').val(info.decrypedSitePassword).prop("readOnly", true);
            $('#normal-encryptPw').val(info.sitePassword);
        } else {
            $('#normal-id').text("");
            $('#normal-pw').text("");
            $('.normal-id').val("").prop("readOnly", true);
            $('.normal-pw').val("").prop("readOnly", true);
            $('.info-isLoginYn').text("로그인 불필요");
            $('#normal-encryptPw').val("");
        }

        $('#typeSelect').prop('disabled', (info.codeCrawlingPermit == 'common.approved' || info.codeCrawlingPermit == 'common.reject')? true : false);
        permitStatusBadge(info.codeCrawlingPermit);
        set(info);
        $('#additionMappingJson').val("");

        /* 태그 초기화 */
        $(".tag-input").tagsinput('removeAll');
        $(".tag-power-admin").attr("checked", false);
        if(info.tag != '') {
            tagInit(info.tag, info.usePowerAdminTagYn);
        }

        /* 국가 초기화 */
        $(".normal-codeNation").val('').select2({
            dropdownParent: $("#collectModal_001")
        });
        if(info.codeNation !== '') {
            $(".normal-codeNation").val(info.codeNation).select2({
                dropdownParent: $("#collectModal_001")
            });
        } else {
            $(".normal-codeNation").val('').select2({
                dropdownParent: $("#collectModal_001")
            });
        }

        //기본탭 재설정
        $("#nav-tab1_1").trigger("click");
        $('.btn-group').show();
        //스케쥴리스트 콤보박스 default
        $('.select-status').val('').attr("selected", true);

        //테스트수집 관련
        setTestSection();
        testRowRemove();
        setListTestBtn(info.codeTestStepStatus);
        if(info.codeTestStepStatus !== '대기'){
            showListTestResult(info.codeTestStepStatus); // ajax  "/api/crawlingcontrol/test/result"
        }
        if(info.codeCrawlingPermit == 'common.approved' || info.codeCrawlingPermit == 'common.reject'){
            $(".saveReturnBtn").show()
        }

        // else{
        //     canSaveList(info.codeTestStepStatus);
        // }
        $("#saveListType").show();
        $('#flagList').val(info.codeTestStepStatus);

        $('#collectModal_001').modal();
        console.log("getSiteView : "+JSON.stringify(info));

    })
    .fail(function (data) {
        console.log("데이터 log:" + JSON.stringify(data));
        Swal.fire({
            title: data.responseJSON.msg,
            icon: "error"
        }).then(() => {
            $('.modal').modal("hide");
            return;
        })
    });

}

//-----------------
//처음 View 불러와서 수집주기 셋팅(요일일 경우/아닌경우)
//저장 승인버튼 hide
function set(info) {
    switchToInfo();
    setFilterChk(info.filterYn)
    $(".default-url").attr("readonly", true);
    if (info.codeLoop != null && info.codeLoop != '0') {
        $("select[name='codeLoop'] option").each(function () {
            if ($(this).text() == info.codeLoop) {
                $(this).prop('selected', true);
            }
        })
        if (info.codeLoop == '요일') {
            $('.codeNo').hide();
            $('.codeNo').prop('disabled', true);
            $('.codeNoWeek').show();
            $('.codeNoWeek').prop('disabled', false);
            $("select[name='loopNo'] option").each(function () {
                if ($(this).text() == info.loopNo) {
                    $(this).prop('selected', true);
                }
            })
        } else {
            $('.codeNo').show();
            $('select[name="loopNo"]').hide();
            $('select[name="loopNo"]').prop('disabled', true);
            $('.codeNo').prop('disabled', false);
            $('.codeNo').val(info.loopNo);
        }
    } else {
        $('.codeNo').show();
        $('select[name="loopNo"]').hide();
        $('select[name="loopNo"]').prop('disabled', true);
        $('.codeNo').prop('disabled', false);
        $("select[name='codeLoop']").val('HOUR');
    }

}
//----------------------
//test수집 부분 초기화
function testRowRemove(){
    const liCnt = $('#webTestResult li').length;
    if (liCnt > 0) {
        $('#webTestResult li').remove();
    }
    const stepTrCnt = $('#listTestStepResult tr').length;
    if (stepTrCnt > 0) {
        $('#listTestStepResult tr').remove();
    }
    const trCnt = $('#listTestResult tr').length;
    if (trCnt > 0) {
        $('#listTestResult tr').remove();
    }
    const tbodyCnt = $("#apiRssTestResult").length;
    if (tbodyCnt > 0) {
        $('#apiRssTestResult tbody').remove();
    }
}
function setTestSection() {
    //테스트수집 관련
    $('.test-box').hide();
    $('.testingMsg').hide();
    $('.testGoMsg').show();
    $('.approveObj').hide();
    $('.people-test').hide();
}
function returnListTestSet() {
    $('.saveReturnBtn').hide();
    $('#saveListType').show();
    $('.testResultListType .testingMsg').hide();
    $('.testResultListType .testGoMsg').show();
    $('#testStartListType').html("수집 테스트");
    $('#testStartListType').prop("disabled", false);
}
function returnApiTestSet() {
    $('.saveReturnBtn').hide();
    $('#saveApiRssType').show();
    $('.testResultListType .testingMsg').hide();
    $('.testResultListType .testGoMsg').show();
    $('#testStartApiRssType').html("수집 테스트");
    $('#testStartApiRssType').prop("disabled", false);
}

/* 태그 초기화 */
function tagInit(tag, usePowerAdminTagYn) {
    let tagArr = tag.split(",");
    tagArr.forEach(tag => {
        $('.tag-input').tagsinput("add", tag);
    })

    if(usePowerAdminTagYn) {
        $(".tag-power-admin").prop("checked", true);
    } else {
        $(".tag-power-admin").prop("checked", false);
    }
}

/* 전력청 체크박스 클릭시 태그 추가/제거 */
$(document).on("click", ".tag-power-admin", function() {
    if($(this).is(":checked")) {
        $('.tag-input').tagsinput("add", "power_admin");
    } else {
        $('.tag-input').tagsinput("remove", "power_admin");
    }
})

/* 태그 삭제*/
$('.tag-input').on('beforeItemRemove', function(event) {
    if(event.item == 'power_admin') {
        $(".tag-power-admin").attr('checked', false);
    }
});

/*
 * 사이트 수집 설정
 */

$('#timePicker1,#timePicker2,#timePicker3,#timePicker4,#people-timePicker').timepicker();

/**** 수집 타입 선택 ****/
$(document).on('change', '#typeSelect', function() {
    let result = $('#typeSelect option:selected').val();
    $('.crawlingTypeHidden').val(result);
    if (result == 'option0') {
        $('#defaultType').show();
    } else {
        $('#defaultType').hide();
    }
    if (result == 'GENERAL') {
        $('#webType').show();
    } else {
        $('#webType').hide();
    }
    if (result == 'LIST') {
        $('#listType').show();
    } else {
        $('#listType').hide();
    }
    if (result == 'API') {
        $('#apiRssType').show();
    } else {
        $('#apiRssType').hide();
    }
})

/**** 수집주기 요일 선택할 경우 ****/
$(document).on('change', '#normal-codeLoop', function() {
    if ($('#normal-codeLoop option:selected').val() == 'WEEK') {
        $('#normal-codeNoWeek').show();
        $('select[name="loopNo"]').prop('disabled', false);
        $('#normal-codeNo').hide();
        $('#normal-codeNo').prop('disabled', true);
    } else {
        $('#normal-codeNoWeek').hide();
        $('select[name="loopNo"]').prop('disabled', true);
        $('#normal-codeNo').show();
        $('#normal-codeNo').prop('disabled', false).val(1);
    }
});

$(document).on('change', '#normal-codeLoop2', function() {
    if ($('#normal-codeLoop2 option:selected').val() == 'WEEK') {
        $('#normal-codeNoWeek2').show();
        $('select[name="loopNo"]').prop('disabled', false);
        $('#normal-codeNo2').hide();
        $('#normal-codeNo2').prop('disabled', true);
    } else {
        $('#normal-codeNoWeek2').hide();
        $('select[name="loopNo"]').prop('disabled', true);
        $('#normal-codeNo2').show();
        $('#normal-codeNo2').prop('disabled', false).val(1);
    }
})

$(document).on('change', '#normal-codeLoop3', function() {
    if ($('#normal-codeLoop3 option:selected').val() == 'WEEK') {
        $('#normal-codeNoWeek3').show();
        $('select[name="loopNo"]').prop('disabled', false);
        $('#normal-codeNo3').hide();
        $('#normal-codeNo3').prop('disabled', true);
    } else {
        $('#normal-codeNoWeek3').hide();
        $('select[name="loopNo"]').prop('disabled', true);
        $('#normal-codeNo3').show();
        $('#normal-codeNo3').prop('disabled', false).val(1);
    }
})

$.fn.serializeObject = function () {
    var obj = null;
    try {
        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
            var arr = this.serializeArray();
            if (arr) {
                obj = {};
                $.each(arr, function () {
                    obj[this.name] = this.value;
                });
            }//if ( arr ) {
        }
    } catch (e) {
        alert(e.message);
    }
    return obj;
};

//----------------------------------------------------
// 수집설정 form태그 파슬리 유효성 검사
window.Parsley.addValidator('loopMin', {
    requirementType: 'string',
    validateString: function (value, requirement) {
        if ($(requirement).val() !== 'MINUTE') {
            if($(requirement).val() !== 'WEEK') {
                return value >= 1;
            }
            return true;
        }
        return value >= 15;
    },
    messages: {ko: '최소 수집 주기는 15분입니다.',
                en: 'The minimum cycle is 15 minutes.'}
});

/****  일반 타입  ****/
//저장
$(document).on('click', '#saveBtnWebType', function(e) {
    //저장 ajax 추가
    e.preventDefault();
    let _validation = $("#webType").parsley();
    if (!_validation.isValid()) {
        Swal.fire({
            title: messages.req_confirmInfo,
            icon: "warning"
        })
        $('.approveObj').hide();
        return false;
    }
    if(_validation.validate()) {
        $('.approveObj').hide();
        $('#confirmBtnWebType').show();
        saveWebView($('#webTypeForm'));
    }

    let isconfirmedUrl = $("#webTypeForm .isconfirmed-url").val()
    if(isconfirmedUrl === 'false' || !isconfirmedUrl) {
        Swal.fire({
            title: messages.req_duplicateUrl,
            icon: "warning"
        })
        $('.approveObj').hide();
        return false;
    }
});
//반려
$(document).on('click', '#returnBtnWebType', function() {
    $('#returnWebType').show();
    $('#approvedWebType').hide();
});
//승인
$(document).on('click', '#approvedBtnWebType', function() {
    $('#returnWebType').hide();
    if($('#flagWeb').val() =='성공'){
        $('#approvedWebType').show();
    }else{
        $('#approvedWebType').hide();
        Swal.fire({
            title: messages.req_testFirst,
            icon: "warning"
        })

    }
});


/****  리스트 타입  ****/
//저장
$(document).on('click', '#saveBtnListType', function(e) {
    //저장 ajax 추가
    e.preventDefault();
    let loopFlag = false;
    let _validation = $("#listType").parsley();
    if(_validation.validate()) {
        if ($('#normal-codeLoop2').val() !== 'MINUTE') {
            if ($('#normal-codeLoop2').val() !== 'WEEK') {
                loopFlag = $('#normal-codeNo2').val() >= 1;
            }else{
                loopFlag = true;
            }
        }else{
            loopFlag = $('#normal-codeNo2').val() >= 15;
        }

        if(!loopFlag){
            Swal.fire({
                title: messages.valid_minCycle,
                icon: "warning"
            })
            $('.approveObj').hide();
            return false;
        }
        let isconfirmedUrl = $('#listType .isconfirmed-url').val()
        if(isconfirmedUrl=== 'false' || isconfirmedUrl === false) {
            Swal.fire({
                title: messages.req_duplicateUrl,
                icon: "warning"
            })
            $('.approveObj').hide();
            return false;
        }
        if(!compareToLoop($('#listTypeForm'))){
            Swal.fire({
                text: messages.valid_nonCollectionDays,
                icon: "warning"
            })
            $('.approveObj').hide();
            return false;
        }

        $('.approveObj').hide();
        saveListView($('#listTypeForm'));
    }else{
        Swal.fire({
            title: messages.req_confirmInfo,
            icon: "warning"
        })
        $('.approveObj').hide();
        return false;
    }

});
//반려
$(document).on('click', '#returnBtnListType', function() {
    $('#returnListType').show();
    $('#approvedListType').hide();
});
//승인
$(document).on('click', '#approvedBtnListType', function() {
    $('#returnListType').hide();
    if($('#flagList').val() =='성공'){
        $('#approvedListType').show();
    }else{
        $('#approvedListType').hide();
        Swal.fire({
            title: messages.req_testFirst,
            icon: "warning"
        })
    }
});


/****  API/RSS 타입  ****/
//테스트 수집
$(document).on('click', '#testStartApiRssType', function() {
    $('#testResultApiRssType>.table-data-list-view').show();
    $('#testResultApiRssType>.warning-txt').hide();
    $('#saveApiRssType').show();
});
//저장
$(document).on('click', '#saveBtnApiRssType', function(e) {
    //저장 ajax 추가
    e.preventDefault();
    let loopFlag = false;
    let _validation = $("#apiRssType").parsley();
    if(_validation.validate()) {
        if ($('#normal-codeLoop3').val() !== 'MINUTE') {
            if ($('#normal-codeLoop3').val() !== 'WEEK') {
                loopFlag = $('#normal-codeNo3').val() >= 1;
            }else{
                loopFlag = true;
            }
        }else{
            loopFlag = $('#normal-codeNo3').val() >= 15;
        }

        if(!loopFlag){
            Swal.fire({
                title: messages.reg_nonCollectionDays,
                icon: "warning"
            })
            $('.approveObj').hide();
            return false;
        }
        let isconfirmedUrl = $('#apiRssType .isconfirmed-url').val()
        if(isconfirmedUrl === 'false' || isconfirmedUrl === false) {
            Swal.fire({
                title: messages.req_duplicateUrl,
                icon: "warning"
            })
            $('.approveObj').hide();
            return false;
        }
        if(!compareToLoop($('#listTypeForm'))){
            Swal.fire({
                title: messages.reg_nonCollectionDays,
                icon: "warning"
            })
            $('.approveObj').hide();
            return false;
        }
        let pageYn = $("#pageYn").val();
        if(pageYn === '1'){
            let flag = true;
            $(".page-field").each(function() {
                if($(this).val().trim() === ""){
                    Swal.fire({
                        title: messages.reg_pageField,
                        icon: "warning"
                    })
                    flag = false;
                }
            });
            if((flag === false)){
                return false
            }
        }
        if(!saveAdtionFeed()){
            return false;
        }
        $('.approveObj').hide();
        saveViewForRssApi($('#apiRssTypeForm'));
    }else{
        Swal.fire({
            title: messages.reg_confirmInfo,
            icon: "warning"
        })
        $('.approveObj').hide();
        return false;
    }
});
//반려
$(document).on('click', '#returnBtnApiRssType', function() {
    $('#returnApiRssType').show();
    $('#approvedApiRssType').hide();
});
//승인
$(document).on('click', '#approvedBtnApiRssType', function() {
    $('#returnApiRssType').hide();
    if($('#flagApiRss').val() =='성공'){
        $('#approvedApiRssType').show();
    }else{
        $('#approvedApiRssType').hide();
        Swal.fire({
            title: messages.reg_testFirst,
            icon: "warning"
        })
    }
});

//--------------------------------------------------------
// 저장 ajax 함수(사이트수집)
function saveWebView(form){
    const crawlingType = $('#typeSelect option:selected').val();
    $('.crawlingTypeHidden').val(crawlingType);
    const codeAnalysisTypeName = $("#webType .normal-codeAnalysisType option:selected").text();
    $('.normal-codeAnalysisTypeName').val(codeAnalysisTypeName);
    let data = form.serializeObject();
    $.ajax({
        type: 'POST',
        url: "/api/crawlingcontrol/request/save",
        data: data
    }).done(function (res) {
        updateListInfo(data);
        const status = $('#normal-permit').text();
        $('.approveObj').hide();
        if (status != messages.common_approved && status != messages.common_reject) {//완료상태
            $('#confirmBtnWebType').show();
        }
        toastAlert(messages.success_save);
        // initCollectionListAjax(currentKey);
    }).fail(function(data){
        Swal.fire({
            title: messages.error_save,
            text: data.msg,
            icon: "info"
        }).then(() => {
            $('.approveObj').hide();
            return;
        })
    })
}

function saveListView(form){
    const crawlingType = $('#typeSelect option:selected').val();
    $('.crawlingTypeHidden').val(crawlingType);
    const codeAnalysisTypeName = $("#listType .normal-codeAnalysisType option:selected").text();
    $('.normal-codeAnalysisTypeName').val(codeAnalysisTypeName);
    let data = form.serializeObject();
    $.ajax({
        type: 'POST',
        url: "/api/crawlingcontrol/request/save",
        data: data
    }).done(function (res) {
        updateListInfo(data);
        const status = $('#normal-permit').text();
        $('.approveObj').hide();
        if ((status != messages.common_approved && status != messages.common_reject) && ($('#flagList').val() === "성공" || $('#flagList').val() === "실패")) {
            $('#confirmBtnListType').show();
        }
        toastAlert(messages.success_save);
        // initCollectionListAjax(currentKey);
    }).fail(function(data){
        Swal.fire({
            title: messages.error_save,
            text: data.msg,
            icon: "info"
        }).then(() => {
            $('.approveObj').hide();
            return;
        })
    })
}
function saveViewForRssApi(form){
    const crawlingType = $('#typeSelect option:selected').val();
    $('.crawlingTypeHidden').val(crawlingType);
    const codeAnalysisTypeName = $("#apiRssType .normal-codeAnalysisType option:selected").text();
    $('.normal-codeAnalysisTypeName').val(codeAnalysisTypeName);
    let data = form.serializeObject();
    $.ajax({
        type: 'POST',
        url: "/api/crawlingcontrol/request/saveApiRss",
        data: data
    }).done(function (res) {
        updateListInfo(data);
        const status = $('#normal-permit').text();
        $('.approveObj').hide();
        if ((status != messages.common_approved && status != messages.common_reject) && $('#flagApiRss').val() === "성공") {//완료상태
            $('#confirmBtnApiRssType').show();
        }
        toastAlert(messages.success_save);

        // initCollectionListAjax(currentKey);
    }).fail(function (data) {
        Swal.fire({
            title: messages.error_save,
            text: data.msg,
            icon: "info"
        }).then(() => {
            $('.approveObj').hide();
            return;
        })
    });
}

//--------------------------------------------
// 승인 : (webType, listType, apiRssType)
function approve() {
    $.ajax({
        type: 'post',
        url: "/api/crawlingcontrol/request/approve",
        data: {crawlingKey: currentKey}
    }).done(function (res) {
        Swal.fire({
            title: res.msg,
            icon: "success"
        })

        // initCollectionListAjax(currentKey);
        $('.approveObj').hide();
        $('.modal').modal("hide");
        changeStatus(messages.common_approved);

        const _sendMailData = {
            crawlingKey: currentKey,
            siteName: currentTds.eq(5).text()
        }
        sendMailAlarm('/api/alarm/permit/approved', _sendMailData);
    }).fail(function (res) {
        Swal.fire({
            title: res.msg,
            icon: "error"
        }).then(() => {
            return;
        })
    });
}

//---------------------------------------------
// 반려 : (webType, listType, apiRssType)
$(document).on('click', '#rejectWeb', function() {
    reject(this);
});
$(document).on('click', '#rejectList', function() {
    reject(this);
});
$(document).on('click', '#rejectFeed', function() {
    reject(this);
});

//-------------------------------------------
/********** 반려로직 공통(site,people) *************/
function reject(obj) {
    const msgBox = $(obj).parent().parent().find('.rejectMsg');
    const rejectMsg = msgBox.val().trim();
    if(rejectMsg === ""){
        Swal.fire({
            title: "반려사유를 입력해주세요.",
            title: messages.reg_rejectMsg,
            icon: "info"
        })
        return;
    }
    $.ajax({
        type: 'post',
        url: "/api/crawlingcontrol/request/reject",
        data: {
            "crawlingKey": currentKey,
            "message": rejectMsg
        }
    }).done(function (res) {
        Swal.fire({
            title: res.msg,
            icon: "success"
        })
        $('.approveObj').hide();
        $('.modal').modal("hide");
        changeStatus(messages.common_reject);

        const _sendMailData = {
            crawlingKey: currentKey,
            siteName: currentTds.eq(5).text(),
            permitMessage: rejectMsg
        };
        sendMailAlarm('/api/alarm/permit/reject', _sendMailData);
    }).fail(function (res) {
        Swal.fire({
            title: res.responseJSON.message,
            icon: "error"
        }).then(() => {
            return;
        })
    });
}

//---------------------------------------
//저장하고 또 수정시 승인버튼 사라지게
$("input").change(function () {
    $('.approveObj').hide();
});
$("select").change(function () {
    $('.approveObj').hide();
})

//---------------------------------------
//저장 후 리스트 정보 업데이트
function updateListInfo(data){
    switch(data.codeCrawlingType) {
        case 'LIST':
            currentTds.eq(4).text('리스트타입 수집')
            break;
        case 'API':
            currentTds.eq(4).text('API/RSS타입 수집');
            break;
        case 'GENERAL':
            currentTds.eq(4).text('일반타입 수집');
            break;
        default:
            break;
    }
    let loopNo = data.loopNo;
    if(data.codeLoop==='WEEK'){
        loopNo = week[loopNo-1]
    }
    currentTds.eq(9).text(loopNo + loop.get(data.codeLoop));//수집주기
}

//------------------------------------------------------------
// 분석 필터체크박스
$(function () {
    $("input[id='filterChk1']").on('click', function(){
        setFilterVal($("#filterChk1"));
    });
    $("input[id='filterChk2']").on('click', function(){
        setFilterVal($("#filterChk2"));
    });
    $("input[id='filterChk3']").on('click', function(){
        setFilterVal($("#filterChk3"));
    });
});
// 수집정보 불러올때
function setFilterChk(val){
    if(val === "true" || val === true){
        $(".filterYn").val('1');
        $('.filterChk').prop('checked',true);
    }else{
        $(".filterYn").val('0');
        $('.filterChk').prop('checked',false);
    }
}
// 체크박스 체크이벤트
function setFilterVal(filterChk){
    if($(filterChk).is(":checked")){
        $(".filterYn").val('1');
    }else{
        $(".filterYn").val('0');
    }
}

//---------------------------------------------
//xpath 설정 새창열기
function selectXpath() {
    const testUrl = appendKeyIntoUrl();
    window.open(testUrl,"_blank");
}

//-----------------------------------
//null체크후 data or "" 리턴함수
function isNullReturnBlank(data) {
    return (data !== "" && data !== null)? data : "";
}


//--------------------------------------------------
/* url 중복검사 */

//crawlingUrl 변경시 중복검사 필요
$(document).on('change', '.modify-url', function() {
    resetCheckUrl(false);
})

//reset 클릭시 설정 초기화
$(document).on('click', '.btn-reset', function(e) {
    e.preventDefault();
    $(".modify-url").val($(".reset-crawling-url").val());
    resetCheckUrl($('.reset-isconfirmed-url').val());
})

//url 중복검사
$(document).on('click', '.btn-url-check', function(e) {
    e.preventDefault();
    let modifyUrl = $(this).siblings('.modify-url').val().trim();       // https://api.jquery.com/jquery.ajax/
    let isconfirmedUrl = $(this).siblings('.isconfirmed-url').val();
    console.log(isconfirmedUrl); // false

    if(confirmUrlDuplicate(modifyUrl, isconfirmedUrl)) {
        resetCheckUrl(false);
        $.ajax({
            type: 'POST',
            url: '/api'+ window.location.pathname +'/url',
            data: { crawlingKey: currentKey
                , crawlingUrl: modifyUrl }
        }).done(function (data) {
            if(data.message != undefined) {
                console.log("성공!!!!!!");
                toastAlert(messages.error_requestFail + "<br>" + data.alertMessage);
                return;
            } else{
                console.log("실패!!!!!!");
            }
            //중복결과
            $(".isconfirmed-url").val(!data.isDuplicate);
            toastAlert(data.alertMessage);
            //유사한 URL 목록
            if (data.urlList.length != 0) {
                data.urlList.forEach(item => {
                    let tr = "<tr>";
                    tr += "<td>" + item.siteName + "</td>";
                    tr += "<td>" + item.crawlingUrl + "</td>";
                    tr += "</tr>";
                    $(".table-check-url tbody").append(tr);
                })
                $(".check-url-result").show();
            }
        }).fail(function (data) {
            toastAlert(messages.error_requestFail + "<br>" + data.msg);
        })
    }
})

// 중복검사 설정 초기화
function resetCheckUrl(isconfirmed) {
    $(".isconfirmed-url").val(isconfirmed);
    $(".check-url-result").hide();
    $(".table-check-url tbody").html('');
}

// url 중복검사 여부 확인
function confirmUrlDuplicate(modifyUrl, isconfirmedUrl) {
    if(modifyUrl === '') {
        toastAlert(messages.reg_checkUrl);
        return false;
    }

    if(isconfirmedUrl === 'true' || isconfirmedUrl === true) {
        toastAlert(messages.reg_duplicatedUrl);
        return false;
    } else if(isconfirmedUrl === 'false' || isconfirmedUrl === false) {
        toastAlert(messages.error_alreadyExistUrl);
    }
    return true;
}

//toast-alert
function toastAlert(message) {
    $("#toastAlert .toast-body").text(message);
    $("#toastAlert").show().toast('show');
}
//------------------------------------------------------
// 수집주기&실패판단일수 비교
function compareToLoop(form){
    let data = form.serializeObject();
    let no = data.loopNo;
    let minFailDay = 0;
    switch(data.codeLoop) {
        case 'MINUTE':
            minFailDay = 1;
            break;
        case 'HOUR':
            minFailDay = Math.ceil(no/24);
            break;
        case 'DAY':
            minFailDay = no;
            break;
        case 'WEEK':
            minFailDay = 7;
            break;
        case 'MONTH':
            minFailDay = 31*no;
            break;
        default:
            break;
    }
    return data.crawlingFailRecogDay >= minFailDay;
}

/* Excel Download */
$(document).on('click', '#btnDownloadExcel', function() {
    $.fileDownload('/api'+window.location.pathname+'/excel/download', {
        httpMethod: 'GET',
        data: {
            search: $("#search").val(),
            startDate: cgstartdate, //$("#startDate").val(),
            endDate: cgenddate,     //$("#endDate").val(),
            codeCrawlingPermit: $("#permitSearch").val(),
            codeCategory: $("#categorySearch").val(),
            codeCrawlingType: $("#typeSearch").val(),
            useYn: $("#useYnSearch").val()
        },
        successCallback: function () {
            location.reload();
        },
        failCallback: function(response) {
            Swal.fire(messages.error_excelOutputFail);
        }
    })
})


function sendMailAlarm(url, sendMailData) {
    $.ajax({
        type: 'POST',
        url: url,
        data: sendMailData
    }).done(function(data) {
        console.log("성공!!");
    }).fail(function(data) {
        console.log("실패!!");
    });
}
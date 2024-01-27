
//-------------------------------------------------
//----[사이트 수집 테스트]-----------------------------------
//--1. 일반타입 수집-----------------------------------
function webTest() {
    $('#flagWeb').val('수행');
    setTestSection();
    const crawlingUrl = $('#modify-url').val();
    if(crawlingUrl==""){
        Swal.fire({
            title: "수집적용 URL을 지정해야 합니다.",
            icon: 'warning',
            allowOutsideClick: false,
        })
        return;
    }
    $('#testStartWebType').html("수집 중...");
    $('#testStartWebType').prop("disabled", true);
    $('#testResultWebType > .testGoMsg').hide();
    $('#testResultWebType > .testingMsg').show();

    Swal.fire({
        title: messages.info_testing,
        icon: 'info',
        timer: 30000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            Swal.fire({
                title: messages.error_testFail,
                icon: "error"
            })
            $('#testStartWebType').html("수집 테스트");
            $('#testStartWebType').prop("disabled", false);
            setTestSection();
            return;
        }
    })

    let jsonObj = {};
    jsonObj.url = $('#modify-url').val().trim();
    jsonObj.siteName = $('#normal-siteName').text();
    jsonObj.id = $('#normal-id2').val();
    jsonObj.pw = $('#normal-pw2').val();

    // fetch('http://61.74.186.67:48000/crawling/test/normal', {
    // fetch('http://192.168.0.33:8005/crawling/test/normal', {
    fetch('/api/crawlingcontrol/test/normal', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(jsonObj),
    })
        .then(res => {
            $('#testResultWebType>.testingMsg').hide();
            if (res.ok) {
                return res.json()
            }
            if (!res.ok) {
                Swal.fire({
                    title: messages.error_testFail,
                    icon: "error"
                })
                setTestSection();
                return;
            }
        })
        .then(res => {
            $('#testStartWebType').html("수집 테스트");
            $('#testStartWebType').prop("disabled", false);
            $('#testResultWebType>.test-box').show();

            let ul_list = $("#webTestResult");
            ul_list.append("<li><code>url</code><code>title</code><code>status_code</code></li>");
            let result;
            Object.keys(res).forEach(function (obj) { //k, json[k]
                result = res[obj];
                ul_list.append("<li><code>" + result.url + "</code><code>" + result.title + "</code><code>" + result.status_code + "</code></li>");
            })
            $('.saveReturnBtn').hide();
            $('#saveWebType').show();
            $('#flagWeb').val('성공');
            Swal.fire({
                title: messages.success_complete,
                icon: "success"
            })
        })
}



function listTest() {
    $('#flagList').val('수행');
    setTestSection();
    const stepTrCnt = $('#listTestStepResult tr').length;
    if (stepTrCnt > 0) {
        $('#listTestStepResult tr').remove();
    }
    const resultTrCnt = $('#listTestResult tr').length;
    if (resultTrCnt > 0) {
        $('#listTestResult tr').remove();
    }
    const crawlingUrl = $('#modify-url2').val();
    if (crawlingUrl == "") {
        Swal.fire({
            title: messages.req_checkUrl,
            icon: 'warning',
            allowOutsideClick: false,
        })
        return;
    }
    let returnObj = getListTestRequestInfo();
    let jsonObj = returnObj.jsonObj;

    // if (isEmpty(jsonObj.detailList) || (jsonObj.listXpath=="" && jsonObj.pageXpath!="")) {
    if (isEmpty(jsonObj.detailList)) {
        Swal.fire({
            title: messages.req_checkXpath,
            icon: "error"
        });
        returnListTestSet();
        setTestSection();
        return;
    }
    let callback = function (data) {
        // alert(data.foo);
    };
    setListTestBtn('수행')
    let listTestRequest = $.ajax({
        // url: '/api/crawling/test/list/step/1',
        url: '/api/crawlingcontrol/test/list/step/1',
        type: 'POST',
        data: JSON.stringify(jsonObj),
        contentType: "application/json; charset=utf-8"
    })
        .done(function () {
            Swal.fire({
                title: messages.success_requestTest,
                text: messages.info_requestTestText,
                icon: "success"
            });
        })
        .fail(function (data) {
            returnListTestSet();
            setTestSection();
            Swal.fire({
                title: messages.error_requestFail,
                icon: "error"
            })
            return;
        });
}

//--3. API 수집-----------------------------------
function apiTest() {
    if($(".addFeed").length > 0 ){
        toastAlert(messages.req_checkXtraMapping);
        return false;
    }
    $('#flagApiRss').val('수행');
    setTestSection();
    const tbodyCnt = $('#apiRssTestResult tbody').length;
    if (tbodyCnt > 0) {
        $('#apiRssTestResult tbody').remove();
    }
    let jsonObj = {};
    const crawlingUrl = $('#modify-url3').val().trim();
    if (crawlingUrl == "") {
        Swal.fire({
            title: messages.req_checkUrl,
            icon: 'warning',
            allowOutsideClick: false,
        })
        return;
    }
    jsonObj.crawlingKey = currentKey;
    jsonObj.listName = $('#listName').val().trim();
    jsonObj.duplicateName = $('#duplicateName').val().trim();
    jsonObj.titleName = $('#titleName').val().trim();
    jsonObj.regDateName = $('#regDateName').val().trim();
    jsonObj.contentName = $('#contentName').val().trim();
    if ($("input:checked[id='page-check']").is(':checked')){
        jsonObj.page_name = $('#pageName').val().trim();
        jsonObj.page_start = $('#pageStart').val().trim();
        jsonObj.page_end = $('#pageEnd').val().trim();
    }
    $('#extraMapping tr').each(function(){
        let mapping = $(this).find('.regMapping').html();
        let target = $(this).find('.regTarget').html();
        jsonObj[mapping] = target;
    });

    for (let key in jsonObj) {
        if (jsonObj[key] == "") {
            Swal.fire({
                title: key + messages.req_confirmInfo,
                icon: 'warning',
                allowOutsideClick: false,
            })
            setTestSection();
            return;
        }
    }
    jsonObj.targetUrl = crawlingUrl

    $('#testStartApiRssType').html("수집 중...");
    $('#testStartApiRssType').prop("disabled", true);
    $('#testResultApiRssType .table-data-list-view').show();
    $('#testResultApiRssType>.testGoMsg').hide();
    $('#testResultApiRssType>.testingMsg').show();
    let callback = function (data) {

    };
    Swal.fire({
        title: messages.success_requestTest,
        showDenyButton: true,
        allowOutsideClick: false,
        denyButtonText: '취소',
        didOpen: () => {
            Swal.showLoading();
        }
    }).then((result) => {
        if (result.isDenied) {
            apiTestRequest.abort();
            Swal.fire({
                title: messages.success_stop,
                icon: "info"
            })
            returnApiTestSet();
            return;
        }
    })
    let apiTestRequest = $.ajax({
        url: '/api/crawlingcontrol/test/feed',
        dataType: "json",
        jsonp: "callback",
        type: 'POST',
        data: JSON.stringify(jsonObj),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            let table = $("#apiRssTestResult");
            Object.keys(res).forEach(function (key) { //k, json[k]
                table.append("<tbody class='border-bottom'>");
                table.append("<tr><td class='text-left'><span class='ellipsis'>" + key + "</span></td><td><span class='ellipsis'>" + JSON.stringify(res[key]) + "</span></td></tr>");
                table.append("</tbody>");
            })
            Swal.fire({
                title: messages.success_complete,
                icon: "success"
            })
            $('#flagApiRss').val('성공');
        },
        error: function (xhr) {
            Swal.fire({
                title: messages.error_testFail,
                icon: "error"
            })
            $('#testStartApiRssType').html("수집 테스트");
            $('#testStartApiRssType').prop("disabled", false);
            returnApiTestSet();
            return;
        },
        complete: function () {
            $('.saveReturnBtn').hide();
            $('#saveApiRssType').show();
            $('#testStartApiRssType').html("수집 테스트");
            $('#testStartApiRssType').prop("disabled", false);
        }
    });
}

//-----------------------------------------------------
//테스트수집시 보내는 파라미터 json
function getListTestRequestInfo(){
    let listType = "GENERAL";
    let jsonObj = {};
    let fieldArr = [];
    jsonObj.url = $('#modify-url2').val().trim();
    jsonObj.crawlingKey = currentKey;
    jsonObj.siteName = $('#normal-siteName').text();
    jsonObj.id = $('#normal-id3').val();
    jsonObj.pw = $('#normal-encryptPw').val();
    let listPath = $('#listXpath').val();
    jsonObj.listXpath = listPath;
    let pagePath = $('#pageXpath').val();
    jsonObj.pageXpath = pagePath;
    //로그인 정보
    jsonObj.loginBtn = $('#loginBtnXpath').val();
    jsonObj.loginId = $('#idXpath').val();
    jsonObj.loginPw = $('#pwXpath').val();
    jsonObj.loginUrl = $('#loginUrl').val();

    if(pagePath===""){
        listType = 'SG_LIST';
    }
    if(listPath===""){
        listType = 'SG_PAGE';
    }

    //option 정보
    const pageOption = $('#pageOption').val();
    const listOption = $('#listOption').val();
    jsonObj.page = (pageOption == '')? {} : JSON.parse(pageOption);
    jsonObj.list = (listOption == '')? {} : JSON.parse(listOption);

    //필드값 정보
    $('#xpathTbl tbody tr').each(function(){
        let mappingObj = {};
        let fieldObj = {};
        let target = $(this).find('.target').html();
        let mapping = $(this).find('.mapping').html();
        mappingObj.options = JSON.parse($(this).find('.option').html());
        mappingObj.mapping_target = target;
        fieldObj[mapping] = mappingObj;
        fieldArr.push(fieldObj);
    });

    jsonObj.detailList = fieldArr;
    jsonObj.listType = listType;
    let returnObj = {};
    returnObj.jsonObj = jsonObj;
    return returnObj;
}

//----------------------------------------------------
// 리스트수집 버튼상태변경
function setListTestBtn(status){
    if(status === '수행'){
        $('.testResultListType .testGoMsg').hide();
        $('.testResultListType .testingMsg').show();
        $('#testStartListType').html("테스트 수행중");
        $('#testStartListType').prop("disabled", true);
    }else{
        $('.testResultListType .testGoMsg').show();
        $('.testResultListType .testingMsg').hide();
        $('#testStartListType').html("수집 테스트");
        $('#testStartListType').prop("disabled", false);
    }
}
//------------------------------------------------------
//리스트수집 결과 세팅
function showListTestResult(status){
    $.ajax({
        type: 'post',
        url: "/api/crawlingcontrol/test/result",
        data: {crawlingKey: currentKey}
    }).done(function (res) {
        if(res === null || res === "" ){return;}
        let listTypeName = res.codeListTypeName;
        console.log(JSON.stringify("리스트타입네임 "+listTypeName));
        console.log(JSON.stringify("nameTestStepStatus1 : "+res.nameTestStepStatus1));
        console.log(JSON.stringify("testStepMessage1 : "+res.testStepMessage1));
        $('.testResultListType .table-data-list-view').show();
        $('#listTestStepResult').append(
            "<tr>" +
            "<td class='text-left'><span class='ellipsis listResult'>[ " + listTypeName + " ]</span></td>" +
            "<td class='text-left'></td>" +
            "</tr>" +
            "<tr>" +
            "<td class='text-left'>본문 탐색</td>" +
            "<td class='text-left'>" + appendListStepResult(res.nameTestStepStatus1, res.testStepMessage1, true) + "</td>" +
            "</tr>");
        if(listTypeName === '단일페이지') {
            $('#flagList').val(res.nameTestStepStatus1);
            return;
        }
        $('#listTestStepResult').append(
            "<tr>" +
                "<td class='text-left'>리스트 탐색</td>" +
                "<td class='text-left'>" + appendListStepResult(res.nameTestStepStatus2, res.testStepMessage2 , false) + "</td>" +
            "</tr>");
        if (listTypeName === '단일리스트') {
            $('#flagList').val(res.nameTestStepStatus1);
            return;
        }
        $('#listTestStepResult').append(
            "<tr>" +
                "<td class='text-left'>페이지 탐색</td>" +
                "<td class='text-left'>" + appendListStepResult(res.nameTestStepStatus3, res.testStepMessage3, false) + "</td>" +
            "</tr>");
        $('#flagList').val(res.nameTestStepStatus3);
        //1단계 본문 수집 실패
    }).fail(function (data) {
        toastAlert("테스트 결과를 가져오는 도중 오류가 발생했습니다.<br>관리자에게 문의해 주세요")
    });
}

function getTestStatusMap(){
    const successLabel = "<span class='badge2 primary'>성공</span>&nbsp;&nbsp;"
    const failLabel = "<span class='badge2 red-bg'>실패</span>&nbsp;&nbsp;"
    const waitLabel = "<span class='badge2 org'>대기</span>&nbsp;&nbsp;"
    const runLabel = "<span class='badge2 blu'>수행중</span>&nbsp;&nbsp;"
    const statusSet = new Map();
    statusSet.set('성공', successLabel);
    statusSet.set('실패', failLabel);
    statusSet.set('수행', runLabel);
    statusSet.set('대기', waitLabel);

    return statusSet;
}

function appendListStepResult(stepStatus, msg, isStep1){
    const statusSet = getTestStatusMap();
    let returnHtml = "";
    returnHtml += statusSet.get(stepStatus);
    console.log("returnHtml: "+returnHtml);
    if(msg === null || msg === ''){
        if(isStep1 === true){
            $("#listTestResult").append(
                "<tr>" +
                "<td class='text-center' colspan='3'><span class='ellipsis listResult'>본문 테스트 결과값이 존재하지 않습니다.</span></td>" +
                "</tr>");
        }
        return returnHtml;
    }
    let resultJson = JSON.parse(msg);
    console.log(" resultJson 결과  "+JSON.stringify(resultJson));
    if(stepStatus === '성공'){
        if(isStep1 === true){
            let fieldKey = Object.keys(resultJson);
            let resultMenu = {};
            //필드값 정보
            $('#xpathTbl tbody tr').each(function(){
                let mapping = $(this).find('.mapping').html();
                resultMenu[mapping] = $(this).find('.targetName').html();
            });
            fieldKey.forEach(function (key) {
                $("#listTestResult").append(
                    "<tr>" +
                    "<td class='text-left'><span class='ellipsis listResult'>" + key + "</span></td>" +
                    "<td class='text-left'><span class='ellipsis listResult'>" + resultMenu[key] + "</span></td>" +
                    "<td class='text-left'><span class='ellipsis listResult'>" + resultJson[key] + "</span></td>" +
                    "</tr>");
            });
        }
    }else if(stepStatus === '실패'){
        returnHtml += resultJson['msg'];
        if(isStep1 === true){
            $("#listTestResult").append(
                "<tr>" +
                "<td class='text-center' colspan='3'><span class='ellipsis listResult'>본문 테스트 결과값이 존재하지 않습니다.</span></td>" +
                "</tr>");
        }
    }
    return (returnHtml === undefined || returnHtml === "")? "-" : returnHtml;
}
//--------------------------------
// xpath설정 url에 크롤링키추가
function appendKeyIntoUrl(){
    const paramN = "?xtrm=";
    const paramY = "&xtrm=";
    let url = $('#modify-url2').val().trim();
    let newUrl = '';
    if(url.indexOf('?')=== -1){
        newUrl = url + paramN;
    }else{
        newUrl = url + paramY;
    }
    return newUrl + currentKey;
}

/****** 인물 테스트 *******/
//-------------------------------------------------
function peopleTest() {
    peopleTestSet();
    let flagFacebook = $('#flagFacebook').val();
    let flagLinkedin = $('#flagLinked').val();
    let flagGoogle = $('#flagGoogle').val();

    let jsonObj = getPeopleJsonBody();
    jsonObj.listType = 'people';

    //0:테스트진행, 1:스킵
    if( !$('#people-linUrl2').val() || flagLinkedin === '성공'){
        jsonObj.linkedinStatus = "0"
    }else{
        jsonObj.linkedinStatus = "1"
        $('#flagLinked').val('수행');
    }
    if( !$('#people-facUrl2').val() || flagFacebook === '성공' ){
        jsonObj.facebookStatus = "0"
    }else{
        jsonObj.facebookStatus = "1"
        $('#flagFacebook').val('수행');
    }
    if( !$('#people-gooUrl2').val() || flagGoogle === '성공' ){
        jsonObj.googleStatus = "0"
    }else{
        jsonObj.googleStatus = "1"
        $('#flagGoogle').val('수행');
    }

    let PeopleTestRequest = $.ajax({
        url: '/api/crawlingcontrol/test/people',
        type: 'POST',
        data: JSON.stringify(jsonObj),
        contentType: "application/json; charset=utf-8"
    })
        .done(function () {
            Swal.fire({
                title: messages.success_complete,
                text: messages.info_requestTestText,
                icon: "success"
            });
        })
        .fail(function (data) {
            setTestSection();
            peopleTestReturn();
            Swal.fire({
                title: messages.error_testFail,
                text: JSON.stringify(data.message),
                icon: "error"
            })
            return;
        });
}

/****** 인물 테스트 결과 *******/
function showPeopleTestResult(status){
    if(status === '수행'){
        return;
    }
    $.ajax({
        type: 'post',
        url: "/api/crawlingcontrol/test/result",
        data: {crawlingKey: currentKey}
    }).done(function (res) {
        console.log(res);
        if ($('#linkedinResult tr').length > 0) {
            $('#linkedinResult tr').remove();
        }
        if ($('#faceBookResult tr').length > 0) {
            $('#faceBookResult tr').remove();
        }
        if(res === null || res === "" ){return;}
        $('#flagLinked').val(res.nameTestStepStatus1);
        appendlinkedTestResult(res.testStepMessage1, res.nameTestStepStatus1);
        $('#flagFacebook').val(res.nameTestStepStatus2);
        appendFacebookTestResult(res.testStepMessage2, res.nameTestStepStatus2);
    }).fail(function (data) {
        toastAlert(messages.error_testResultFail)
    });
}

//-----------------------
// sns별 결과 세팅
function appendlinkedTestResult(res, status){
    $('#linkedin-test').show();
    let tbody = $("#linkedinResult");
    appendResultInTbody(tbody, res, status)
}
function appendFacebookTestResult(res, status){
    $('#facebook-test').show();
    let tbody = $("#faceBookResult");
    appendResultInTbody(tbody, res, status)
}


//-----------------------
// 인물 테스트 결과 뿌리기(공통)
function appendResultInTbody(tbody, res, status) {
    if (status === '수행' || status === '대기') {
        return;
    }
    let resultJson = JSON.parse(res);
    const statusSet = getTestStatusMap();
    tbody.append("<tr><th>결과</th><td class='vertical-top'>" + statusSet.get(status) + "</td></tr>");
    if (status === '실패') {
        tbody.append("<tr><th class='vertical-top'>실패 사유</th><td><div>" + resultJson['msg'] + "</div></td></tr>");
        return;
    }
    let target = JSON.parse(resultJson['target']);
    let friends = JSON.parse(resultJson['friends']);
    let targetKey = Object.keys(target);
    let friendsKey = Object.keys(friends);

    let targetHtml = "<tr><th>타겟</th>";
    targetHtml += "<td>"
    targetKey.forEach(function (key) {
        targetHtml += "<b>" + key + "</b>: " + target[key] + "<br>"
        // tbody.append("<b>" + key + "</b>: " + target[key]+ "<br>");
    });
    targetHtml += "</td></tr>";
    tbody.append(targetHtml);

    let friendsHtml = "<tr><th>친구중 1명</th>";
    friendsHtml += "<td>"
    friendsKey.forEach(function (key) {
        friendsHtml += "<b>" + key + "</b>: " + friends[key] + "<br>"
    });
    friendsHtml += "</td></tr>";
    tbody.append(friendsHtml);
}
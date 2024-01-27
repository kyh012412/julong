//--------------------------------------------------
//인물 수집 상세페이지
$(document).on('click', '.people-tr', function () {
    $("#collectionList tr").removeClass('active');
    $(this).addClass('active');

    let tdsOfTr = $(this).children();
    setCurrentInfo(tdsOfTr);
    setTimeout(function() {
        $('#collectModal_002').modal();
    }, 500);
    getPeopleView();
})

//----------------------------------------------------------
/****  인물 수집 설정  ****/

//반려
$(document).on('click', '#returnBtnSnsType', function() {
    $('#returnSnsType').show();
    $('#approvedSnsType').hide();
});
//승인
$(document).on('click', '#approvedBtnSnsType', function() {
    if($('#people-linUrl2').val() !== "" && $('#flagLinked').val() !== '성공'){
        Swal.fire({
            title: "Linkedin" + messages.req_testFirst,
            icon: "warning"
        })
        return;
    }
    if($('#people-facUrl2').val() !== "" && $('#flagFacebook').val() !== '성공'){
        Swal.fire({
            title: "Facebook" + messages.req_testFirst,
            icon: "warning"
        })
        return;
    }
    if($('#people-gooUrl2').val() !== "" && $('#flagGoogle').val() !== '성공'){
        Swal.fire({
            title: "Google" + messages.req_testFirst,
            icon: "warning"
        })
        return;
    }
    $('#returnSnsType').hide();
    $('#approvedSnsType').show();
});

//---------------------------
//2.인물
function getPeopleView() {
    $.ajax({
        type: 'post',
        url: "/api/crawlingcontrol/request/view/people",
        data: {crawlingKey: currentKey}
    }).done(function (info) {
        $('.people-key').text(info.crawlingKey);
        $('.crawlingKeyHidden').val(info.crawlingKey);
        $('.switch-input').prop('checked', info.useYn);
        $('#people-nation').text(isNullReturnBlank(info.codeNationName));
        $('#people-permit').text(info.localeCodeCrawlingPermit);
        permitStatusBadge(info.localeCodeCrawlingPermit);
        $('#people-category').text(info.localeCodeCategory);
        $('#people-name').text(isNullReturnBlank(info.name));
        $('#people-email').text(isNullReturnBlank(info.email));
        $('#people-phone').text(isNullReturnBlank(info.phoneNo));
        $('#people-tel').text(isNullReturnBlank(info.telNo));
        let loopNo = info.loopNo==0? 1 : info.loopNo;
        $('#people-loopNo').val(loopNo);
        $("select[name='codeLoop'] option").each(function () {
            if ($(this).text() === info.codeLoop) {
                $(this).prop('selected', true);
            }
        })
        $('#people-companyUrl').text(isNullReturnBlank(info.companyUrl));
        $('#people-companyName').text(isNullReturnBlank(info.companyName));
        $('#people-rank').text(isNullReturnBlank(info.rank));
        $('#people-linUrl').text(isNullReturnBlank(info.linkedinUrl));
        $('#people-facUrl').text(isNullReturnBlank(info.facebookUrl));
        $('#people-gooUrl').text(isNullReturnBlank(info.googleUrl));
        $('#people-linUrl2').val(isNullReturnBlank(info.linkedinUrl));
        $('#people-facUrl2').val(isNullReturnBlank(info.facebookUrl));
        $('#people-gooUrl2').val(isNullReturnBlank(info.googleUrl));
        $('#people-remark').text(info.remark);
        $('#linkedId').val(isNullReturnBlank(info.linkedinId));
        $('#linkedPw').val(isNullReturnBlank(info.decrypedLinkedinPassword));
        $('#encryptedLinkedPw').val(isNullReturnBlank(info.linkedinPassword));
        $('#facebookId').val(isNullReturnBlank(info.facebookId));
        $('#facebookPw').val(isNullReturnBlank(info.decrypedFacebookPassword));
        $('#encryptedFacebookPw').val(isNullReturnBlank(info.facebookPassword));
        $('#googleId').val(isNullReturnBlank(info.googleId));
        $('#googlePw').val(isNullReturnBlank(info.decrypedGooglePassword));
        $('#encryptedGooglePw').val(isNullReturnBlank(info.googlePassword));
        $('#people-filePath').attr("src", '/upload/business_card/' + info.cardFile);
        let scheduleTime = info.scheduleTime;
        scheduleTime = scheduleTime.replace('AM', '오전').replace('PM', '오후')
        $('#people-timePicker').prop('value', (scheduleTime != null ? scheduleTime : "9:00 오전"));
        //기본탭설정
        $("#nav-tab2_1").trigger("click");
        $('.people-test').hide();
        //스케쥴리스트 콤보박스 default
        $('.select-status').val('').attr("selected", true);
        setPeopleTestSection(info.codeTestStepStatus);
        $(".approveObj").hide();
        // if(info.codeCrawlingPermit == '승인' || info.codeCrawlingPermit == '반려'){
        //     $("#confirmBtnSnsType").hide();
        // }
        if(info.codeTestStepStatus !== '대기'){
            showPeopleTestResult(info.codeTestStepStatus);
        }
    }).fail(function (data) {
        Swal.fire({
            title: messages.error_requestFail,
            text: data.responseJSON.message,
            icon: "error"
        }).then(() => {
            $('.modal').modal("hide");
            return;
        })
    });
}

//--------------------------------------------------------------------------
function peopleTestSet(){
    $('#testStartPeopleType').html("테스트 수행중");
    $('#testStartPeopleType').prop("disabled", true);
    $('#testResultPeopleType > .testGoMsg').hide();
    $('#testResultPeopleType > .testingMsg').show();
}
function peopleTestReturn(){
    $('#testStartPeopleType').html("테스트 수집");
    $('#testStartPeopleType').prop("disabled", false);
    $('#testResultPeopleType > .testGoMsg').show();
    $('#testResultPeopleType > .testingMsg').hide();
}

//---------------------------------------------
// 인물저장
function savePeopleView(){
    const data = $('#snsTypeForm').serializeObject()
    $.ajax({
        type: 'POST',
        url: "/api/crawlingcontrol/request/savePeople",
        data: data
    }).done(function (res) {
        currentTds.eq(4).text('인명정보 수집')
        const status = $('#people-permit').text();
        $('.approveObj').hide();
        if ((status != messages.common_approved && status != messages.common_reject)) {
            $('#confirmBtnSnsType').show();
        }
        toastAlert( res.msg);
        // initCollectionListAjax(currentKey);
    }).fail(function(data){
        Swal.fire({
            title: messages.error_save,
            text: data.responseJSON.message,
            icon: "error"
        }).then(() => {
            $('.approveObj').hide();
            return;
        })
    })
}


//---------------------------------------------
// 인물승인
function approvePeople(){
    $.ajax({
        type: 'post',
        url: "/api/crawlingcontrol/request/approve",
        contentType: 'application/json',
        data: {crawlingKey: currentKey}
    }).done(function (res) {
        Swal.fire({
            title: messages.success_approve,
            icon: "success"
        })
        $('.approveObj').hide();
        $('.modal').modal("hide");
        changeStatus(messages.common_approved);
    }).fail(function (data) {
        Swal.fire({
            title: messages.error_requestFail,
            text: data.msg,
            icon: "error"
        }).then(() => {
            return;
        })
    });
}

//---------------------------------------------
// 반려 : (people)
$(document).on('click', '#rejectPeople', function() {
    reject(this);
});

function setPeopleTestSection(status) {
    //테스트수집 관련
    $('.test-box').hide();
    $('.testingMsg').hide();
    $('.testGoMsg').show();
    $('#confirmBtnSnsType').show();
    $('.people-test').hide();
    if(status === '수행'){
        peopleTestSet();
    }else{
        peopleTestReturn();
    }
}

function getPeopleJsonBody(){
    let jsonObj = {};
    jsonObj.crawlingKey = currentKey;
    jsonObj.linkedinId = $('#linkedId').val();
    jsonObj.linkedinPw = $('#encryptedLinkedPw').val();
    jsonObj.linkedinUrl = $('#people-linUrl2').val();
    jsonObj.facebookId = $('#facebookId').val();
    jsonObj.facebookPw = $('#encryptedFacebookPw').val();
    jsonObj.facebookUrl = $('#people-facUrl2').val();
    jsonObj.googleId = $('#googleId').val();
    jsonObj.googlePw = $('#encryptedGooglePw').val();
    jsonObj.googleUrl = $('#people-gooUrl2').val();
    return jsonObj;
}
//---------------------------------------------------
//xpath 지정 후 새로고침
function callAndReloadXpath() {
    setPathInfo('LIST');
}

//------------------------------------
//crawlingDetail 테이블 정보 불러오기
function setPathInfo(crawlingType) {
    const trCnt = $('#xpathTbl > tbody tr').length;
    if (trCnt > 0) {
        $('#xpathTbl > tbody tr').remove();
    }
    if ($('#extraMapping tr').length > 0){
        $('#extraMapping tr').remove();
    }
    $('.listPath').val("");
    $('.api-field').val("");
    $('#pageType').text('옵션: ');
    $.ajax({
        type: 'post',
        url: "/api/crawlingcontrol/request/path",
        data: {crawlingKey: currentKey}
    }).done(function (crawlingDetail) {
        if (crawlingDetail != null && crawlingDetail != "") {
            switch (crawlingType) {
                case 'LIST':
                    setListDetail(crawlingDetail);
                    break;
                case 'API':
                    setApiDetail(crawlingDetail);
                    break;
                case '0':
                    setListDetail(crawlingDetail);
                    break;
                default:
                    break;
            }
        }
    }).fail(function (data) {
        Swal.fire({
            title: messages.error_requestFail,
            text: data.responseJSON.message,
            icon: "info"
        }).then(() => {
            return;
        })
    });


}
//--------------------------------------------------------
// crawlingDetail 정보 셋팅
function setListDetail(crawlingDetail) {
    $.each(crawlingDetail, function (index, crawlingDetail) {
        switch (crawlingDetail.mapping) {
            case "list" :
                $('#listXpath').val(crawlingDetail.target);
                $('#listOption').val(crawlingDetail.crawlingOption);
                break;
            case "page" :
                $('#pageXpath').val(crawlingDetail.target);
                $('#pageOption').val(crawlingDetail.crawlingOption);
                let pageType = JSON.parse(crawlingDetail.crawlingOption);
                console.log("페이지타입"+JSON.stringify(pageType));
                $('#pageType').text('option: ' + pageType['option_page_type']);
                break;
            case "login_id" :
                $('#idXpath').val(crawlingDetail.target);
                break;
            case "login_pw" :
                $('#pwXpath').val(crawlingDetail.target);
                break;
            case "login_btn" :
                $('#loginBtnXpath').val(crawlingDetail.target);
                break;
            default :
                $("#xpathTbl>tbody").append("<tr>"
                    + "<td class='text-left'><span class='ellipsis target'>" + crawlingDetail.target + "</span></td>"
                    + "<td class='text-left'><span class='ellipsis mapping'>" + crawlingDetail.mapping + "</span></td>"
                    + "<td class='text-left'><span class='ellipsis targetName'>" + crawlingDetail.targetName + "</span></td>"
                    + "<td class='text-left'><span class='ellipsis'>" + JSON.parse(crawlingDetail.crawlingOption).option_html + "</span></td>"
                    + "<td class='option' style='visibility:hidden;position:absolute;'>" + crawlingDetail.crawlingOption + "</td>"
                    + "</tr>");

                break;
        }
    });
}

//api type mapping 정보 셋팅
function setApiDetail(crawlingDetail){
    $("input:checkbox[id='pageYn']").prop("checked", false);
    unCheckedPage();
    $.each(crawlingDetail, function (index, crawlingDetail) {
        switch (crawlingDetail.mapping) {
            case 'listName':
                $('#listName').val(crawlingDetail.target);
                break;
            case 'duplicateName':
                $('#duplicateName').val(crawlingDetail.target);
                break;
            case 'titleName':
                $('#titleName').val(crawlingDetail.target);
                break;
            case 'regDateName':
                $('#regDateName').val(crawlingDetail.target);
                break;
            case 'contentName':
                $('#contentName').val(crawlingDetail.target);
                break;
            case 'pageName':
                $("input:checkbox[id='pageYn']").prop("checked", true);
                $("#pageYn").val('1');
                $('.page-field').prop('readonly', false);
                $('#pageName').val(crawlingDetail.target);
                let pageRange = JSON.parse(crawlingDetail.crawlingOption);
                $('#pageStart').val(pageRange['pageStart']);
                $('#pageEnd').val(pageRange['pageEnd']);
                break;
            default:
                let extraTbody = $('#extraMapping:last');
                extraTbody.append(
                    "<tr>"+
                    "<td class='text-left'><span class='ellipsis regMapping'>" + crawlingDetail.mapping + "</span></td>"+
                    "<td class='text-left'><span class='ellipsis regTargetName'>" + crawlingDetail.targetName + "</span></td>"+
                    "<td class='text-left'><span class='ellipsis regTarget'>" + crawlingDetail.target + "</span></td>"+
                    "<td class='side-padding-5'><button type='button' class='btn-brd-bg-gray btn-xs' onclick='deleteLine(this);'>-</button></td>"+
                    "</tr>"
                );
                break;
        }
    });
}

//---------------------------------------------
/*** feed 추가 매핑정보관련 ***/
// api타입 추가 매핑정보
$(function () {
    $("#addMapping").on('click', function(){
        let extraTbody = $('#extraMapping:last');
        extraTbody.append(
            "<tr>"+
            "<td><input type='text' class='form-control-sm addFeed api-field adMapping'></td>"+
            "<td><input type='text' class='form-control-sm addFeed api-field adTargetName'></td>"+
            "<td><input type='text' class='form-control-sm addFeed api-field adTarget'></td>"+
            "<td class='side-padding-5'>" +
            "<button type='button' class='btn-brd-gray btn-xs' onclick='mappingOk(this);'>&#10003;</button>&nbsp;"+
            "<button type='button' class='btn-brd-bg-gray btn-xs' onclick='deleteLine(this);'>-</button>" +
            "</td>"+
            "</tr>"
        );
    });
});

//feed 추가 매핑정보 row삭제
function deleteLine(obj){
    let tr = $(obj).parent().parent();
    tr.remove();
}

//feed 추가 매핑정보 확인
function mappingOk(obj){
    let tr = $(obj).parent().parent();
    let mappingMap = {};
    mappingMap.mapping = $(tr).find(['.adMapping'][0]).val().trim();
    mappingMap.targetName = $(tr).find(['.adTargetName'][0]).val().trim();
    mappingMap.target = $(tr).find(['.adTarget'][0]).val().trim();
    for(let key in mappingMap){
        if(!mappingMap[key]){
            toastAlert(messages.req_checkXtraMapping);
            return false;
        }
    }
    $(tr).html(
        "<td class='text-left'><span class='ellipsis regMapping'>" + mappingMap.mapping + "</span></td>"+
        "<td class='text-left'><span class='ellipsis regTargetName'>" + mappingMap.targetName + "</span></td>"+
        "<td class='text-left'><span class='ellipsis regTarget'>" + mappingMap.target + "</span></td>"+
        "<td class='side-padding-5'><button type='button' class='btn-brd-bg-gray btn-xs' onclick='deleteLine(this);'>-</button></td>"
    );
}

//feed 추가 매핑정보저장
function saveAdtionFeed(){
    if($(".addFeed").length > 0 ){
        toastAlert(messages.req_checkXtraMapping);
        return false;
    }
    let mappingArr = [];
    const mappingCnt = $("#extraMapping tr").length;
    if (mappingCnt > 0) {
        $('#extraMapping tr').each(function(){
            let mappings = {};
            mappings.mapping = $(this).find('.regMapping').html();
            mappings.targetName = $(this).find('.regTargetName').html();
            mappings.target = $(this).find('.regTarget').html();
            mappingArr.push(mappings);
        });
        $('#additionMappingJson').val(JSON.stringify(mappingArr));
    }else{
        $('#additionMappingJson').val("");
    }
    return true;
}

//-------------------------------------------------
//api수집시 페이지 필드값 체크박스 설정
$(function () {
    $("input[id='pageYn']").on('click', function(){
        if($("#pageYn").is(":checked")){
            checkedPage();
        }else{
            unCheckedPage();
        }
    });
});

function checkedPage(){
    $("#pageYn").val('1');
    $('.page-field').prop('readonly', false);
}
function unCheckedPage(){
    $("#pageYn").val('0');
    $('.page-field').prop('readonly', true).val('');
}
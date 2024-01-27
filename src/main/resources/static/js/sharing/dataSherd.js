var _fileNo = 0;
var _filesArr = new Array();

let messages; //message.properties values
$(document).ready(function () {
    //getMessages();
});

function getMessages(){
    messages = JSON.parse($('#messages').val());
}
$(document).ready(function() {
    const _currentUrl = new URL(window.location.href);
    const _categoryParams = _currentUrl.searchParams.get("category");

    if(_categoryParams != null) {
        searchCategory(_categoryParams);
    } else {
        selectedCategory($(".nav-side-menu>ul>li:eq(0)"));
    }

    $("#siteRequestTable").parsley().reset();
    //$("#peopleRequestTable").parsley().reset();
    //$("#siteRequestTable, #peopleRequestTable").find("input, select").val('');
    //$("#siteRequestTable, #peopleRequestTable").find("input[type='checkbox']").attr("checked", false);
    //$("#ocrInfo").hide();
    //$('[name="codeNation"]').select2();
})

/* 카테고리 선택 */
$(document).on('click', '.nav-side-menu>ul>li', function() {
    selectedCategory($(this));
})

/* 사이트 수집 */
$(document).on('click', '#btnUrlReset', function(){
    $('#siteRequestTable [name="siteUrl"]').val("");
    $("#siteRequestTable .isconfirmed-url").val(false);
})


/* 중복 submit 방지 변수 */
let doubleSubmitFlag = false;
//사이트 등록
$(document).on('click', '#btnRequestSite', function(e) {
    e.preventDefault();
    if(doubleSubmitFlag == true) {
        return;
    }

    const _validation = $("#siteRequestTable").parsley();
    if(_validation.validate()) {
        Swal.fire({
            //title : $('.selected-category').text()+ '- ' + messages.confirm_requestCollection,
			title : $('.selected-category').text(),
            icon : 'info',
            showCancelButton : true,
            confirmButtonClass : 'btn-danger',
            confirmButtonText : '요청',
            cancelButtonText : '취소',
            closeOnConfirm : false,
            closeOnCancel : true,
            _closeOnClickOutside: false
        }).then((isConfirm) => {
            if (isConfirm.isConfirmed) {
                doubleSubmitFlag = true;
                insertSiteAjax();
            }else{
                doubleSubmitFlag = false;
                Swal.close();
            }
        });
    }

})


/* 인물 수집 */
//인물 등록


function selectedCategory(element) {
    $(".nav-side-menu>ul>li.menu-item").removeClass("active");
    element.addClass("active");
    $(".selected-category").text(element.text());
    $("[name='codeCategory']").val(element.attr('value'));

    if(element.attr('value') === 'PEOPLE') {
        $(".btn-site-request, #siteRequestTable").removeClass("show").addClass("hide");
        $(".btn-people-request, #peopleRequestTable").removeClass("hide").addClass("show");
    } else {
        $(".btn-site-request,  #siteRequestTable").removeClass("hide").addClass("show");
        $(".btn-people-request,  #peopleRequestTable").removeClass("show").addClass("hide");
    }
}

function searchCategory(_categoryParams) {
    let searchYn = false;
    $(".nav-side-menu>ul>li").each(function() {
        if($(this).attr('value') === _categoryParams) {
            selectedCategory($(this));
            searchYn = true;
            return false;
        }
    })

    if(!searchYn) {
        selectedCategory($(".nav-side-menu>ul>li:eq(0)"));
    }
}

function insertSiteAjax() {
	//for (const file of $("#FileForm").files) {
	//}
/*
	var form = document.querySelector("form");
    var _myinfoFormData = new FormData(form);

	for (var i = 0; i < _filesArr.length; i++) {
        // 삭제되지 않은 파일만 폼데이터에 담기
        if (!_filesArr[i].is_delete) {
            _myinfoFormData.append("attach_file", _filesArr[i]);
        }
    }
	*/
/*
	const _myinfoFormData = new FormData($("#FileForm")[0]);
	_myinfoFormData.append("dataname", $('#dataName').val());
	_myinfoFormData.append("codeNation", $('#codeNation').val());
	_myinfoFormData.append("dataSourceDesc", $('#dataSourceDesc').val());
	_myinfoFormData.append("dataDesc", $('#dataDesc').val());
*/
	var _myinfoFormData = new FormData($("#FileForm")[0]);
	_myinfoFormData.append("dataname", $('#dataName').val());
	_myinfoFormData.append("codeNation", $('#codeNation').val());
	_myinfoFormData.append("dataSourceDesc", $('#dataSourceDesc').val());
	_myinfoFormData.append("dataDesc", $('#dataDesc').val());

//	for (var i = 0; i < $('#filedata').length; i++) {
        // 삭제되지 않은 파일만 폼데이터에 담기
//		_myinfoFormData.append("attach_file", $('#filedata')[i]);
  //  }

    $.ajax({
        type: 'POST',
        url: '/sharing/dataSharedInsertAjax',
		data: _myinfoFormData,
		enctype: 'multipart/form-data',
		cache: false,
		processData: false,
		contentType: false
    }).done(function(data) {
        if(data.message != undefined) {
            ajaxFail(data);
            return;
        }
        ajaxSuccess(data);
    }).fail(function (data) {
        ajaxFail(data);
    });
}

/*
function insertPeopleAjax() {
    const _requestFormData = new FormData($("#peopleRequestTable #ocrForm")[0]);
    _requestFormData.append("codeCategory", $('[name="codeCategory"]').val());
    _requestFormData.append("codeNation", $('#peopleRequestTable [name="codeNation"]').val());
    _requestFormData.append("linkedinUrl", $('#peopleRequestTable [name="linkedinUrl"]').val().trim());
    _requestFormData.append("linkedinId", $('#peopleRequestTable [name="linkedinId"]').val().trim());
    _requestFormData.append("linkedinPassword", $('#peopleRequestTable [name="linkedinPassword"]').val().trim());
    _requestFormData.append("facebookUrl", $('#peopleRequestTable [name="facebookUrl"]').val().trim());
    _requestFormData.append("facebookId", $('#peopleRequestTable [name="facebookId"]').val().trim());
    _requestFormData.append("facebookPassword", $('#peopleRequestTable [name="facebookPassword"]').val().trim());
    _requestFormData.append("googleUrl", $('#peopleRequestTable [name="googleUrl"]').val().trim());
    _requestFormData.append("googleId", $('#peopleRequestTable [name="googleId"]').val().trim());
    _requestFormData.append("googlePassword", $('#peopleRequestTable [name="googlePassword"]').val().trim());
    _requestFormData.append("remark", $('#peopleRequestTable [name="remark"]').val());

    $.ajax({
        type: 'POST',
        url: '/api'+ window.location.pathname +'/people',
        data: _requestFormData,
        enctype: 'multipart/form-data',
        cache: false,
        processData: false,
        contentType: false
    }).done(function (data) {
        ajaxSuccess(data);
    }).fail(function (data) {
        ajaxFail(data);
    });
}
*/
function ajaxSuccess(data) {
/*    Swal.fire({
        title : messages.success_requestCollection,
        text : messages.info_requestCollection,
        icon : 'success',
        showCancelButton : true,
        confirmButtonClass : 'btn-danger',
        confirmButtonText : messages.button_goToList,
        cancelButtonText : messages.button_anotherRequest,
        closeOnConfirm : false,
        closeOnCancel : false,
        _closeOnDocumentClick: false,
        _closeOnClickOutside: false
    }).then((isConfirm) => {
        if (isConfirm.isConfirmed) {
            location.href = "/sharing/dataSharedList";
        }else{
            location.href = window.location.href;
        }
    });
	*/
	location.href = "/sharing/dataSharedList";
}

function ajaxFail(data) {
    doubleSubmitFlag = false;
    let errormsg = "";
    if(data.message != undefined) errormsg = data.message;
    else if(data.responseJSON.message != undefined) errormsg = data.responseJSON.message;
    Swal.fire({
        title: messages.error_requestFail,
        text: errormsg,
        icon: 'error',
        _closeOnClickOutside: false
    })
}

function fileupload(){

    var form = $("#FileForm")[0];
    var formData = new FormData(form);
    formData.append("fileData", $("#filedata")[0].files[0]);
    //formData.append("pdfAfterData", $("#pdfAfterData")[0].files[0]);
    var inUpConfirm = confirm("파일 전송 하시겠습니까?");
    if(inUpConfirm == true) {
        /*$("#myinfo_photoFileForm").attr('action','/admin/api/power/user/authexcel');*/
        $(".spinner-wrap").show();

        $.ajax({
            type:"POST",
            url: "/sharing/fileupload",
            processData: false,
            async : false,
            contentType: false,
            data: formData
        })
            .done( function(rtn){
                flag=true;
            }).fail( function(error){
            alert("Upload 실패!!");
        });

    }
}

/* 첨부파일 추가 */
function addFile(obj){
    var maxFileCnt = 5;   // 첨부파일 최대 개수
    var attFileCnt = document.querySelectorAll('.filebox').length;    // 기존 추가된 첨부파일 개수
    var remainFileCnt = maxFileCnt - attFileCnt;    // 추가로 첨부가능한 개수
    var curFileCnt = obj.files.length;  // 현재 선택된 첨부파일 개수

    // 첨부파일 개수 확인
    if (curFileCnt > remainFileCnt) {
        alert("첨부파일은 최대 " + maxFileCnt + "개 까지 첨부 가능합니다.");
    }

    for (var i = 0; i < Math.min(curFileCnt, remainFileCnt); i++) {
        const file = obj.files[i];

        // 첨부파일 검증
        //if (f_validation(file)) {
            // 파일 배열에 담기
            var reader = new FileReader();
            reader.onload = function () {
                _filesArr.push(file);
            };
            reader.readAsDataURL(file)

            // 목록 추가
            let htmlData = '';
            htmlData += '<div id="file' + _fileNo + '" class="filebox">';
            htmlData += '   <p class="name">' + file.name + '</p>';
            htmlData += '   <a class="delete" onclick="f_deleteFile(' + _fileNo + ');"><i class="far fa-minus-square"></i></a>';
            htmlData += '</div>';
            $('.file-list').append(htmlData);
            _fileNo++;
        //} else {
        //    continue;
        //}
    }
    // 초기화
    document.querySelector("input[type=file]").value = "";
}

/* 첨부파일 검증 */
function f_validation(obj){
    const fileTypes = ['application/pdf', 'image/gif', 'image/jpeg', 'image/png', 'image/bmp', 'image/tif', 'application/haansofthwp', 'application/x-hwp'];
    if (obj.name.length > 100) {
        alert("파일명이 100자 이상인 파일은 제외되었습니다.");
        return false;
    } else if (obj.size > (100 * 1024 * 1024)) {
        alert("최대 파일 용량인 100MB를 초과한 파일은 제외되었습니다.");
        return false;
    } else if (obj.name.lastIndexOf('.') == -1) {
        alert("확장자가 없는 파일은 제외되었습니다.");
        return false;
    } else if (!fileTypes.includes(obj.type)) {
        alert("첨부가 불가능한 파일은 제외되었습니다.");
        return false;
    } else {
        return true;
    }
}

/* 첨부파일 삭제 */
function f_deleteFile(num) {
    document.querySelector("#file" + num).remove();
    filesArr[num].is_delete = true;
}


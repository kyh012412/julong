let messages; //message.properties values
$(document).ready(function () {
    getMessages();
});
function getMessages(){
    messages = JSON.parse($('#messages').val());
}

$(document).ready(function() {

    $("#resizableList").css({minWidth: '950px', maxWidth: '1500px', width: '65%'});
    let section_width = $("#resizableList").width();
    let div_width = $("#searchArea").width();
    $("#contentView").css({width: '35%', minWidth: 'calc(100% - 1500px)', maxWidth: 'calc(100% - 950px)'});
    $("#searchArea").css('left', 'calc(100% + '+ (section_width - div_width - 75) +'px)');

    $("#resizableList").resizable({
        minWidth: 950,
        maxWidth: 1500,
        handles: 'e',
        resize: function( e, ui){
            var currentWidth = ui.size.width;
            var gap = 0; currentWidth += gap;
            $("#contentView").css('width', 'calc(100% - '+ currentWidth +'px)');

            let section_width = $("#resizableList").width();
            let div_width = $("#searchArea").width();
            $("#searchArea").css('left', 'calc(100% + '+ (section_width - div_width - 75) +'px)');
        }
    });

    //initRequestListAjax();

});

$(window).load(function () {
	$("#openSiteDeleteModal").attr('disabled', true);

	initFn();
	initRequestListAjax();
});

$(window).resize(function() {
    let window_height =  $(window).height();
    let div_height = window_height - 330;

    $(".dataTables_wrapper>.brd-top-box>.scroll").css("height", div_height + "px");

    let section_width = $("#resizableList").width();
    let div_width = $("#searchArea").width();
    $("#searchArea").css("left", "calc(100% + "+ (section_width - div_width - 75) +"px)");
});


function initFn() {
	$('#dataSharedRequestList').DataTable( {
		order: [0, 'desc'],
		ordering: false,
		paging: true,
		destroy: true,
		pageLength: 20,
		pagingType: "full_numbers_no_ellipses",
		info: false,
		LengthChange: true,
		lengthMenu: [20, 40, 60, 80, 100 ],
		dom:
			"<'row'<'select-count'l>>" +
			"<'thead-fixed'<'scroll admin'tr>>" +
			"<'col'p>",
		language: {
		   zeroRecords: TEXT_NO_DATA,
		   search: "",
		   searchPlaceholder: TEXT_INPUT_TEXT,
		   lengthMenu:TEXT_N_ROWS_PER_PAGE,
		   paginate: {
			   first:"맨앞",
			   previous:"이전",
			   next: "다음",
			   last:"맨뒤"
		   }
	   },
/*		select: true,
		autoWidth : false,
		searching: false,
		stateSave: false,
		serverSide: true,
		processing : true,
		destroy: true,
*/
		columns: [
                { title: "<span class='ellipsis'>Key</span>",        data: "dataKey",		    width: "10%"},
                { title: "<span class='ellipsis'>자료 제목</span>",	 data: "dataname",	        width: "10%"},
                { title: "<span class='ellipsis'>자료 설명</span>",	 data: "dataDesc",	        width: "25%"},
                { title: "<span class='ellipsis'>국가명</span>",      data: "codeName",	        width: "10%"},
                { title: "<span class='ellipsis'>자료 출처</span>",    data: "dataSourceDesc",	width: "20%"},
                { title: "<span class='ellipsis'>생성자</span>",      data: "memberName",	    width: "10%"},
                { title: "<span class='ellipsis'>생성시간</span>",     data: "createDate",	    width: "10%"},
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
                        let html = "<span class='ellipsis'>" + (data == null ? "" : data) + "</span>";
                        return html;
                    }
                },{
                    targets: 2,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis'>" + (data == null ? "" : data) + "</span>";
                        return html;
                    }
                },{
                    targets: 3,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis'>" + (data == null ? "" : data) + "</span>";
                        return html;
                    }
                },{
                    targets: 4,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis'>" + (data == null ? "" : data) + "</span>";
                        return html;
                    }
                },{
                    targets: 5,
                    className: "",
                    render : function (data, type, row){
                        let html = "<span class='ellipsis'>" + (data == null ? "" : data) + "</span>";
                        return html;
                    }
                },{
                    targets: 6,
                    className: "",
                    render : function (data, type, row){
                        let html = "";
                        //html = "<span class='ellipsis'>" + (data == null ? "" : data["year"] +"-"+data["monthValue"] +"-"+data["dayOfMonth"]) + "</span>";
                        html = "<span class='ellipsis'>" + (data == null ? "" : moment(data, "YYYY-MM-DD").format("YYYY-MM-DD")) + "</span>";
                        return html;
                    }
                }


	   ],
	});
}

$(document).on('change', '#categorySearch, #permitSearch, #startDate, #endDate, #useYnSearch', function () {
    //initRequestListAjax();
})

$(document).on('click', '#btnSearch', function() {
    initRequestListAjax();
})

$(document).on("keyup", '#search', function(key){
    if(key.keyCode==13) {
        initRequestListAjax();
    }
});

/* 수집요청 상세보기 */
$(document).on('click', '#dataSharedRequestList tbody tr', function() {
	$("#openSiteDeleteModal").attr('disabled', false);

    $("#dataSharedRequestList tr").removeClass('active');
    $(this).addClass('active');

    let table = $('#dataSharedRequestList').DataTable();
    let rowData = table.row(this).data();
    $("#siteDetailContent").addClass('show');

    $("#data-dataKey").val(rowData['dataKey']);

    $("#siteDetailTable .datakey > span").text(rowData['dataKey']);
    $("#siteDetailTable .dataname").text(rowData["dataname"]);
    var dataDesc = rowData["dataDesc"];
    dataDesc = dataDesc.replace(/\r\n/ig,"<br/>");
    $("#siteDetailTable .datadesc").html(dataDesc);
    $("#siteDetailTable .datanation").text(rowData["codeName"]);
    $("#siteDetailTable .datasourcedesc").text(rowData["dataSourceDesc"]);
    $("#siteDetailTable .datareg").text(rowData["memberName"]);
    //$("#siteDetailTable .dataregdate").text(rowData["createDate"]["year"] + "-" + rowData["createDate"]["monthValue"] + "-" + rowData["createDate"]["dayOfMonth"]);
    $("#siteDetailTable .dataregdate").text(moment(rowData["createDate"], "YYYY-MM-DD").format("YYYY-MM-DD"));
    detailSiteAjax(rowData['dataKey']);


})

function initRequestListAjax() {

    $("#data-dataKey").text("");

    $("#siteDetailTabl .datakey > span").text("");
    $("#siteDetailTable .dataname").text("");
    $("#siteDetailTable .datadesc").text("");
    $("#siteDetailTable .datanation").text("");
    $("#siteDetailTable .datasourcedesc").text("");
    $("#siteDetailTable .datareg").text("");
    //$("#siteDetailTable .dataregdate").text(rowData["createDate"]["year"] + "-" + rowData["createDate"]["monthValue"] + "-" + rowData["createDate"]["dayOfMonth"]);
    $("#siteDetailTable .dataregdate").text("");
    $("#dvfile").html("");


    $.fn.DataTable.ext.pager.numbers_length = 10;

    let start = 0;
    let length = parseInt($("[name='crawlingRequestList_length']").val());
    length = length == NaN? 20 : length;

	let table = $('#dataSharedRequestList').DataTable();
	//테이블 비우기
	table.clear();

    let searchData = {
		//start: start,
		//length: length,
		search: $("#search").val(),
		startDate: $("#startDate").val(),
		endDate: $("#endDate").val(),
        codeNation: $("#codeNation").val()
    };

	$.ajax({
		type: "POST",
		url: "/sharing/dataSharedListAjax",
		data: JSON.stringify(searchData),
		contentType: "application/json; charset=UTF-8",
	}).done(function (data) {
		if(data.indexOf("<!doctype html>") != -1)
			location.reload();
		else if(data)
			fnDraw(data);
		//$(".spinner-wrap").hide();
		return true;
	}).fail(function (data) {
		//$(".spinner-wrap").hide();
		return false;
	});


}
function fnDraw(data){
	let table = $('#dataSharedRequestList').DataTable();
	table.rows.add(data);
	table.draw();

	if(data.length == 0)
		$("#openSiteDeleteModal").attr('disabled', true);
	else
		$("#openSiteDeleteModal").attr('disabled', false);

    let window_height =  $(window).height();
    let div_height = window_height - 330;
    $(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");
}


function detailSiteAjax(dataKey) {
    let searchData = {
		//start: start,
		//length: length,
		dataKey: dataKey
    };

    $.ajax({
        type: 'POST',
        url: '/sharing/detailSiteAjax',
        data: JSON.stringify(searchData),
		contentType: "application/json; charset=UTF-8",
    }).done(function(data) {
        $(".crawling-detail-content").removeClass('show');
        $("#siteDetailContent").addClass('show');
        var i;
		var html1 = "";
        for(i=0; i<data.length; i++) {
            //$("#siteDetailTable .file").innerText("<A href='" + data[i]["fileLocation"] + "'>" + data[i]["filename"] + "." + data[i]["fileext"] + "</A><br>");
            //$("#dvfile").text("<A href='" + data[i]["fileLocation"] + "'>" + data[i]["filename"] + "." + data[i]["fileext"] + "</A><br>");
			//$(location).attr('origin')
			if(html1 != "")
				html1 += "<br>";
			html1 += "<a href='" + $(location).attr('origin') + "/" + data[i]["fileLocation"] + data[i]["upfilename"] + "' download='"+ data[i]["filename"] + "." + data[i]["fileext"] +"'>" + data[i]["filename"] + "." + data[i]["fileext"] + "</a>";
        }
        $("#dvfile").html(html1);
    }).fail(function(data) {
        Swal.fire({
            title: messages.error_requestFail,
            text: data.responseJSON.message,
            icon: "error"
        })
    })
}

$(document).on('click', '#btnDeleteDataKey', function() {
	let dataKey = $("#data-dataKey").val();
    let searchData = {
		//start: start,
		//length: length,
		dataKey: dataKey
    };

    $.ajax({
        type: 'POST',
        url: '/sharing/deleteSiteAjax',
        data: JSON.stringify(searchData),
		contentType: "application/json; charset=UTF-8",
    }).done(function(data) {
		$("#deleteModal").modal("hide");
		$("#data-dataKey").text("");
		initRequestListAjax();
    }).fail(function(data) {
		$("#deleteModal").modal("hide");
		//$("#data-dataKey").text("");
        Swal.fire({
            title: messages.error_requestFail,
            text: data.responseJSON.message,
            icon: "error"
        })
    })
});


function viewDetailSite(data) {
    $("#siteDetailTable > tbody > tr > td").text('');

    $("#siteDetailTable .codeNation").text(data.codeNationName);
    $("#siteDetailTable .hostName").text(data.hostName!=null? data.hostName:'');
    $("#siteDetailTable .siteName").text(data.siteName);
    $("#siteDetailTable .siteUrl").text(data.siteUrl);
    if(data.siteId!='' && data.sitePassword!='') {
        $("#siteDetailTable .isLoginRequired").text(TEXT_LOGIN_REQUIRED);
        $("#siteDetailTable .loginUrl").text(data.loginUrl);
        $("#siteDetailTable .loginIdPassword").text('아이디 : ' + data.siteId + ' / 비밀번호 : ' + data.decryptedSitePassword);
    } else {
        $("#siteDetailTable .isLoginRequired").text(TEXT_LOGIN_NOT_REQUIRED);
        $("#siteDetailTable .loginUrl").text('');
        $("#siteDetailTable .loginIdPassword").text('');
    }
    $("#siteDetailTable .remark").text(data.remark);
    if(data.updatePossibleYn) {
        $("#openSiteUpdateModal").show();
        $(".open-update-content").show();
    } else {
        $("#openSiteUpdateModal").hide();
        $(".open-update-content").hide();
    }
    $("#siteDetailTable .createDatetime").text(formatYmdhm(data.createDatetime));
}

/*
function detailPeopleAjax(crawlingKey) {
    $.ajax({
        type: 'POST',
        url: '/api'+ window.location.pathname + '/detail/people',
        data: { crawlingKey: crawlingKey }
    }).done(function(data) {
        $(".crawling-detail-content").removeClass('show');
        $("#peopleDetailContent").addClass('show');
        viewDetailPeople(data);
    }).fail(function(data) {
        Swal.fire({
            title: messages.error_requestFail,
            text: data.responseJSON.message,
            icon: "error"
        })
    })
}
*/

function viewDetailPeople(data) {
    $("#peopleDetailTable .people-detail").text('');
    $("#peopleDetailTable .people-detail-crawlinfo").hide();
    $("#peopleDetailTable .bizcard").html('');

    $("#peopleDetailContent .crawlingKey").val(data.crawlingKey);
    let permitHtml = "";
    switch (data.codeCrawlingPermit) {
        case "REQUEST" :    permitHtml = '<span class="permits badge org">' + TEXT_PERMIT_REQUEST + '</span>'; break;
        case "WAIT" :       permitHtml = '<span class="permits badge blu">' + TEXT_PERMIT_WAIT + '</span>'; break;
        case "APPROVED" :   permitHtml = '<span class="permits badge primary">' + TEXT_PERMIT_APPROVED + '</span>'; break;
        case "REJECT" :     permitHtml = '<span class="permits badge red-bg">' + TEXT_PERMIT_REJECT + '</span>'; break;
        default :           permitHtml = '<span class="permits badge">' + data.codeCrawlingPermitName + '</span>'; break;
    }
    $("#peopleDetailTable .codeCrawlingPermit").html(permitHtml);
    $("#peopleDetailTable .permitMessage").text(data.codeCrawlingPermit == 'REJECT'? data.permitMessage : '');
    $("#peopleDetailTable .codeCategory").text(data.localeCodeCategory);
    $("#peopleDetailTable .codeNation").text(data.codeNationName);
    if(data.cardFile != '') {
        $("#peopleDetailTable .bizcard").html("<img src='/upload/business_card/"+data.cardFile+"' alt='명함이미지'>");
    }
    $("#peopleDetailTable .name").text(data.name);
    $("#peopleDetailTable .email").text(data.email);
    $("#peopleDetailTable .phoneNo").text(data.phoneNo);
    $("#peopleDetailTable .telNo").text(data.telNo);
    $("#peopleDetailTable .rank").text(data.rank);
    $("#peopleDetailTable .companyName").text(data.companyName);
    $("#peopleDetailTable .companyUrl").text(data.companyUrl);

    $("#peopleDetailTable .linkedinUrl").text(data.linkedinUrl);
    let linkedinLoginInfo = data.linkedinId == "" ? "" : data.linkedinId+" / "+data.decrypedLinkedinPassword;
    $("#peopleDetailTable .linkedinLoginInfo").text(linkedinLoginInfo);
    let people_detail_linkedin = $("#peopleDetailTable .people-detail-linkedin");
    data.linkedinUrl == ""? people_detail_linkedin.hide() : people_detail_linkedin.show();

    $("#peopleDetailTable .facebookUrl").text(data.facebookUrl);
    let facebookLoginInfo = data.facebookId == "" ? "" : data.facebookId+" / "+data.decrypedFacebookPassword;
    $("#peopleDetailTable .facebookLoginInfo").text(facebookLoginInfo);
    let people_detail_facebook = $("#peopleDetailTable .people-detail-facebook");
    data.facebookUrl == ""? people_detail_facebook.hide() : people_detail_facebook.show();

    $("#peopleDetailTable .googleUrl").text(data.googleUrl);
    let googleLoginInfo = data.googleId == "" ? "" : data.googleId+" / "+data.decrypedGooglePassword;
    $("#peopleDetailTable .googleLoginInfo").text(googleLoginInfo);
    let people_detail_google = $("#peopleDetailTable .people-detail-google");
    data.googleUrl == ""? people_detail_google.hide() : people_detail_google.show();

    $("#peopleDetailTable .remark").text(data.remark);
    if(data.updatePossibleYn) {
        $("#openPeopleUpdateModal").show();
        $(".open-update-content").show();
    } else {
        $("#openPeopleUpdateModal").hide();
        $(".open-update-content").hide();
    }
    $("#peopleDetailTable .createDatetime").text(formatYmdhm(data.createDatetime));
}



/* 수집요청 수정 */
$(document).on('click', '#openSiteUpdateModal', function() {
    getInfoSiteAjax();
})

$(document).on('click', '#btnUrlReset', function() {
    $('[name="siteUrl"]').val($('[name="resetSiteUrl"]').val());
    $('.isconfirmed-url').val(true);
})



/* 중복 submit 방지 변수 */
let doubleSubmitFlag = false;
//사이트 수정
$(document).on('click', '#btnUpdateSite', function(e) {
    e.preventDefault();
    if(doubleSubmitFlag) {
        return;
    }

    const _validation = $("#siteUpdateTable").parsley();
    if(_validation.validate() && validateUrlDuplicate()) {
        Swal.fire({
            title : messages.confirm_save,
            icon : 'info',
            showCancelButton : true,
            confirmButtonClass : 'btn-danger',
            confirmButtonText : messages.button_modify,
            cancelButtonText : messages.button_cancle,
            closeOnConfirm : false,
            closeOnCancel : true,
            _closeOnClickOutside: false
        }).then((isConfirm) => {
            if (isConfirm.isConfirmed) {
                doubleSubmitFlag = true;
                updateSiteAjax();
            }else{
                doubleSubmitFlag = false;
                Swal.close();
            }
        });
    }
})

//인물 수정 모달
$(document).on('click', '#openPeopleUpdateModal', function() {
    getInfoPeopleAjax();
})

//인물 수정
$(document).on('click', '#btnUpdatePeople', function(e) {
    e.preventDefault();
    updatePeopleAjax();
})

function getInfoSiteAjax() {
    $.ajax({
        type: 'POST',
        url: '/api'+ window.location.pathname +'/info/site',
        data: { crawlingKey: $("#siteDetailContent .crawlingKey").val() },
    }).done(function(data) {
        viewInfoSite(data);
    }).fail(function(data) {
        $('#siteUpdateModal').on('show.bs.modal', function (e) {
            e.preventDefault();
        })
        Swal.fire({
            title: messages.error_requestFail,
            text: data.responseJSON.message,
            icon: "error"
        })
    })
}

function viewInfoSite(data) {
    $('#siteUpdateTable [name="codeCategory"]').val(data.codeCategory).prop('selected', true);
    $('#siteUpdateTable [name="codeNation"]').val(data.codeNation).select2({
        dropdownParent: $("#siteUpdateModal")
    });
    $('#siteUpdateTable .isconfirmed-url').val(true);
    $('#siteUpdateTable [name="hostName"]').val(data.hostName!==null? data.hostName:'');
    $('#siteUpdateTable [name="siteName"]').val(data.siteName);
    $('#siteUpdateTable [name="siteUrl"], [name="resetSiteUrl"]').val(data.siteUrl);
    $('#siteUpdateTable [name="loginUrl"]').val(data.loginUrl);
    $('#siteUpdateTable [name="siteId"]').val(data.siteId);
    $('#siteUpdateTable [name="sitePassword"]').val(data.sitePassword);
    if (data.siteId !== '') {
        $('#siteUpdateTable #loginRequired').prop('checked', true);
        $('#siteUpdateTable [name="siteId"], [name="sitePassword"], [name="loginUrl"]').prop('readonly', false);
    } else {
        $('#siteUpdateTable #notloginRequired').prop('checked', true);
        $('#siteUpdateTable [name="siteId"], [name="sitePassword"], [name="loginUrl"]').prop('readonly', true);
    }
    $('#siteUpdateTable [name="remark"]').val(data.remark);
    $('#siteUpdateTable [name="crawlingKey"]').val(data.crawlingKey);
}

function getInfoPeopleAjax() {
    $.ajax({
        type: 'POST',
        url: '/api'+ window.location.pathname +'/info/people',
        data: { crawlingKey: $("#peopleDetailContent .crawlingKey").val() },
    }).done(function(data) {
        viewInfoPeople(data);
    }).fail(function(data) {
        $('#peopleUpdateModal').on('show.bs.modal', function (e) {
            e.preventDefault();
        })
        Swal.fire({
            title: messages.error_requestFail,
            text: data.responseJSON.message,
            icon: "error"
        })
    })
}

function viewInfoPeople(data) {
    //초기화
    $("#peopleUpdateTable").parsley().reset();
    $("#peopleUpdateTable").find("input, select").val("");
    $("#peopleUpdateTable").find("input.people-crawlinfo-checkbox").prop("checked", false);
    $("#peopleUpdateTable").find("input.people-crawlinfo").prop({readOnly: true, required: false});

    //데이터 세팅
    $("#peopleUpdateTable .codeCategory").text(data.codeCategory);
    $("#peopleUpdateTable [name='codeNation']").val(data.codeNation).select2({
        dropdownParent: $("#peopleUpdateModal")
    });
    $("#peopleUpdateTable [name='name']").val(data.name);
    $("#peopleUpdateTable [name='email']").val(data.email);
    $("#peopleUpdateTable [name='phoneNo']").val(data.phoneNo);
    $("#peopleUpdateTable [name='telNo']").val(data.telNo);
    $("#peopleUpdateTable [name='rank']").val(data.rank);
    $("#peopleUpdateTable [name='companyName']").val(data.companyName);
    $("#peopleUpdateTable [name='companyUrl']").val(data.companyUrl);
    $("#peopleUpdateTable [name='remark']").val(data.remark);
    $("#peopleUpdateTable [name='crawlingKey']").val(data.crawlingKey);
    $("#peopleUpdateTable [name='cardFile']").val(data.cardFile);

    if(data.linkedinUrl != "") {
        $("#peopleUpdateTable #peopleLinkedin").prop("checked", true);
        $("#peopleUpdateTable .people-linkedin").prop("readOnly", false);
        $("#peopleUpdateTable [name='linkedinUrl']").val(data.linkedinUrl);
        $("#peopleUpdateTable [name='linkedinId']").val(data.linkedinId);
        $("#peopleUpdateTable [name='linkedinPassword']").val(data.linkedinPassword);
    }
    if(data.facebookUrl != "") {
        $("#peopleUpdateTable #peopleFacebook").prop("checked", true);
        $("#peopleUpdateTable .people-facebook").prop("readOnly", false);
        $("#peopleUpdateTable [name='facebookUrl']").val(data.facebookUrl);
        $("#peopleUpdateTable [name='facebookId']").val(data.facebookId);
        $("#peopleUpdateTable [name='facebookPassword']").val(data.facebookPassword);
    }
    if(data.googleUrl != "") {
        $("#peopleUpdateTable #peopleGoogle").prop("checked", true);
        $("#peopleUpdateTable .people-google").prop("readOnly", false);
        $("#peopleUpdateTable [name='googleUrl']").val(data.googleUrl);
        $("#peopleUpdateTable [name='googleId']").val(data.googleId);
        $("#peopleUpdateTable [name='googlePassword']").val(data.googlePassword);
    }
}

function updateSiteAjax() {
	const _updateData = {
		crawlingKey: $('#siteUpdateTable [name="crawlingKey"]').val()
		, codeCategory: $('#siteUpdateTable [name="codeCategory"]').val().trim()
		, codeNation: $('#siteUpdateTable [name="codeNation"]').val().trim()
		, siteName: $('#siteUpdateTable [name="siteName"]').val().trim()
		, siteUrl: $('#siteUpdateTable [name="siteUrl"]').val().trim()
		, loginUrl: $('#siteUpdateTable [name="loginUrl"]').val().trim()
		, siteId: $('#siteUpdateTable [name="siteId"]').val().trim()
		, sitePassword: $('#siteUpdateTable [name="sitePassword"]').val().trim()
		, hostName: $('#siteUpdateTable [name="hostName"]').val().trim().replace(/\s+/g, " ")
		, remark: $('#siteUpdateTable [name="remark"]').val().trim()
	};

	$.ajax({
		type: 'POST',
		url: '/api'+ window.location.pathname + '/update/site',
		data: JSON.stringify(_updateData),
		contentType: "application/json; charset=UTF-8",
	}).done(function(data) {
		if(data.message != undefined) {
			ajaxFail(data);
			return;
		}
		initRequestListAjax();
		detailSiteAjax($('#siteUpdateTable [name="crawlingKey"]').val());
		ajaxSuccess(data);
	}).fail(function (data) {
		ajaxFail(data);
	});
    // }
}

function updatePeopleAjax() {
    const _validation = $("#peopleUpdateTable").parsley();
    if(_validation.validate()) {
        const _updateFormData = new FormData($("#peopleUpdateTable #ocrForm")[0]);
        _updateFormData.append("crawlingKey", $('#peopleUpdateTable [name="crawlingKey"]').val());
        _updateFormData.append("codeNation", $('#peopleUpdateTable [name="codeNation"]').val());
        _updateFormData.append("linkedinUrl", $('#peopleUpdateTable [name="linkedinUrl"]').val().trim());
        _updateFormData.append("linkedinId", $('#peopleUpdateTable [name="linkedinId"]').val().trim());
        _updateFormData.append("linkedinPassword", $('#peopleUpdateTable [name="linkedinPassword"]').val().trim());
        _updateFormData.append("facebookUrl", $('#peopleUpdateTable [name="facebookUrl"]').val().trim());
        _updateFormData.append("facebookId", $('#peopleUpdateTable [name="facebookId"]').val().trim());
        _updateFormData.append("facebookPassword", $('#peopleUpdateTable [name="facebookPassword"]').val().trim());
        _updateFormData.append("googleUrl", $('#peopleUpdateTable [name="googleUrl"]').val().trim());
        _updateFormData.append("googleId", $('#peopleUpdateTable [name="googleId"]').val().trim());
        _updateFormData.append("googlePassword", $('#peopleUpdateTable [name="googlePassword"]').val().trim());
        _updateFormData.append("remark", $('#peopleUpdateTable [name="remark"]').val());

        $.ajax({
            type: 'POST',
            url: '/api'+ window.location.pathname + '/update/people',
            data: _updateFormData,
            enctype: 'multipart/form-data',
            cache: false,
            processData: false,
            contentType: false
        }).done(function(data) {
            if(data.message != undefined) {
                ajaxFail(data);
                return;
            }
            initRequestListAjax();
            detailPeopleAjax($('#peopleUpdateTable [name="crawlingKey"]').val());
            ajaxSuccess(data);
        }).fail(function (data) {
            ajaxFail(data);
        });
    }
}

function ajaxSuccess(data) {
    Swal.fire({
        title: messages.success_save,
        text: messages.info_requestCollection,
        icon: 'success',
    })
    $(".modal").modal("hide");
    doubleSubmitFlag = false;
}

function ajaxFail(data) {
    doubleSubmitFlag = false;

    let errormsg = "";
    if(data.message != undefined) errormsg = data.message;
    else if(data.responseJSON.message != undefined) errormsg = data.responseJSON.message;

    Swal.fire({
        title: messages.error_save,
        text: errormsg,
        icon: "error",
        _closeOnDocumentClick: false,
        _closeOnClickOutside: false
    })
}

function formatYmdhm(date) {
    if(date == null) return "";
    return date.year + "-" + zeroPad(date.monthValue, 10) + "-" + zeroPad(date.dayOfMonth, 10) + " " + zeroPad(date.hour, 10) + ":" + zeroPad(date.minute, 10);
}

function zeroPad(nr,base){
    var  len = (String(base).length - String(nr).length)+1;
    return len > 0? new Array(len).join('0')+nr : nr;
}

function isEmpty(value) {
    if(value == "" || value == null || value == undefined || typeof value == undefined ||
        (value != null && typeof value == "object" && !Object.keys(value).length)
    ) {
        return true;
    }
    return false;
}


/* Excel Download */
$(document).on('click', '#btnDownloadExcel', function() {
    $.fileDownload('/api'+window.location.pathname+'/excel/download', {
        httpMethod: 'GET',
        data: {
            search: $("#search").val(),
            startDate: $("#startDate").val(),
            endDate: $("#endDate").val(),
            codeCategory: $("#categorySearch").val(),
            codeCrawlingPermit: $("#permitSearch").val(),
            useYn: $("#useYnSearch").val()
        },
        successCallback: function () {
            location.reload();
        },
        failCallback: function(response) {
            Swal.fire(messages.error_excelOutputFail, "", "error");
        }
    })
})
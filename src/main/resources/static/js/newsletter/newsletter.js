var data ={};
var _myinfoFormData;
var _pop_atch_file_arr = "";

$(document).ready(function() {
    //initFn();
    //fnSearch();
	//ymd_preDaySel("FromDt", -1);
	//ymd_preDaySel("ToDt", 0);
    initFn();
    fnSearch();
    initFileDownload();
})

$(window).load(function () {
 $('#nContents').summernote({
        // 에디터 높이
        height: 550,
        // 에디터 한글 설정
        lang: "ko-KR",
        // 에디터에 커서 이동 (input창의 autofocus라고 생각)
        focus : true,
        toolbar: [
            // 글꼴 설정
            ['fontname', ['fontname']],
            // 글자 크기 설정
            ['fontsize', ['fontsize']],
            // 굵기, 기울임꼴, 밑줄,취소 선, 서식지우기
            ['style', ['bold', 'italic', 'underline','strikethrough', 'clear']],
            // 글자색
            ['color', ['forecolor','color']],
            // 표만들기
            ['table', ['table']],
            // 글머리 기호, 번호매기기, 문단정렬
            ['para', ['ul', 'ol', 'paragraph']],
            // 줄간격
            ['height', ['height']],
            ['insert', ['link', 'picture', 'video', 'file']],
            // 코드보기, 확대해서보기, 도움말
            ['view', ['codeview','fullscreen', 'help']]
        ],
            // 추가한 글꼴
            fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New','맑은 고딕','궁서','굴림체','굴림','돋음체','바탕체'],
            // 추가한 폰트사이즈
            //Define the callback
           /*
          callbacks : {
                onImageUpload : function(files, editor, welEditable) {
                // 파일 업로드(다중업로드를 위해 반복문 사용)
                for (var i = files.length - 1; i >= 0; i--) {
                         uploadSummernoteImageFile(files[i],this);
                     }
                }
           },
           */
        fontSizes: ['8','9','10','11','12','14','16','18','20','22','24','28','30','36','50','72']

    });

});

 function uploadSummernoteImageFile(file, el) {
			data = new FormData();
			data.append("file", file);
			$.ajax({
				data : data,
				type : "POST",
				url : "/newsletter/list/uploadSummernoteImageFile",
				contentType : false,
				enctype : 'multipart/form-data',
				processData : false,
				success : function(data) {
					$(el).summernote('editor.insertImage', data.url);
				}
			});
 }

function progressHandlingFunction(e) {
    if (e.lengthComputable) {
        //Log current progress
        console.log((e.loaded / e.total * 100) + '%');

        //Reset progress on complete
        if (e.loaded === e.total) {
            console.log("Upload finished.");
        }
    }
}

$("#addNewsletterPopupBtn").click(function() {
    $(".modal-body input").val("");
    $(".note-editable").html('');
	$('#user_edit1').text("Newsletter 등록");
	$('#newsletterInfoModal').modal('show');
	$('#attachedFileMList').DataTable().clear().draw();

})

$("#addNewsletterBtn").click(function() {
    if (!fnValidationAdmin())
        return false;
	else
	    fnAddNewsletter();
})

//$(document).on('click', '#roleAndSearchBtn', function() {
$("#roleAndSearchBtn").click(function() {
    fnSearch();
})

//$(document).on('click', '#deleteUserBtn', function() {
$("#deleteNewsletterBtn").click(function() {
    fnDelete();
})

//$(document).on('click', '#excelDownloadBtn', function() {
$("#excelDownloadBtn").click(function() {
	// fnExcelDownload();
	//exportExcel();
	fnSearch1();

})
/*
$(document).on('click', '#SaveBtn', function() {
    fnUploadFiles();
})
*/
//전체 선택,해제
//$(document).on('click', '#chkAll', function() {
$("#chkAll").click(function() {
	if($("#chkAll").prop("checked")){
        $("input:checkbox[name='listCheckBox']").prop("checked", true);
    }else{
        $("input:checkbox[name='listCheckBox']").prop("checked", false);
    }
})


//제목 선택했을 경우
//$(document).on('click', '[name="subjectsCol"]', function () {
//$("#subjectsCol").click(function() {
$(document).on('click', '#subjectsCol', function() {
    //var data = $("#newsletterList").DataTable().row(this).data();
    var data = $("#newsletterList").DataTable().row(this.parentElement.parentElement).data();
    console.log("row 선택    " + data.memberKey);
	if(data == undefined)
		return false;

	$('#user_editView').text("Newsletter 보기");
    $('#newsletterInfoViewModal').modal('show');
    $('#nSubject2').val(data.subject);
    $('#nContents2').summernote('code',data.contents);
    $('#nNewsletterViewKey').val(data.newsletterKey);


	var table = $('#attachedFileListView').DataTable();
	table.clear();


    if(data.filegroupid !=null){
        getFileList(data.filegroupid);
    }

});


//수정을 눌렀을 때
$(document).on('click', '[name="btnUpdate"]', function () {
    var data = $("#newsletterList").DataTable().row(this.parentElement.parentElement.parentElement).data();
    //var data = $("#newsletterList").DataTable().row(this).data();
    console.log("row 선택    " + data.memberKey);
	if(data == undefined)
		return false;

	$('#user_edit1').text("Newsletter 수정");
    $('#newsletterInfoModal').modal('show');
    $('#nSubject').val(data.subject);
    //$('#nContents').val(data.contents);
    $('#nContents').summernote('code',data.contents);
    $('#nNewsletterKey').val(data.newsletterKey);

    var table = $('#attachedFileMList').DataTable();
    table.clear();


    if(data.filegroupid !=null){
        getFileListModify(data.filegroupid);
    }

});

//수정을 눌렀을 때
$(document).on('click', '[name="btnUpdate"]', function () {
    var data = $("#newsletterList").DataTable().row(this.parentElement.parentElement.parentElement).data();
    //var data = $("#newsletterList").DataTable().row(this).data();
    console.log("row 선택    " + data.memberKey);
	if(data == undefined)
		return false;

	$('#user_edit1').text("Newsletter 수정");
    $('#newsletterInfoModal').modal('show');
    $('#nSubject').val(data.subject);
    //$('#nContents').val(data.contents);
    $('#nContents').summernote('code',data.contents);
    $('#nNewsletterKey').val(data.newsletterKey);

    var table = $('#attachedFileMList').DataTable();
    table.clear();


    if(data.filegroupid !=null){
        getFileListModify(data.filegroupid);
    }

});

//삭제를 눌렀을 경우
$(document).on('click', '[name="btnDelete"]', function () {

	if(confirm("삭제하시겠습니까?") != true) return false;
	$(".spinner-wrap").show();

    var data = $("#newsletterList").DataTable().row(this.parentElement.parentElement.parentElement).data();
	if(data == undefined)
		return false;


	$.ajax({
		type: 'DELETE',
		url: '/api/newsletter/delete',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
	}).done(function (data) {
        alert("삭제 됐습니다.");
		$(".spinner-wrap").hide();
		fnSearch();
	}).fail(function (data) {
        alert("삭제 실패했습니다.");
		$(".spinner-wrap").hide();
		fnSearch();
	});


});



$(document).on("show.bs.modal", "#userinfoModal", function() {
});

function initFn() {
    let btnUpdate = "";
    btnUpdate += "<button type='button' class='btn btn-brd-black btn-xs' name='btnUpdate'>수정</button>";
    let btnDelete = "";
    btnDelete += "<button type='button' class='btn btn-brd-black btn-xs' name='btnDelete'>삭제</button>";

	$('#newsletterList').DataTable( {
		order: [1, 'desc'],
		ordering: false,
		paging: true,
		destroy: true,
		pageLength: 20,
		pagingType: "full_numbers",
		info: false,
		LengthChange: true,
		lengthMenu: [20, 40, 60, 80, 100 ],
		dom:
			"<'row'<'select-count'l>>" +
			"<'thead-fixed'<'scroll admin'tr>>" +
			"<'col'p>",
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

		columns: [
			{ title: "<input type='checkbox' id='chkAll'>",	width: "5%"},
			{ title: "번호",	data: "newsletterKey",	width: "10%"},
			{ title: "작성자",	data: "membersid",	width: "10%"},
			{ title: "작성일",	data: "writedatetime",	width : "20%"},
			{ title: "제목",	data: "subject",	width : "55%"},
			{ title: "<span class='ellipsis'>관리</span>", data: "", width: "10%" },
            { title: "",	 data: "contents"},
            { title: "",	 data: "url"},
            { title: "",	 data: "filegroupid"}
	   ],
	   columnDefs: [
		   {
				order: false,
				targets: 0,
				className: "",
				render: function (data, type, row, meta){
					//var html = "<input type='checkbox' id='chkchk"+meta.row+ "' " + (data=="1" ? "checked" : "") + ">";
					var html = "<input type='checkbox' onclick='event.cancelBubble=true' name='listCheckBox' >";
					return html;
				}
			}, {
				targets: 1,
				className: "",
				render: function (data, type, row){
					var html = data;
					return html;
				}
			}, {
				targets: 2,
				className: "",
				render: function (data, type, row){
					var html = data;
					return html;
				}
		   }, {
				targets: 3,
				className: "",
				render: function (data, type, row){
					var html = [data[0],data[1],data[2]].join('-')
					return html;
				}
		   }, {
				targets: 4,
				className: "text-center",
				render: function (data, type, row){
				    var html = "<a href=\"#\"><div id =\"subjectsCol\">";
					html += data;
					html += "</div></a>";
					return html;
				}
			}, {
                targets: 5,
                className: "",
                render: function (data, type, row, meta) {
                    let html = "<div class='btn-group'>";
                    html += btnUpdate;
                    html += "&nbsp;";
                    html += btnDelete;
                    html += "&nbsp;";
                    return html;
                }
		   },{
				targets: 6,
				searchable:false,
				visible:false
         	},{
				targets: 7,
				searchable:false,
				visible:false
         	},{
				targets: 8,
				searchable:false,
				visible:false
		    }

	   ],
	});



}

//timezone, language 초기셋팅
function _fninitInfo(){
    $.ajax({
        type: 'GET',
        url: '/api/member/myInfo',
        cache: false,
        processData: false,
        async : false,
        contentType: false
    }).done(function(data) {
        _initMyinfoModal(data['languageList']);
        console.log("data['languageList']", data['languageList']);
		_initTimezoneModal(data['timezoneList_1']);
		console.log("data['timezoneList_1']", data['timezoneList_1']);
		_TIME_ZONE_LIST = data['timezoneList_2'];
        console.log("data['timezoneList_2']", data['timezoneList_2']);
        const myInfo = data['myInfo'];
        $("#_myInfo_codeLanguage").val(myInfo.codeLanguage);
		$("#_myInfo_tzSelect").val(myInfo.timeZone);

		//setTimezone(myInfo.timeZone);
		$("#_myInfo_tzSelect2").empty();
		if(myInfo.timeZone != ""){
			var html = "";
			html += "<option value='"+myInfo.timeZone+"'>"+myInfo.timeZone+"</option>";
			$("#_myInfo_tzSelect2").append(html);
		}



    }).fail(function (data) {
        $("#userinfoModal").modal("hide");

    });
}

function _initMyinfoModal(languageList) {

    $("#_myInfo_codeLanguage").empty();
    $("#_myInfo_codeLanguage").append("<option value=''>"+TEXT_LANGUAGE_SELECTION+"</option>");
    languageList.forEach(function(language) {
        $("#_myInfo_codeLanguage").append("<option value='"+language.code+"' >"+language.refTxt02+"</option>")
    });
}

function fnUploadFiles() {
    if($('#csvData').val()==''){
        alert('첨부된 파일이 없습니다.');
        return false;
	}
    var ext = $("#csvData").val().split(".").pop().toLowerCase();
    if($.inArray(ext, ["xlsx"]) == -1){
        alert(".xlsx 파일만 업로드 가능합니다.");
        return false;
    }

	if(confirm("업로드하시겠습니까?") != true) return false;
	$(".spinner-wrap").show();

	var form = $("#uploadExcelCSV")[0];
	var formData = new FormData(form);
	formData.append("image", $("#csvData")[0].files[0]);
	$.ajax({
		type:"POST",
		url: "/system/userregi/user/uploadExcel",
		processData: false,
		contentType: false,
		data: formData
	}).done( function(rtn){
		$(".spinner-wrap").hide();
		alert(TEXT_LST_ASK_SAVE_SUCCESS);
	    alert("저장되었습니다.");
		//location.reload();
		fnSearch();
	}).fail( function(error){
		//console.log("error "+ error.responseJSON.message);
		$(".spinner-wrap").hide();
		alert(error.responseJSON.message);
    //2022.11.28 같은 파일로 업로드시 2번째부터 net::ERR_UPLOAD_FILE_CHANGED in Chrome 발생.(크롬 브라우저만)
    }).complete(function (data) {
        $('#uploadExcelCSV')[0].reset();
    });
}

function _initTimezoneModal(timeZoneList) {
    $("#_myInfo_tzSelect1").empty();
    $("#_myInfo_tzSelect1").append("<option value='' >TimeZone 선택</option>");

    timeZoneList.forEach(function(timezone) {
        $("#_myInfo_tzSelect1").append("<option value='"+timezone.code+"' >"+timezone.codeName+"</option>");
    });
}



//설정된 timezone 으로 설정
function _setTimezone(tz){
	if(tz.length == 0)	return false;
	var str1 = tz.split("/");
	$("#_myInfo_tzSelect1").val(str1[0]);
	$("#_myInfo_tzSelect1").trigger("change");
}



$("#_myInfo_tzSelect1").change( function() {
	var tz1 = $("#_myInfo_tzSelect1").val();
    var txt1 = "";
    $("#_myInfo_tzSelect2").empty();
	var html = "";
	_TIME_ZONE_LIST.forEach(function(tz2) {
		if(tz1 == tz2.refTxt02){
			if($("#_myInfo_tzSelect").val() === tz2.codeName){
				html += "<option value='"+tz2.code+"' selected>"+tz2.codeName+"</option>";
				txt1 = tz2.codeName;
			}else{
				html += "<option value='"+tz2.code+"'>"+tz2.codeName+"</option>";
			}

		}
	});

	$("#_myInfo_tzSelect2").append(html);

    if(txt1 != ""){
        $("#_myInfo_tzSelect").val(txt1);
    }else{
        $("#_myInfo_tzSelect").val($("#_myInfo_tzSelect2 option:selected").text());
    }

});

$("#_myInfo_tzSelect2").change( function() {
	var txt = $("#_myInfo_tzSelect2 option:selected").text();
	$("#_myInfo_tzSelect").val(txt);
});




//신규 등록
function fnAddNewsletter(){

    //var _data = $("#newsletterList").DataTable().row(this).data();
    //const _data = new FormData($("#signUpForm")[0]);
    var dataList = new Array();
    var _data = new Object();
    _data.newsletterKey = $('#nNewsletterKey').val();
    _data.subject = $('#nSubject').val();
    _data.contents = $('#nContents').val();
    dataList.push(_data);


    var table1 = $('#attachedFileMList').DataTable();
    let dataArray1 = [];
    var dataList1 = table1.rows().data();
    for(var i=0;i<dataList1.length;i++){
        var rowData1 = table1.rows(i).data()[0];

        //if(rowData1["notiatchmflno"] == "" && rowData1["atchmnflnm"] != ""){
            dataArray1.push(rowData1);
            //dataList.push(rowData1);
        //}
    }

    //dataList.push("delList",_pop_atch_file_arr);
    $.ajax({
        type: 'POST',
        url: '/api/newsletter/add',
        //data: JSON.stringify(dataList),
        data: {"paramList":JSON.stringify(_data), "insList":JSON.stringify(dataArray1), "delList":_pop_atch_file_arr},
		//contentType: 'application/json; charset=utf-8',
        //enctype: 'multipart/form-data',
        //cache: false,
        //processData: false
	}).done(function(data) {
		alert("저장되었습니다.");
		$("#newsletterInfoModal").modal("hide");
		fnSearch();
	}).fail(function (data) {
		alert('실패했습니다.' );
	});
}




function convertNodeToCsvString() {
	var result = "";
	result += 'HR 사번,email,User Name_KO,User Name_EN,User Name_CN,Company Code,Company Name_KO,Company Name_EN,Company Name_CN,HR PG,HR PG Name_KO,HR PG Name_EN,HR PG Name_CN,HR PU,HR PU Name_KO,HR PU Name_EN,HR PU Name_CN,HR Team,HR Tema Name_KO,HR Team Name_EN,HR Team Name_CN,재직구분,사용여부'+'\r\n';
	var dataArr = [];
	$('#userRegiList tr').filter(':has(:checkbox:checked)').each(function() {
		dataArr.push($(this).find('td').eq(1).text());
		//console.log(dataArr);
	});
	dataArr.forEach(function(element){
		let memberId = element;
		$.ajax({
			type: 'get',
			url: "/system/userregi/api/detailById/"+memberId+"",
			contentType: 'application/json; charset=utf-8',
			x: JSON.stringify(memberId),
			async: false,
			cache:false,
			timeout:30000
		}).done(function (x){
			result += ( typeof(x[0].memberId) !== "undefined" && x[0].memberId !== null )?x[0].memberId+',':''+',';
			result += ( typeof(x[0].email) !== "undefined" && x[0].email !== null )?x[0].email+',':''+',';
			result += ( typeof(x[0].memberName) !== "undefined" && x[0].memberName !== null )?x[0].memberName+',':''+',';
			result += ( typeof(x[0].memberEnName) !== "undefined" && x[0].memberEnName !== null )?x[0].memberEnName+',':''+',';
			result += ( typeof(x[0].memberCnName) !== "undefined" && x[0].memberCnName !== null )?x[0].memberCnName+',':''+',';
			result += ( typeof(x[0].companyCode) !== "undefined" && x[0].companyCode !== null )?x[0].companyCode+',':''+',';
			result += ( typeof(x[0].companyKrName) !== "undefined" && x[0].companyKrName !== null )?x[0].companyKrName+',':''+',';
			result += ( typeof(x[0].companyEnName) !== "undefined" && x[0].companyEnName !== null )?x[0].companyEnName+',':''+',';
			result += ( typeof(x[0].companyCnName) !== "undefined" && x[0].companyCnName !== null )?x[0].companyCnName+',':''+',';
			result += ( typeof(x[0].pgCode) !== "undefined" && x.pgCode !== null )?x[0].pgCode+',':''+',';
			result += ( typeof(x[0].pgKrName) !== "undefined" && x[0].pgKrName !== null )?x[0].pgKrName+',':''+',';
			result += ( typeof(x[0].pgEnName) !== "undefined" && x[0].pgEnName !== null )?x[0].pgEnName+',':''+',';
			result += ( typeof(x[0].pgCnName) !== "undefined" && x[0].pgCnName !== null )?x[0].pgCnName+',':''+',';
			result += ( typeof(x[0].puCode) !== "undefined" && x[0].puCode !== null )?x[0].puCode+',':''+',';
			result += ( typeof(x[0].puKrName) !== "undefined" && x[0].puKrName !== null )?x[0].puKrName+',':''+',';
			result += ( typeof(x[0].puEnName) !== "undefined" && x[0].puEnName !== null )?x[0].puEnName+',':''+',';
			result += ( typeof(x[0].puCnName) !== "undefined" && x[0].puCnName !== null )?x[0].puCnName+',':''+',';
			result += ( typeof(x[0].divisionCode) !== "undefined" && x[0].divisionCode !== null )?x[0].divisionCode+',':''+',';
			result += ( typeof(x[0].divisionKrName) !== "undefined" && x[0].divisionKrName !== null )?x[0].divisionKrName+',':''+',';
			result += ( typeof(x[0].divisionEnName) !== "undefined" && x[0].divisionEnName !== null )?x[0].divisionEnName+',':''+',';
			result += ( typeof(x[0].divisionCnName) !== "undefined" && x[0].divisionCnName !== null )?x[0].divisionCnName+',':''+',';
			var resignationStatus="";
			if(x[0].resignationStatus =="0"){
				resignationStatus="재직,";
			}else if(x[0].resignationStatus=="1"){
				resignationStatus="휴직,";
			}else if(x[0].resignationStatus=="2"){
				resignationStatus="퇴직,";
			}else{
				resignationStatus=",";
			}
			result += resignationStatus;

			//result += ( typeof(x[0].resignationStatus) !== "undefined" && x[0].resignationStatus !== null )?x[0].resignationStatus+',':''+',';
			//result += ( typeof(x[0].lockYn) !== "undefined" && x[0].lockYn !== null )?x[0].useYn+',':',';
			result += ( typeof(x[0].useYn) !== "undefined" && x[0].useYn !== null )?x[0].useYn:'';
			result += '\r\n';
			//console.log(result);
		}).fail(function (data){
		});
	});

	return result;
}


//액셀 다운로드
function fnExcelDownload(){
   var today = new Date();

   var year = today.getFullYear();
   var month = ('0' + (today.getMonth() + 1)).slice(-2);
   var day = ('0' + today.getDate()).slice(-2);

   var hours = ('0' + today.getHours()).slice(-2);
   var minutes = ('0' + today.getMinutes()).slice(-2);

   var dateString = year + '-' + month  + '-' + day +" "+hours+':'+minutes;

	var fileName = 'UserRegi '+dateString+'.csv';
	var csv = convertNodeToCsvString();

	var blob = new Blob(["\uFEFF"+csv], {type: 'text/csv; charset=utf-8'});
	var url = URL.createObjectURL(blob);

	var agent = window.navigator.userAgent.toLowerCase();

	if(agent.indexOf("trident")>1){
		window.navigator.msSaveBlob(blob, fileName);
	}else{
	  var link = document.createElement("a");
	  $(link).attr({"download" : fileName , "href" : url});
		link.click();
	}

}
//데이터 삭제
function fnDelete(){
    var deleteConfirm = confirm(TEXT_LST_ASK_DELETE_CHANGES);
    if(deleteConfirm != true)	return false;

	$(".spinner-wrap").show();

	var dataArr = [];


	$('#newsletterList tr').filter(':has(:checkbox:checked)').each(function() {
		var k = $(this).find('td').eq(1).text();
		if(k != "")
			dataArr.push(k);
	});


	let searchData = {
		memberId_arr: dataArr
	};

	$.ajax({
		type: 'POST',
		url: "/system/userregi/user/delete/memberId",
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(searchData)
	}).done(function (data){
		$(".spinner-wrap").hide();
		alert(TEXT_LST_ASK_DELETE_SUCCESS);
		fnSearch();
	}).fail(function (data){
		$(".spinner-wrap").hide();
	});
}



function fnSearch(){
	if(!from_to_ymd_sel2("FromDt", "ToDt"))	return false;

	var table = $('#newsletterList').DataTable();
	//var table1 = $('#userRegiList_hide').DataTable();
	//테이블 비우기
	table.clear();
	//table1.clear();

	$(".spinner-wrap").show();

    let searchData = {
        udSelect: $("#udSelect").val(),
        adminSearch: $("#adminSearch").val(),
        useyn: $("#useSelect").val(),
        lockyn: $("#lockSelect").val(),
        fromdt: $("#FromDt").val(),
        todt: $("#ToDt").val()
    };

   $.ajax({
	   type: "GET",
	   url: "/api/newsletter/list",
	   //data: JSON.stringify(searchData),
	   contentType: "application/json; charset=utf-8",
   }).done(function (data) {
   		fnDraw(data.list);
        /*
		if(data.indexOf("<!doctype html>") != -1)
			location.reload();
		else if(data){
		   fnDraw(data);
		   //fnDraw1(data);
		}
		*/
		$(".spinner-wrap").hide();
   }).fail(function (data) {
	  $("#newsletterList tbody").empty()
		.append("<tr><td colspan='9'>데이터를 조회하는데 실패했습니다.</td></tr>");
	  $(".spinner-wrap").hide();
		return false;
	});
}

function fnSearch1(){
	if(!from_to_ymd_sel2("FromDt", "ToDt"))	return false;

	$("#userRegiList_hide").html("");

	$(".spinner-wrap").show();

    let searchData = {
        udSelect: $("#udSelect").val(),
        adminSearch: $("#adminSearch").val(),
        useyn: $("#useSelect").val(),
        lockyn: $("#lockSelect").val(),
        fromdt: $("#FromDt").val(),
        todt: $("#ToDt").val()
    };

   $.ajax({
	   type: "POST",
	   url: "/system/userregi/api/user",
	   data: JSON.stringify(searchData),
	   contentType: "application/json; charset=utf-8",
   }).done(function (data) {
	   if(data){
		   fnDraw1(data);
		   exportExcel();
	   }
	   $(".spinner-wrap").hide();
   }).fail(function (data) {
		$(".spinner-wrap").hide();
		return false;
	});
}

function fnDraw(data){
	var table = $('#newsletterList').DataTable();

	table.clear();

	table.rows.add(data);
	//table1.rows.add(data);
	table.draw();
	//table1.draw();
}

function fnDraw1(data){
	var userRegiListData = "";
	userRegiListData += "<thead><tr>";
	userRegiListData += "<th>HOPE ID</th><th>email</th><th>성명_한국어</th><th>성명_영어</th><th>성명_중국어</th><th>Company Code</th><th>회사명_한국어</th><th>회사명_영어</th><th>회사명_중국어</th><th>PG Code</th><th>PG명_한국어</th><th>PG명_영어</th><th>PG명_중국어</th><th>PU Code</th><th>PU명_한국어</th><th>PU명_영어</th><th>PU명_중국어</th><th>Team Code</th><th>팀명_한국어</th><th>팀명_영어</th><th>팀명_중국어</th><th>재직구분</th><th>사용여부</th><th>잠금여부</th>";
	userRegiListData += "</tr></thead><tbody>";
	for(var i=0;i<data.length;i++){
		userRegiListData += "<tr>";

		userRegiListData += "<td>"+data[i].memberid+"</td>";
		userRegiListData += "<td>"+data[i].email+"</td>";
		userRegiListData += "<td>"+data[i].membername+"</td>";
		userRegiListData += "<td>"+data[i].memberenname+"</td>";
		userRegiListData += "<td>"+data[i].membercnname+"</td>";
		userRegiListData += "<td>"+data[i].companycode+"</td>";
		userRegiListData += "<td>"+data[i].companykrname+"</td>";
		userRegiListData += "<td>"+data[i].companyenname+"</td>";
		userRegiListData += "<td>"+data[i].companycnname+"</td>";
		userRegiListData += "<td>"+data[i].pgcode+"</td>";
		userRegiListData += "<td>"+data[i].pgkrname+"</td>";
		userRegiListData += "<td>"+data[i].pgenname+"</td>";
		userRegiListData += "<td>"+data[i].pgcnname+"</td>";
		userRegiListData += "<td>"+data[i].pucode+"</td>";
		userRegiListData += "<td>"+data[i].pukrname+"</td>";
		userRegiListData += "<td>"+data[i].puenname+"</td>";
		userRegiListData += "<td>"+data[i].pucnname+"</td>";
		userRegiListData += "<td>"+data[i].divisioncode+"</td>";
		userRegiListData += "<td>"+data[i].divisionkrname+"</td>";
		userRegiListData += "<td>"+data[i].divisionenname+"</td>";
		userRegiListData += "<td>"+data[i].divisioncnname+"</td>";
		if(data[i].resignationstatus == "0")
			userRegiListData += "<td>재직</td>";
		else if(data[i].resignationstatus == "1")
			userRegiListData += "<td>휴직</td>";
		else
			userRegiListData += "<td>퇴직</td>";
		userRegiListData += "<td>"+(data[i].useyn==true ? "Y" : "N")+"</td>";
		userRegiListData += "<td>"+(data[i].lockyn==true ? "Y" : "N")+"</td>";

		userRegiListData += "</tr>";
	}
	userRegiListData += "</tbody>";

	$("#userRegiList_hide").html(userRegiListData);
}

function fnValidationAdmin(){

	let $t, t;
	let result = true;
	let error;

    $(".table-data4").find("input").each(function(i) {
        if(result == true){
        $t = jQuery(this);

        if($t.prop("required")) {
            if(!jQuery.trim($t.val())) {
                t = jQuery("label[for='"+$t.attr("id")+"']").text();
                $t.focus();
                //throw new Error( t + " 필수 입력입니다." );
                alert( t + " 필수 입력입니다." );
                result = false;
            }
        }
        }
    });

        $(".table-data4").find("textarea").each(function(i) {
            if(result == true){
            $t = jQuery(this);

            if($t.prop("required")) {
                if(!jQuery.trim($t.val())) {
                    t = jQuery("label[for='"+$t.attr("id")+"']").text();
                    $t.focus();
                    //throw new Error( t + " 필수 입력입니다." );
                    alert( t + " 필수 입력입니다." );
                    result = false;
                }
            }
            }
        });

    return result;

}


var excelHandler = {
	getExcelFileName : function(){
		var today = new Date();
		var year = today.getFullYear();
		var month = ('0' + (today.getMonth() + 1)).slice(-2);
		var day = ('0' + today.getDate()).slice(-2);
		var hours = ('0' + today.getHours()).slice(-2);
		var minutes = ('0' + today.getMinutes()).slice(-2);
		var seconds = ('0' + today.getSeconds()).slice(-2);
		var f_name = '사용자등록_' + year + month + day + hours + minutes + seconds + ".xlsx";
		//return 'userRegiList.xlsx';
		return f_name;
	},
	getSheetName : function(){
		return 'user';
	},
	getExcelData : function(){
		return document.getElementById('userRegiList_hide');
	},
	getWorksheet : function(){
		return XLSX.utils.table_to_sheet(this.getExcelData(), {raw :true});
	}
}

function exportExcel(){
	//fnSearch1();
	//$(".spinner-wrap").show();
    // step 1. workbook 생성
    var wb = XLSX.utils.book_new();

    // step 2. 시트 만들기
    var newWorksheet = excelHandler.getWorksheet();

    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.
    XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());

    // step 4. 엑셀 파일 만들기
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

	//$(".spinner-wrap").hide();

    // step 5. 엑셀 파일 내보내기
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());

}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++)
		view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}






function exportExcel2(){
    var table = document.getElementById("userRegiList_hide");
    _excelDown("엑셀파일명.xls", "시트명", table.outerHTML)
}



function _excelDown(fileName, sheetName, sheetHtml) {
    var html = '';
    html += '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    html += '    <head>';
    html += '        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    html += '        <xml>';
    html += '            <x:ExcelWorkbook>';
    html += '                <x:ExcelWorksheets>';
    html += '                    <x:ExcelWorksheet>'
    html += '                        <x:Name>' + sheetName + '</x:Name>';   // 시트이름
    html += '                        <x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions>';
    html += '                    </x:ExcelWorksheet>';
    html += '                </x:ExcelWorksheets>';
    html += '            </x:ExcelWorkbook>';
    html += '        </xml>';
    html += '    </head>';
    html += '    <body>';

    // ----------------- 시트 내용 부분 -----------------
    html += sheetHtml;
    // ----------------- //시트 내용 부분 -----------------

    html += '    </body>';
    html += '</html>';

    // 데이터 타입
    var data_type = 'data:application/vnd.ms-excel';
    var ua = window.navigator.userAgent;
    var blob = new Blob([html], {type: "application/csv;charset=utf-8;"});

    if ((ua.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) && window.navigator.msSaveBlob) {
        // ie이고 msSaveBlob 기능을 지원하는 경우
        navigator.msSaveBlob(blob, fileName);
    } else {
        // ie가 아닌 경우 (바로 다운이 되지 않기 때문에 클릭 버튼을 만들어 클릭을 임의로 수행하도록 처리)
        var anchor = window.document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();

        // 클릭(다운) 후 요소 제거
        document.body.removeChild(anchor);
    }
}


function initFileDownload(){
    $('#attachedFileMList').DataTable({
			order: [[0, 'desc']],
			ordering: false,
			pageLength: 5,
			pagingType: "full_numbers",
			paging: false,
			select: false,
			searching: false,
			info: false,
			autoWidth: false,
			dom:
				"<'thead-fixed'<'scroll s-c5'tr>>" +
				"<''p>",
			language: {
				zeroRecords: "The data does not exist.",
				paginate: {
					first:"맨앞",
					previous:"이전",
					next: "다음",
					last:"맨뒤"
				}
			},
			columns: [
				{ title: "<span class='ellipsis' style='text-align: center;'>file name</span>",       	data: "atchmnflnmori",	        width: "20%" },	//0
				{ title: "<span class='ellipsis' style='text-align: center;'>category</span>",       	data: null,	        width: "20%" },	//1
				{ title: "<span class='ellipsis' style='text-align: center;'>file selection</span>",       	data: null,	        width: "20%" },	//2
				{ title: "<span class='ellipsis' style='text-align: center;'>download</span>",       	data: null,	        width: "20%" },	//3
				{ title: "<span class='ellipsis' style='text-align: center;'>delete</span>",       	data: null,	        width: "10%" },	//4
                { title: "",       	data: "filelistkey"},	//5
                { title: "",       	data: "filegroupid"},	//6
                { title: "",       	data: "notiatchmflno"},	//7
                { title: "",       	data: "atchmflpath"},	//8
                { title: "",       	data: "atchmnflnm"},	//9
                { title: "",       	data: "temp_no"},	//10
		   ],
		   columnDefs: [
				{
					targets: 0,
					className: "ellipsis text-center",
					render: function (data, type, row){
						var html = data;
						return html;
					}
			   },{
					targets: 1,
					className: "ellipsis text-center",
					render: function (data, type, row, meta){
                    console.log(data)
                    console.log(row.notiatchmflno)
                        var html = "";
                            html += "<select class='form-control' name='pop_attach_putype'"
                            html += "onChange='pop_board_ctrgycd(this, "+0+");'><option value='06' selected>멀티</option></select>";
                            var html ="<div>Newsletter</div>";
                        return html;



					}
			   },{
					targets: 2,
					className: "ellipsis text-center",
					render: function (data, type, row, meta){
						var html ="";
						if(row.notiatchmflno == "")
							html += "<input type='file' class='btn-file' multiple='multiple' onChange='pop_board_fileulppad(this, \""+meta.row+"\");'>";
						return html;
					}
			   },{
					targets: 3,
					className: "ellipsis text-center",
					render: function (data, type, row, meta){
						var html ="";
						if(row.notiatchmflno != "")
							//html = "<button type='button' class='btn btn-secondary btn-xs' onClick='modify_filedownload(\""+meta.row+"\");'>download</button>";
							html = "<button type='button' class='btn btn-secondary btn-xs' onClick='modify_filedownload(\""+row.temp_no+"\");'>download</button>";
						return html;
					}
			   },

			   {
					targets: 4,
					className: "ellipsis text-center",
					render: function (data, type, row, meta){
						//var html = "<button type='button' class='btn btn-secondary btn-xs' onClick='pop_board_filedel(\""+meta.row+"\");'>delete</button>";
						var html = "<button type='button' class='btn btn-secondary btn-xs' onClick='pop_board_filedel(\""+row.temp_no+"\");'>delete</button>";
						return html;
					}
				},

				{					targets: 5,					visible: false,
				},{					targets: 6,					visible: false,
				},{					targets: 7,					visible: false,
				},{					targets: 8,					visible: false,
				},{					targets: 9,					visible: false,
				},{					targets: 10,					visible: false,
			   }
		   ],
		});



	$('#attachedFileListView').DataTable({
		order: [[0, 'desc']],
		ordering: false,
		pageLength: 5,
		pagingType: "full_numbers",
		paging: false,
		select: false,
		searching: false,
		info: false,
		autoWidth: false,
		destory:true,
		dom:
			"<'thead-fixed'<'scroll s-c5'tr>>" +
			"<''p>",
		language: {
			zeroRecords: "The data does not exist.",
			paginate: {
				first:"맨앞",
				previous:"이전",
				next: "다음",
				last:"맨뒤"
			}
		},
		columns: [
			{ title: "<span class='ellipsis' style='text-align: center;'>file name</span>",       	data: "atchmnflnmori",	        width: "44%" },	//0
			{ title: "<span class='ellipsis' style='text-align: center;'>category</span>",       	data: null,	        width: "44%" },	//1
			{ title: "<span class='ellipsis' style='text-align: center;'>download</span>",       	data: null,	        width: "12%" },	//2

			{ title: "",       	data: "filelistkey"},	//3
			{ title: "",       	data: "filegroupid"},	//4
			{ title: "",       	data: "notiatchmflno"},	//5
			{ title: "",       	data: "atchmflpath"},	//6
			{ title: "",       	data: "atchmnflnm"},	//7
	   ],
	   columnDefs: [
			{
				targets: 0,
				className: "ellipsis text-center",
				render: function (data, type, row){
					var html = data;
					return html;
				}
		   },{
				targets: 1,
				className: "ellipsis text-center",
				render: function (data, type, row){
					var html = 'Newsletter';
					return html;
				}
		   },{
				targets: 2,
				className: "ellipsis text-center",
				render: function (data, type, row, meta){
					var html = "<button type='button' class='btn btn-secondary btn-xs' onClick='view_filedownload(\""+meta.row+"\");'>download</button>";
					return html;
				}
			},{				targets: 3,					visible: false,
			},{				targets: 4,					visible: false,
			},{				targets: 5,					visible: false,
			},{				targets: 6,					visible: false,
			},{				targets: 7,					visible: false,
		   }
	   ],
	});


}


function view_filedownload(row){
	var table1 = $('#attachedFileListView').DataTable();
	var dataList1 = table1.rows().data();
	var rowData1 = table1.rows(row).data()[0];


	$('.group>.question-detail-a').css("display", "block");

	let dataArray = [];
	dataArray.push(rowData1);

	$.fileDownload($('#detail-board-download-p').prop('action'), {
		//preparingMessageHtml: "We are preparing your report, please wait...",
		//failMessageHtml: "There was a problem generating your report, please try again.",
		httpMethod: "GET",
		data: {"paramList" : JSON.stringify(dataArray)},
		successCallback: function (url) {
			$('.group>.question-detail-a').css("display", "none");
		},
		failCallback: function (responseHtml, url, error) {
			$('.group>.question-detail-a').css("display", "none");
		}
	});
}



//첨부파일 추가
$('#pop-write-file-append').on("click",function(e){

    var _pop_atch_file_cnt = 0;
    var table = $('#attachedFileMList').DataTable();

    var text0 = '[{';
    text0 += '"atchmnflnmori":""';
    text0 += ',"":""';
    text0 += ',"":""';
    text0 += ',"":""';
    text0 += ',"":""';
    text0 += ',"filelistkey":""';
    text0 += ',"filegroupid":""';
    text0 += ',"notiatchmflno":""';
    text0 += ',"atchmflpath":""';
    text0 += ',"atchmnflnm":""';
    text0 += ',"temp_no":"'+_pop_atch_file_cnt+'"';
    text0 += '}]';

    var data = JSON.parse(text0);
    table.rows.add(data).draw();

    _pop_atch_file_cnt++;

    e.preventDefault();

});

function pop_board_filedel(row){
    /*
    var table1 = $('#attachedFileMList').DataTable();
    var dataList1 = table1.rows().data();

    table1.row(row).remove().draw();
    */

    //		$('.group>.writeModal-b').css("display", "block");
    //console.log("dellllllllllll   ["+row);
    		var table1 = $('#attachedFileMList').DataTable();
    		var dataList1 = table1.rows().data();


    /*

    		var rowData1 = table1.rows(row).data()[0];
    		if(rowData1["notiatchmflno"] != "")
    			_pop_atch_file_arr.push(rowData1["notiatchmflno"]);
    		table1.row(row).remove().draw();
    */



    		for(var i=0;i<dataList1.length;i++){
    			var rowData1 = table1.rows(i).data()[0];
    			if(rowData1["temp_no"] == row){

    					//_pop_atch_file_arr.push(rowData1["notiatchmflno"]);
                    if(_pop_atch_file_arr != "")
                        _pop_atch_file_arr += ",";
                    _pop_atch_file_arr += rowData1["notiatchmflno"];


    				table1.row(i).remove().draw();

    				break;
    			}
    		}

}




//첨부파일 다운로드
function modify_filedownload(row){

    var table1 = $('#attachedFileMList').DataTable();
    var dataList1 = table1.rows().data();
    //var rowData1 = table1.rows(row).data()[0];

    var rowData1 = null;
    for(var i=0;i<dataList1.length;i++){
        rowData1 = table1.rows(i).data()[0];
        if(rowData1["temp_no"] == row){
            break;
        }
    }


	$('.group>.question-detail-a').css("display", "block");
    let dataArray = [];
    dataArray.push(rowData1);

    $.fileDownload($('#detail-board-download-p').prop('action'), {
        //preparingMessageHtml: "We are preparing your report, please wait...",
        //failMessageHtml: "There was a problem generating your report, please try again.",
        httpMethod: "GET",
        data: {"paramList" : JSON.stringify(dataArray)},
        successCallback: function (url) {
			$('.group>.question-detail-a').css("display", "none");
        },
        failCallback: function (responseHtml, url, error) {
			$('.group>.question-detail-a').css("display", "none");
        }
    });

}

//첨부파일 유형
function pop_board_ctrgycd(t, row){
    var table1 = $('#attachedFileMList').DataTable();
    var dataList1 = table1.rows().data();
    var rowData1 = table1.rows(row).data()[0];
    rowData1["notiatchmflno"] =t.value;
}



function pop_board_fileulppad(t, row){

    console.log("fffffffffffffffffff ["+row);
    console.log("fffffffffffffffffff ["+t);
    console.log("fffffffffffffffffff ["+t.files[0]);        //file
    console.log("fffffffffffffffffff ["+t.value);           //경로
    console.log("fffffffffffffffffff ["+t.files[0].name);   //파일명
    console.log("fffffffffffffffffff ["+t.files[0].type);   //확장자
    console.log("fffffffffffffffffff ["+t.files[0].size);   //크기


    //$('.group>.writeModal-b').css("display", "block");
	$('.group>.question-detail-a').css("display", "block");
    const formData = new FormData();
    formData.append("board", t.files[0]);
    //formData.append("noticd", $("#now-write-noticd").val());
    console.log(formData)

    $.ajax({
        type: 'POST',
        //url: '/snop/support/board-file-upload',
        url: '/api/newsletter/board-file-upload',
        processData: false,
        contentType: false,
        data: formData,
    }).done(function (data) {
        console.log(data)
        var table = $('#attachedFileMList').DataTable();
        var dataList = table.rows().data();
        var rowData = table.rows(row).data()[0]

        rowData['atchmnflnm'] = data;
        rowData['atchmnflnmori'] = t.files[0].name;
        rowData['atchmflext'] = t.files[0].type;

        var r_count = 0;
        $('#attachedFileMList tbody tr').each(function() {
            if(row == r_count){
                var tr = $(this);
                var td = tr.children();

                td.eq(0).text(rowData['atchmnflnmori']);
                //td.eq(10).text(rowData['atchmnflnmori']);
                //td.eq(12).text(rowData['atchmnflext']);
                return false;
            }
            r_count++;
        });

        $('.group>.question-detail-a').css("display", "none");
        return true;
    }).fail(function (data) {
        $('.group>.question-detail-a').css("display", "none");
        return true;
    });

}

function getFileList(param){
    var _data = new Object();
    _data.filegroupid = param;

	$.ajax({
		type: 'POST',
		url: '/api/newsletter/file',
        data: JSON.stringify(_data),
        contentType: 'application/json; charset=utf-8',
	}).done(function (data) {
        console.log(data);

		data_draw(data);

		return true;
	}).fail(function (data) {

		return true;
	});
}

function getFileListModify(param){
    var _data = new Object();
    _data.filegroupid = param;

	$.ajax({
		type: 'POST',
		url: '/api/newsletter/file',
        data: JSON.stringify(_data),
        contentType: 'application/json; charset=utf-8',
	}).done(function (data) {
        console.log(data);

		data_draw_modify(data);

		return true;
	}).fail(function (data) {

		return true;
	});
}


function data_draw(data){
    /**
     * 숫자 세자리마다 , 찍기
     * @param {number} value ,를 채워넣을 숫자
     * @returns {string} 결과 문자열
     */
    const numberWithCommas = value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');


	var cnt1 = 0;
	if((typeof data != "object") && data.indexOf("<!doctype html>") != -1)
		location.reload();
	else if(data){

		var table = $('#attachedFileListView').DataTable();
		table.rows.add(data.file.list).draw();
		var dataList = table.rows().data();

		//$(".newsletter-file-cnt").text(numberWithCommas(dataList.length));
	}
}

function data_draw_modify(data){

/*
    const numberWithCommas = value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');


	var cnt1 = 0;
	if((typeof data != "object") && data.indexOf("<!doctype html>") != -1)
		location.reload();
	else if(data){

		var table = $('#attachedFileMList').DataTable();
		table.rows.add(data.file.list).draw();
		var dataList = table.rows().data();


	}
	*/

		var table = $('#attachedFileMList').DataTable();
		table.clear().draw();

		if(data) table.rows.add(data.file.list).draw();

		var dataList = table.rows().data();
		if(dataList.length > 0){
			//$("#now-click-remark-cd").val(table.rows(0).data()[0]['zecrcod']);
			//$("#now-click-remark-nm").val(table.rows(0).data()[0]['zecdnam']);
		}

		$('.newsletter-file-cnt').text(dataList.length);
		_pop_atch_file_cnt = dataList.length;
}


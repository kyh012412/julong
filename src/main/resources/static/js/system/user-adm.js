$(document).ready(function() {
	fnInit();

	site_search();

	var table = $('#userList').DataTable();
	$('#userList').on( 'click', 'tr', function () {
		var rowData = table.rows(this).data()[0];
		site_info_edit(rowData);
	});
})


$(window).resize(function() {
    let window_height =  $(window).height();
    let div_height = window_height - 330;

    $(".dataTables_wrapper>.brd-top-box>.scroll").css("height", div_height + "px");
});

function fnInit() {
    const tbl = $('#userList').DataTable( {
        order: [0, 'desc'],
        ordering: true,
		paging : true,
        pageLength: 20,
        pagingType: "full_numbers",
        serverSide: false,
        select: true,
        lengthMenu:  [20, 40, 60, 80, 100 ],
		lenghChange : true,
		lengthChange : true,
        searching: true,
		processing : false,
		autoWidth : false,
        language: {
            zeroRecords: "데이터가 존재하지 않습니다.",
            search: "",
			lengthMenu: "_MENU_개 보기",
            searchPlaceholder: "사번/이름",
            paginate: {
                first:"맨앞",
                previous:"이전",
                next: "다음",
                last:"맨뒤"
            }
        },
		columns: [
			{ title: "<span class='ellipsis'>번호</span>",				data : "memberKey",				width : "10%", searchable:false},
			{ title: "<span class='ellipsis'>등록일자</span>",  			data : "createDatetime_f",		width : "15%"},
			{ title: "<span class='ellipsis'>사번</span>",  				data : "employeeNo",			width : "25%"},
			{ title: "<span class='ellipsis'>이름</span>",  				data : "memberName",			width : "15%"},
			{ title: "<span class='ellipsis'>마지막 로그인 시각</span>",  	data : "lastLoginDatetime_f",	width : "15%", searchable:false},
			{ title: "<span class='ellipsis'>역할</span>",  				data : "codeMemberTypeName",	width : "20%", searchable:false},

			{ title: "",  	data : "codeMemberType"},
			{ title: "",  	data : "photoPath"},
			{ title: "",  	data : "photoFile"},
			{ title: "",  	data : "telNo"},
			{ title: "",  	data : "phoneNo"},
			{ title: "",  	data : "email"},
			{ title: "",  	data : "division"},
			{ title: "",  	data : "typeAuthName"},

		],
		columnDefs: [
			{
				targets: 0,
				className: "",
				render : function (data, type, row){
					var html = data;
					return html;
				}
			},{
				targets: 1,
				className: "",
				render : function (data, type, row){
					//var html = "<span class='ellipsis'>" + get_ymd(data) + "</span>";
					var html = "<span class='ellipsis'>" + data + "</span>";
					return html;
				}
			},{
				targets: 2,
				className: "",
				render : function (data, type, row){
					var html = "<span class='ellipsis'>" + data + "</span>";
					return html;
				}
			},{
				targets: 3,
				className: "",
				render : function (data, type, row){
					var html = "<span class='ellipsis'>" + data + "</span>";
					return html;
				}
			},{
				targets: 4,
				className: "",
				render : function (data, type, row){
					//var html = "<span class='ellipsis'>" + get_ymdhm(data) + "</span>";
					var html = "<span class='ellipsis'>" + data + "</span>";
					return html;
				}
			},{
				targets: 5,
				className: "",
				render : function (data, type, row){
					var html = "<span class='ellipsis'>" + data + "</span>";
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
			}
		]
    });

    $('#startDate, #endDate').change(function () {
        tbl.draw();
    })

    let window_height =  $(window).height();
    let div_height = window_height - 330;

    $(".dataTables_wrapper>.thead-fixed>.scroll").css("height", div_height + "px");

	// update
	$(document).on("click", "#btnRegUserPopUpdate", function(){
		const _validation = $(".data-update-form").parsley();
		if (!_validation.validate())	return;

		Swal.fire({
			title: "저장 ?",
			text: "변경된 설정을 저장하시겠습니까?",
			icon: "info",
			showCancelButton: true,
			cancelButtonText: "취소",
			confirmButtonText: "저장",
			allowOutsideClick: false,
			allowEscapeKey: false
		}).then((_isConfirm) => {
			if (_isConfirm.isConfirmed) {

				const _requestFormData = new FormData($("#userForm")[0]);
				_requestFormData.append("memberKey", $('#pop_edit_memberKey').val());
				_requestFormData.append("telNo", $('#pop_edit_telNo').val());
				_requestFormData.append("phoneNo", $('#pop_edit_phoneNo').val());
				_requestFormData.append("email", $('#pop_edit_email').val());
				_requestFormData.append("division", $('#pop_edit_division').val());
				_requestFormData.append("codeMemberType", $('#pop_edit_codeMemberType').val());

				$.ajax({
					type: 'POST',
					url: window.location.pathname + '/user-UpdateAjax',
					data: _requestFormData,
					enctype: 'multipart/form-data',
					cache: false,
					processData: false,
					contentType: false
				}).done(function(data) {
					site_search();
					$("#editUserModal_001").modal("hide");
				}).fail(function (data) {
					Swal.fire({
						title: "/user-UpdateAjax 처리가 실패했습니다.",
						text: data.responseJSON.message,
						icon: "error"
					}).then(() => {
						return false;
					})
				});
			}
		});
	});

}

//전체목록 날짜 검색
$.fn.dataTable.ext.search.push(
    function (settings, data) {
        let min = $('#startDate').val();
        let max = $('#endDate').val();
        let date_pursached = data[1] || 0; // use data for the date column
        if (min == "" && max == "") {
            return true;
        }
        if (min == "" && date_pursached <= max) {
            return true;
        }
        if (max == "" && date_pursached >= min) {
            return true;
        }
        if (date_pursached <= max && date_pursached >= min) {
            return true;
        }
        return false;
    }
);

function fntableDraw(data){
	var table = $("#userList").DataTable();
	table.clear();
	
	if(data) table.rows.add(data);
	table.draw();
}

// 관리자 - 사이트명관리 - 검색
function site_search(){

    $.ajax({
        type: 'POST',
        url: window.location.pathname + '/userAjax',
        data: {
            search: ''
        },
	}).done(function (data) {
		if (data) {
			fntableDraw(data);	
			$('#user_001').hide();
		}else{
			fntableDraw();
		}
	}).fail(function (data) {

	});
}

function get_ymd(dt){
	if(dt == null)
		return "";
    var dt1 = dt.year + "-" + zeroPad(dt.monthValue, 10) + "-" + zeroPad(dt.dayOfMonth, 10);
    return dt1;
}
function get_ymdhm(dt){
	if(dt == null)
		return "";
    var dt1 = dt.year + "-" + zeroPad(dt.monthValue, 10) + "-" + zeroPad(dt.dayOfMonth, 10) + " " + zeroPad(dt.hour, 10) + ":" + zeroPad(dt.minute, 10);
    return dt1;
}

function zeroPad(nr,base){
    var  len = (String(base).length - String(nr).length)+1;
    return len > 0? new Array(len).join('0')+nr : nr;
}

function getFormatDate(date){
	var year = date.getFullYear();
	var month = (1 + date.getMonth());
	month = month >= 10 ? month : '0' + month;
	var day = date.getDate();
	day = day >= 10 ? day : '0' + day;
	return year + '-' + month + '-' + day;
}

function site_info_edit(rowData){
	var f_path = "/upload/profile/";

	$('#pop_view_img').attr('src', f_path+rowData['photoFile']);
	$('.pop_view_employeeNo').text(rowData['employeeNo']);
	$('.pop_view_memberName').text(rowData['memberName']);
	$('.pop_view_telNo').text(rowData['telNo']);
	$('.pop_view_phoneNo').text(rowData['phoneNo']);
	$('.pop_view_email').text(rowData['email']);
	$('.pop_view_division').text(rowData['division']);
	$('.pop_view_codeMemberTypeName').text(rowData['codeMemberTypeName']);
	$('.pop_view_typeAuthName').text(rowData['typeAuthName']);

	$('#pop_edit_memberKey').val(rowData['memberKey']);
	$('#pop_edit_img').attr('src', f_path+rowData['photoFile']);
	$('.pop_edit_employeeNo').text(rowData['employeeNo']);
	$('.pop_edit_memberName').text(rowData['memberName']);
	$('#pop_edit_telNo').val(rowData['telNo']);
	$('#pop_edit_phoneNo').val(rowData['phoneNo']);
	$('#pop_edit_email').val(rowData['email']);
	$('#pop_edit_division').val(rowData['division']);
	$('#pop_edit_codeMemberType').val(rowData['codeMemberType']);
	$('.pop_edit_typeAuthName').text(rowData['typeAuthName']);

	$('#user_001').show();
}
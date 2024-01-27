//---------------------------------
//모달창 상태박스 디자인 변경
function permitStatusBadge(permitStatus) {
    $('.permit').removeClass('org blu primary red-bg');
    if (permitStatus == 'common.request') {
        $('.permit').addClass('org');
    } else if (permitStatus == 'common.wait') {
        $('.permit').addClass('blu');
    } else if (permitStatus == 'common.approved') {
        $('.permit').addClass('primary');
    } else if (permitStatus == 'common.reject') {
        $('.permit').addClass('red-bg');
    } else if (permitStatus == 'Request') {
        $('.permit').addClass('org');
    } else if (permitStatus == 'Wait') {
        $('.permit').addClass('blu');
    } else if (permitStatus == 'Approved') {
        $('.permit').addClass('primary');
    } else if (permitStatus == 'Reject') {
        $('.permit').addClass('red-bg');
    } else if (permitStatus == 'common.request') {
        $('.permit').addClass('org');
    } else if (permitStatus == 'common.wait') {
        $('.permit').addClass('blu');
    } else if (permitStatus == 'common.approved') {
        $('.permit').addClass('primary');
    } else if (permitStatus == 'common.reject') {
        $('.permit').addClass('red-bg');
    }
}


//-----------------------------------------------------
//기본정보 사용여부 버튼
$(document).on('click', '.switch-input', function(e) {
    e.preventDefault();

    let useYn = $(this).is(':checked');
    let title = currentKey + " " + messages.confirm_useStopKey;
    let html = '<b style="color:#c01001;">[!]</b><br/>' + messages.info_useStopKey;
    if(useYn) {
        title = currentKey + " " + messages.confirm_useKey;
        html = '<b style="color:#3085d6;">[!]</b><br/>' + messages.info_useKey;
    }

    Swal.fire({
        title : title,
        html: html,
        icon : 'warning',
        showCancelButton : true,
        confirmButtonText : messages.button_modify,
        confirmButtonColor: '#c01001',
        cancelButtonText : messages.button_cancle,
        cancelButtonColor: '#999',
    }).then((isConfirm) => {
        if (isConfirm.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: '/api' + window.location.pathname + '/use',
                data: {
                    crawlingKey: currentKey,
                    useYn: useYn
                }
            }).done(function (res) {
                Swal.fire({
                    title: res.msg,
                    icon: 'success'
                })

                $('.switch-input').prop('checked', useYn);
            }).fail(function(msg) {
                let errormsg = msg.message != undefined? msg.msg : msg.responseJSON.msg;

                Swal.fire({
                    title: errormsg,
                    icon: 'error'
                })
            });
        }
    });
})


//------------------------------------------------------
// 기본정보 삭제 버튼
$(document).on('click', '#btnCrawlingDelete', function() {
    deleteByCrawlingKey();
})
$(document).on('click', '#btnCrawlingPeopleDelete', function() {
    deleteByCrawlingKey();
})

function deleteByCrawlingKey(){
    Swal.fire({
        title : currentKey + " " + messages.confirm_deleteKey,
        html: '<b style="color:#c01001;">[!]</b><br/>' + messages.info_useStopKey,
        icon : 'warning',
        showCancelButton : true,
        confirmButtonText : messages.button_delete,
        confirmButtonColor: '#c01001',
        cancelButtonText : messages.button_cancle,
        cancelButtonColor: '#3085d6',
    }).then((isConfirm) => {
        if (isConfirm.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: '/api' + window.location.pathname + '/delete',
                data: { crawlingKey: currentKey }
            }).done(function (res) {
                Swal.fire({
                    title: "no " + currentKey + " " + messages.success_deleteKey,
                    icon: 'success'
                })

                $(".modal").modal("hide");
                initCollectionListAjax();
            }).fail(function(msg) {
                Swal.fire({
                    title: "no " + currentKey + " " + messages.error_delete,
                    text: msg.responseJSON.message,
                    icon: 'error'
                })
            });
        }
    });
}

//-----------------------------------------------------
// 기본정보 수정 버튼
$(document).on('click', '#modifyInfoBtn', function(e) {
    switchToModify();
});

//-----------------------------------------------------
// 기본정보 수정 후 저장
$(document).on('click', '#saveBtn', function(e) {
    let _validation = $("#modifyInfo").parsley();
    if(_validation.validate()) {
        let hostName = $('#modify-hostName').val().trim().replace(/\s+/g, " ");
        let parentsHostName = $('#modify-parentsHostName').val().trim().replace(/\s+/g, " ");
        if(hostName && parentsHostName && hostName === parentsHostName) {
            Swal.fire({
                text : messages.info_checkGroupName,
                icon: "warning"
            })
            return;
        }

        if(!hostName && parentsHostName) {
            Swal.fire({
                text : messages.info_checkParentsNameOnly,
                icon: "warning"
            })
            return;
        }

        basicInfoUpdate();
    }else{
        Swal.fire({
            title: messages.req_confirmInfo,
            icon: "warning"
        })
        $('.approveObj').hide();
        return false;
    }
});
// 기본정보 수정 취소
$(document).on('click', '#cancelBtn', function(e) {
    switchToInfo();
});

function switchToInfo(){
    $('#info').show();
    $('#modifyInfoBtn').show();
    $('#btnCrawlingDelete').show();
    $('#modifyInfo').hide();
    $('#saveInfoBtn').hide();
}
function switchToModify(){
    $('#modifyInfo').show();
    $('#saveInfoBtn').show();
    $('#info').hide();
    $('#modifyInfoBtn').hide();
    $('#btnCrawlingDelete').hide();
}

//-----------------------------------------------------
// 기본정보 수정 ajax
function basicInfoUpdate(){
    $('#hiddenNationName').val($('#modify-codeNation option:selected').text())
    $('#hiddenCodeCategory').val($('#modify-codeCategory option:selected').text())
    let data = $('#basicInfoForm').serializeObject();
    $.ajax({
        type: 'POST',
        url: "/api/crawlingcontrol/request/update",
        data: data
    }).done(function (res) {
        if(res.message != undefined) {
            toastAlert(messages.error_save + "\n" + res.message);
            return;
        }

        setBasicInfo(data);
        switchToInfo();
        Swal.fire({
            title: res.msg,
            icon: "success"
        })
    }).fail(function(res) {
        Swal.fire({
            title: res.responseJSON.msg,
            text: messages.error_save,
            icon: "error"
        })
    });
}

function setBasicInfo(data){
    $('#normal-codeCategory').text(data.codeCategoryName);
    $('#normal-nation').text(data.codeNationName);
    $('#normal-siteName').text(data.siteName);
    $('#normal-hostName').text(data.hostName);
    $('#normal-parentsHostName').text(data.parentsHostName);
    $('#normal-remark').text(data.remark);
}

// RawCrawlingData 데이터삭제
$(document).on('click', '.btnCrawlingDataDelete', function(e) {
    e.preventDefault();

    $.ajax({
        type: 'GET',
        url: '/api' + window.location.pathname + '/dataCount',
        data: { crawlingKey: currentKey }
    }).success(function(data) {
        Swal.fire({
            title : currentKey + messages.confirm_deleteData + data,
            html: '<b style="color:#c01001;">[!]</b>' + messages.info_deleteData,
            icon : 'warning',
            showCancelButton : true,
            confirmButtonText : messages.button_delete,
            confirmButtonColor: '#c01001',
            cancelButtonText : messages.button_cancle,
            cancelButtonColor: '#3085d6',
        }).then((isConfirm) => {
            if (isConfirm.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    url: '/api' + window.location.pathname + '/dataDelete',
                    data: { crawlingKey: currentKey },
                }).done(function (res) {
                    Swal.fire({
                        title: "No " + currentKey + ": " + res.msg,
                        text: res.cnt + res.data,
                        icon: 'success'
                    })
                }).fail(function(res) {
                    Swal.fire({
                        title: "No " + currentKey + ": " + res.msg,
                        icon: 'error'
                    })
                });
            }
        });
    }).fail(function(res) {
        Swal.fire({
            title : res.responseJSON.msg,
            icon : 'error',
        })
    });
});

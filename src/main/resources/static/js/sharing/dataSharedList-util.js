/* 사이트 수집 */
$('[name="siteUrl"]').on({
   change: function() {
       $('.isconfirmed-url').val(false);
       $('#btnUrlCheck').focus();
   },
   keyup: function(key) {
       if(key.keyCode==13) {
           $("#btnUrlCheck").click();
       } else {
           let _crawlingKey = 0;
           let _updateCrawlingKey = $("#siteUpdateModal [name='crawlingKey']").val();
           if(_updateCrawlingKey != undefined) _crawlingKey = _updateCrawlingKey;

           if(!$(this).val().trim()) {
               $(".url-duple-list-result").hide();
               return;
           }

           $.ajax({
               type: 'POST',
               url: '/api/crawling/request/urlDupleList',
               data: JSON.stringify({
                   siteUrl: $(this).val().trim(),
                   crawlingKey: _crawlingKey
               }),
               contentType: 'application/json; charset=UTF-8'
           }).success(function(data) {
                if(data != null && data.length > 0) {
                    $(".table-url-duple-list tbody").empty();
                    data.forEach(item => {
                        let tr = "<tr>";
                        tr += "<td>" + item.siteName + "</td>";
                        tr += "<td>" + item.siteUrl + "</td>";
                        tr += "</tr>";
                        $(".table-url-duple-list tbody").append(tr);
                    })
                    $(".url-duple-list-result").show();
                } else {
                    $(".table-url-duple-list tbody").empty();
                    $(".url-duple-list-result").hide();
                }
           }).fail(function(data) {
           });
       }
   }
});


$(document).on('click', '#btnUrlCheck', function(e) {
    e.preventDefault();
    if($('.isconfirmed-url').val() !== true || $('.isconfirmed-url').val !== 'true') {
        checkUrlDuplicateAjax();
    } else {
        toastAlert(messages.info_duplicateComplete);
    }
})

$(document).on('click', '[name="isLoginRequired"]', function() {
    if($(this).val() == "true") {
        $(".login-info").attr({required:true, readOnly:false});
    } else {
        $('.login-info').val('').attr({required:false, readOnly:true});
    }
})


/* 인물 수집 */
//파일 업로드
$(document).on('click', '#ocrForm .fileinput-upload', function(e) {
    e.preventDefault();
    const base64RegExp = new RegExp("^data:image\\/(\\w+);base64,");
    let _imgSrc = $('.file-preview-image')[0].src;
    let _imgFile = _imgSrc.replace(base64RegExp, '');

    fetch('/api/crawling/ocr/image', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'imgFile': _imgFile})
    })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            if (!res.ok) {
                toastAlert(messages.error_idCardFail);
                return;
            }
        })
        .then(res => {
            viewOcrInfo(res);
        })
        .catch(error => console.log("error : ", error));
})

//파일 삭제
$(document).on('click', '.fileinput-remove', function() {
    $("#ocrInfo").find("input").val('');
    $("#peopleRequestTable #ocrInfo").hide();
    $("#peopleUpdateTable #ocrInfo").removeClass("active");
});

//인물정보 수집경로 url
$(document).on('change', '.people-crawlinfo-checkbox', function() {
    let id = $(this).attr('id');
    let isChecked = $(this).is(':checked');
    if(id === "peopleLinkedin") {
        if(isChecked) $(".people-linkedin").attr({ readOnly: false, required: true })
        else $(".people-linkedin").val('').attr({ readOnly: true, required: false })
    }
    if(id === "peopleFacebook") {
        if(isChecked) $(".people-facebook").attr({ readOnly: false, required: true })
        else $(".people-facebook").val('').attr({ readOnly: true, required: false })
    }
    if(id === "peopleGoogle") {
        if(isChecked) $(".people-google").attr({ readOnly: false, required: true })
        else $(".people-google").val('').attr({ readOnly: true, required: false })
    }
})


function checkUrlDuplicateAjax() {
    if(!$('[name="siteUrl"]').parsley().isValid()) {
        toastAlert(messages.req_notBlankUrl);
        $('[name="siteUrl"]').focus();
        return false;
    }

    let _crawlingKey = 0;
    let _updateCrawlingKey = $("#siteUpdateModal [name='crawlingKey']").val();
    if(_updateCrawlingKey != undefined) _crawlingKey = _updateCrawlingKey;

    $.ajax({
        type: 'POST',
        url: '/api/crawling/request/isUrlDuple',
        data: JSON.stringify({
            crawlingKey : _crawlingKey
            , siteUrl: $('[name="siteUrl"]').val()
        }),
        contentType: 'application/json; charset=UTF-8'
    }).done(function(data) {
        if(data.message != undefined) {
            toastAlert(  + '<br> : ' + data.msg);
            $('.isconfirmed-url').val(false);
            // isUrlDuplicate(data);
            return false;
        }
        toastAlert(messages.success_duplicatedUrl);
        $('.isconfirmed-url').val(true);
        $(".table-url-duple-list tbody").empty();
    }).fail(function(data) {
        toastAlert(messages.error_impossibleUrl +'<br> : ' + data.responseJSON.message);
        $('.isconfirmed-url').val(false);
    });
}

function validateUrlDuplicate() {
    let _isconfimedUrl = $('.isconfirmed-url').val();
    if(_isconfimedUrl === true || _isconfimedUrl === 'true') {
        return true;
    }
    toastAlert(messages.req_duplicateUrl);
    return false;
}

function viewOcrInfo(res) {
    $("#ocrInfo").find("input").val('');
    $("#peopleUpdateTable .people-crawlinfo").val('').attr('readonly', true);
    $("#peopleUpdateTable .people-crawlinfo-checkbox").attr("checked", false);

    let _keys = Object.keys(res);
    _keys.forEach(key => {
        $("#ocrInfo [name='"+key+"']").val(res[key]);
    })
    $("#peopleRequestTable #ocrInfo").show();
    $("#peopleUpdateTable #ocrInfo").addClass("active");
}

function toastAlert(message) {
    $('.toast-body').html(message);
    $("#toastAlert").show().toast('show');
}

$(document).ready(function() {
    initRequestListAjax()
});

$(document).on('click', '#btnSearch', function() {
    initRequestListAjax();
})

function initRequestListAjax() {
    $('#processList').DataTable( {
        order: [0, 'desc'],
        ordering: false,
        paging : true,
        pageLength: 20,
        // pagingType: "full_numbers_no_ellipses",
        lengthMenu:  [20, 40, 60, 80, 100 ],
        lengthChange : true,
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
        select: true,
        autoWidth : false,
        searching: false,
        stateSave: false,
        // serverSide: true,
        processing : true,
        destroy: true,
        ajax : {
            url : '/api/monitor/analysis?startAt='+$("#startDate").val()+'&endAt='+$("#endDate").val(),
            // url : '/api/monitor/analysis?startAt='+$("#startDate").val()+'&endAt='+$("#endDate").val()+'&page=1&size=20',
            type : "GET",
            dataType : "json",
            dataSrc : "content",
            contentType: "application/json; charset=utf-8",
        },
        columns: [
            { title: "<span class=\"ellipsis\">날짜</span>" ,
                data: "date" ,
                width: "10%",
                render: function(data, type, row) {
                    if (data.monthValue <= 9 && data.dayOfMonth <= 9){
                        data = data.year + '-0' + data.monthValue + '-0' + data.dayOfMonth;
                    } else if(data.monthValue <= 9) {
                        data = data.year + '-0' + data.monthValue + '-' + data.dayOfMonth;
                    } else if(data.dayOfMonth <= 9) {
                        data = data.year + '-' + data.monthValue + '-0' + data.dayOfMonth;
                    } else {
                        data = data.year + '-' + data.monthValue + '-' + data.dayOfMonth;
                    }
                    return data;
                }
            },
            { title: "<span class=\"ellipsis\">상태</span>" ,
                data: "meanCount" ,
                width: "5%",
                render: function(data, type, row) {
                    if (data === row.analysisCount && row.rawCount === row.meanAllCount) {
                        data = "<span class='badge blu'> 정상 </span>";
                    } else {
                        data = "<span class='badge red'> 비정상 </span>";
                    }
                    return data;
                }
            },
            { title: "<span class=\"ellipsis\">수집 데이터 입력</span>" ,
                data: "rawCount",
                width: "10%",
            },
            { title: "<span class=\"ellipsis\">분석 데이터 저장</span>" ,
                data: "analysisCount",
                width: "10%",
            },
            { title: "<span class=\"ellipsis\">유의미 분석</span>" , data: "meanAllCount" , width: "20%",
                render: function(data, type, row) {
                    data = data+'<p>(유의미: '+row.meanCount+'건 / 무의미: '+row.notMeanCount+'건)';
                    return data;
                }
            },
            { title: "<span class=\"ellipsis\">요약 처리</span>" , data: "abstractAllCount" , width: "20%",
                render: function(data, type, row) {
                    data = data+'<p>(요약: '+row.abstractCount+'건 / 미요약: '+row.notAbstractCount+'건)';
                    return data;
                }
            },
            { title: "<span class=\"ellipsis\">뉴스</span>" ,
                data: "newsTodayFilter" ,
                width: "5%" ,
                render: function(data, type, row) {
                    data = data+' ('+row.newsToday+')';
                    return data;
                }
            },
            { title: "<span class=\"ellipsis\">고객사</span>" ,
                data: "customerTodayFilter" ,
                width: "5%" ,
                render: function(data, type, row) {
                    data = data+' ('+row.customerToday+')';
                    return data;
                }
            },
            { title: "<span class=\"ellipsis\">경쟁사</span>" ,
                data: "competitorTodayFilter" ,
                width: "5%" ,
                render: function(data, type, row) {
                    data = data+' ('+row.competitorToday+')';
                    return data;
                }
            },
            { title: "<span class=\"ellipsis\">입찰정보</span>" ,
                data: "biddingTodayFilter" ,
                width: "5%" ,
                render: function(data, type, row) {
                    data = data+' ('+row.biddingToday+')';
                    return data;
                }
            }
        ]
    });
}
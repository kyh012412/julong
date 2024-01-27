var memberId= getUserId();
document.getElementById('textContent').addEventListener('keydown',function(event){
    if(event.keyCode ==13){
        event.preventDefault();
        document.getElementById('chatSend').click();
    }
});

$("#chatSend").click(function(){
    //사용자 채팅 추가
    var div = document.getElementById('chatDiv');
    var content = document.getElementById('textContent').value;
    div.innerHTML +='<div class="human" id="humanDiv"><p>'+content+'</p></div>';

    //채팅후에 사용자 화면 입력화면 clear
    document.getElementById('textContent').value='';

    //스크롤 맨아래로
    $('#chatDiv').scrollTop(1000000);

    $.ajax({
        url: '/gpt/chatting', // 요청 할 주소
        async: true, // false 일 경우 동기 요청으로 변경
        type: 'POST', // GET, PUT
        data: {
            category: document.getElementById("selectId").options[selectId.selectedIndex].value,
            text: content,
            userid: memberId
        }, // 전송할 데이터
        dataType: 'text', // xml, json, script, html
        beforeSend: function(jqXHR) {
            $("#textContent").attr("disabled", true);
            div.innerHTML +='<div class="ai" id="divTest"><div class="label">AI</div><p>...(검색 중)...</p></div>';
            $('#chatDiv').scrollTop(1000000);
        }, // 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
        success: function(jqXHR) {
            var response =decodeUnicode(jqXHR);
            div.innerHTML +='<div class="ai" id="diDiv"><div class="label">AI</div><p>'+response+'</p></div>';
            //$('#progressAdmin').hide();
        }, // 요청 완료 시
        error: function(jqXHR) {}, // 요청 실패.
        complete: function(jqXHR) {
            //스크롤 맨아래로
            document.getElementById("divTest").remove();
            $('#chatDiv').scrollTop(1000000);
            $("#textContent").attr("disabled", false);
        } // 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
    });




});
/*카테고리 변경시 기존 화면 초기화
$('#selectId').change(function(){
    var div = document.getElementById('chatDiv');
    div.innerHTML='';
});
*/

function decodeUnicode(unicodeString) {
    var r = /\\u([\d\w]{4})/gi;
    unicodeString = unicodeString.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16)); } );
    return unescape(unicodeString);
}

// 날짜 비교
// 검색종료일자는  검색시작일자보다  크거나 같아야합니다.
function from_to_ymd(ymd1, ymd2, rangeType1, rangeType){

    if(rangeType1==1 ||rangeType==1){

        var d1 = $("#"+ymd1).val().replace(/\-/gi,"");
        var d2 = $("#"+ymd2).val().replace(/\-/gi,"");
        if(Number(d1) > Number(d2)){
            $("#"+ymd1).focus();
            alert(TEXT_MSG_MSG_4);
            $("#"+ymd1).val(moment().add(-1, "d").format('YYYY-MM-DD'));
            $("#"+ymd2).val(moment().add(-1, "d").format('YYYY-MM-DD'));
            return false;
        }
    }
	return true;
}

function from_to_blank(ymd1, ymd2, rangeType1, rangeType){

	if(rangeType1==1 ||rangeType==1){
        var d1 = $("#"+ymd1).val().replace(/\-/gi,"");
        var d2 = $("#"+ymd2).val().replace(/\-/gi,"");
        if(d1==''|| d2==''){
            alert(TEXT_MSG_MSG_4);
			if(d1=='')
				$('#'+ymd1).val(getYMD_pre(1));
			if(d2=='')
				$('#'+ymd2).val(getYMD());

            return false;
        }
	}

	return true;
}

function from_to_ymd_30(ymd1, ymd2){
	var d1 = $("#"+ymd1).val().replace(/\-/gi,"");
	var d2 = $("#"+ymd2).val().replace(/\-/gi,"");
	if(Number(d1) > Number(d2)){
		$("#"+ymd1).focus();
		alert(TEXT_MSG_MSG_2);
        $("#"+ymd1).val(moment().add(-1, "d").format('YYYY-MM-DD'));
        $("#"+ymd2).val(moment().add(0, "d").format('YYYY-MM-DD'));
		return false;
	}
    if(moment(d2).diff(moment(d1),"days")>30  ){
        $("#"+ymd1).focus();
        alert(TEXT_MSG_MSG_3);

        $("#"+ymd1).val(moment().add(-1, "d").format('YYYY-MM-DD'));
        $("#"+ymd2).val(moment().add(0, "d").format('YYYY-MM-DD'));
        return false;
    }

	return true;
}

function from_to_ymd_sel(ymd1, ymd2){
	var d1 = $("#"+ymd1).val().replace(/\-/gi,"");
	var d2 = $("#"+ymd2).val().replace(/\-/gi,"");
	if(Number(d1) > Number(d2)){
		$("#"+ymd1).focus();
		alert(TEXT_MSG_MSG_2);
        $("#"+ymd1).val(moment().add(-1, "d").format('YYYY-MM-DD'));
        $("#"+ymd2).val(moment().add(-1, "d").format('YYYY-MM-DD'));
		return false;
	}

	return true;
}

function from_to_ymd_sel1(ymd1, ymd2){
	var d1 = $("#"+ymd1).val().replace(/\-/gi,"");
	var d2 = $("#"+ymd2).val().replace(/\-/gi,"");
	if(Number(d1) > Number(d2)){
		$("#"+ymd1).focus();
		alert(TEXT_MSG_MSG_2);
        $("#"+ymd1).val(moment().add(0, "d").format('YYYY-MM-DD'));
        $("#"+ymd2).val(moment().add(0, "d").format('YYYY-MM-DD'));
		return false;
	}

	return true;
}

function from_to_ymd_sel2(ymd1, ymd2){
	var d1 = $("#"+ymd1).val().replace(/\-/gi,"");
	var d2 = $("#"+ymd2).val().replace(/\-/gi,"");
	if(Number(d1) > Number(d2)){
		$("#"+ymd1).focus();
		alert(TEXT_MSG_MSG_2);
        $("#"+ymd1).val('');
        $("#"+ymd2).val('');
		return false;
	}

	return true;
}

function ymd_numberchk(num){

}

//어제 날짜
function ymd_preDay(ymd1){
	var tz01 = moment();
	//어제 날짜
	var ym = tz01.add(-1, "d").format('YYYY-MM-DD');
	$("#"+ymd1).val(ym);
}

function ymd_preDaySel(ymd1, d){
	var tz01 = moment();
	//어제 날짜
	var ym = tz01.add(d, "d").format('YYYY-MM-DD');
	$("#"+ymd1).val(ym);
}

//딱 한달전
function ymd_preOnemon(ymd1){
	var tz01 = moment();
	ym = tz01.add(-1, "months");
	ym = moment(ym);
	// 딱 한달전
	//ym = ym.add(1, "d").format('YYYY-MM-DD');
	ym = ym.format('YYYY-MM-DD');
	$("#"+ymd1).val(ym);
}

function inputYMDNumber1(obj) {
	// @see DELETE 키버튼이 눌리지 않은 경우에만 실행
	if(event.keyCode != 8) {
		// @see 숫자와 하이픈(-)기호의 값만 존재하는 경우 실행
		if(obj.value.replace(/[0-9 \-]/g, "").length == 0) {
			// @see 하이픈(-)기호를 제거한다.
			let number = obj.value.replace(/[^0-9]/g,"");

			if(number.length!=8  ){
				alert(TEXT_MSG_MSG_4);

				obj.value = moment().format('YYYY-MM-DD');
				return false;
			}else{
				let ymd = "";
				// @see 문자열의 길이에 따라 Year, Month, Day 앞에 하이픈(-)기호를 삽입한다.
				if(number.length < 4) {
					return number;
				} else if(number.length < 6){
					ymd += number.substr(0, 4);
					ymd += "-";
					ymd += number.substr(4);
				} else {
					ymd += number.substr(0, 4);
					ymd += "-";
					ymd += number.substr(4, 2);
					ymd += "-";
					ymd += number.substr(6);
				}
// @see 입력 가능 날짜 제한 기능 - 선택
// if(ymd.length == 10) {
//
//     const birthDay = new Date(number.substr(0,4)+"/"+number.substr(4,2)+"/"+number.substr(6)+" 00:00:00");
//     const limitDay = new Date("2000/10/04 23:59:59");
//
//     if(birthDay > limitDay) {
//         alert("2000년 10월 04일 이후의 날짜는\n선택할 수 없습니다.");
//         obj.value = "";
//         obj.focus();
//         return false;
//     }
// }
				obj.value = ymd;

				var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/;
				var vValue_Num = obj.value.replace(/[^0-9]/g,"");

				var dtArray = vValue_Num.match(rxDatePattern);

				dtYear = dtArray[1];
				dtMonth = dtArray[2];
				dtDay = dtArray[3];
			//yyyymmdd 체크
				if (dtMonth < 1 || dtMonth > 12) {
						alert(TEXT_MSG_MSG_4);
						obj.value ='';
						return false;
				}else if (dtDay < 1 || dtDay > 31) {
						alert(TEXT_MSG_MSG_4);
						obj.value ='';
						return false;
				}


			}


		} else {
			alert("숫자 이외의 값은 입력하실 수 없습니다.");
			//@see 숫자와 하이픈(-)기호 이외의 모든 값은 삭제한다.
			obj.value = obj.value.replace(/[^0-9 ^\-]/g,"");
			return false;
		}
	} else {

	}
}



function inputYMDNumber1_pre(obj) {
	// @see DELETE 키버튼이 눌리지 않은 경우에만 실행
	if(event.keyCode != 8) {
		// @see 숫자와 하이픈(-)기호의 값만 존재하는 경우 실행
		if(obj.value.replace(/[0-9 \-]/g, "").length == 0) {
			// @see 하이픈(-)기호를 제거한다.
			let number = obj.value.replace(/[^0-9]/g,"");

			if(number.length!=8  ){
				alert(TEXT_MSG_MSG_4);

				obj.value = moment().add(-1, "d").format('YYYY-MM-DD');
				return false;
			}else{
				let ymd = "";
				// @see 문자열의 길이에 따라 Year, Month, Day 앞에 하이픈(-)기호를 삽입한다.
				if(number.length < 4) {
					return number;
				} else if(number.length < 6){
					ymd += number.substr(0, 4);
					ymd += "-";
					ymd += number.substr(4);
				} else {
					ymd += number.substr(0, 4);
					ymd += "-";
					ymd += number.substr(4, 2);
					ymd += "-";
					ymd += number.substr(6);
				}
// @see 입력 가능 날짜 제한 기능 - 선택
// if(ymd.length == 10) {
//
//     const birthDay = new Date(number.substr(0,4)+"/"+number.substr(4,2)+"/"+number.substr(6)+" 00:00:00");
//     const limitDay = new Date("2000/10/04 23:59:59");
//
//     if(birthDay > limitDay) {
//         alert("2000년 10월 04일 이후의 날짜는\n선택할 수 없습니다.");
//         obj.value = "";
//         obj.focus();
//         return false;
//     }
// }
				obj.value = ymd;

				var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/;
				var vValue_Num = obj.value.replace(/[^0-9]/g,"");

				var dtArray = vValue_Num.match(rxDatePattern);

				dtYear = dtArray[1];
				dtMonth = dtArray[2];
				dtDay = dtArray[3];
			//yyyymmdd 체크
				if (dtMonth < 1 || dtMonth > 12) {
						alert(TEXT_MSG_MSG_4);
						obj.value = moment().add(-1, "d").format('YYYY-MM-DD');
						return false;
				}else if (dtDay < 1 || dtDay > 31) {
						alert(TEXT_MSG_MSG_4);
						obj.value = moment().add(-1, "d").format('YYYY-MM-DD');
						return false;
				}


			}


		} else {
			alert("숫자 이외의 값은 입력하실 수 없습니다.");
			//@see 숫자와 하이픈(-)기호 이외의 모든 값은 삭제한다.
			obj.value = obj.value.replace(/[^0-9 ^\-]/g,"");
			return false;
		}
	} else {

	}
}

function inputYMDNumber2_pre(obj) {
	// @see DELETE 키버튼이 눌리지 않은 경우에만 실행
	if(event.keyCode != 8) {
		// @see 숫자와 하이픈(-)기호의 값만 존재하는 경우 실행
		if(obj.value.replace(/[0-9 \-]/g, "").length == 0) {
			// @see 하이픈(-)기호를 제거한다.
			let number = obj.value.replace(/[^0-9]/g,"");

			if(number.length==0 ){
				return true;
			}

			if(number.length!=8  ){
				alert(TEXT_MSG_MSG_4);

				obj.value = '';
				return false;
			}else{
				let ymd = "";
				// @see 문자열의 길이에 따라 Year, Month, Day 앞에 하이픈(-)기호를 삽입한다.
				if(number.length < 4) {
					return number;
				} else if(number.length < 6){
					ymd += number.substr(0, 4);
					ymd += "-";
					ymd += number.substr(4);
				} else {
					ymd += number.substr(0, 4);
					ymd += "-";
					ymd += number.substr(4, 2);
					ymd += "-";
					ymd += number.substr(6);
				}
// @see 입력 가능 날짜 제한 기능 - 선택
// if(ymd.length == 10) {
//
//     const birthDay = new Date(number.substr(0,4)+"/"+number.substr(4,2)+"/"+number.substr(6)+" 00:00:00");
//     const limitDay = new Date("2000/10/04 23:59:59");
//
//     if(birthDay > limitDay) {
//         alert("2000년 10월 04일 이후의 날짜는\n선택할 수 없습니다.");
//         obj.value = "";
//         obj.focus();
//         return false;
//     }
// }
				obj.value = ymd;

				var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/;
				var vValue_Num = obj.value.replace(/[^0-9]/g,"");

				var dtArray = vValue_Num.match(rxDatePattern);

				dtYear = dtArray[1];
				dtMonth = dtArray[2];
				dtDay = dtArray[3];
			//yyyymmdd 체크
				if (dtMonth < 1 || dtMonth > 12) {
						alert(TEXT_MSG_MSG_4);
						obj.value = '';
						return false;
				}else if (dtDay < 1 || dtDay > 31) {
						alert(TEXT_MSG_MSG_4);
						obj.value = '';
						return false;
				}


			}


		} else {
			alert("숫자 이외의 값은 입력하실 수 없습니다.");
			//@see 숫자와 하이픈(-)기호 이외의 모든 값은 삭제한다.
			obj.value = obj.value.replace(/[^0-9 ^\-]/g,"");
			return false;
		}
	} else {

	}
}


function getYMD_pre(m){
	var dd = timezone_ymdhms().add(-m, "days");
	dd = moment(dd);
	return dd.format('YYYY-MM-DD');
}

//member table 의 timezone 값 참조
function now_timezone_ym(ymd){
/*	var tz = $("#myinfo_tzSelectT").val();

	var tz01 = moment();
	var tz02 = tz01.format('YYYY-MM-DD hh:mm:ss');
	var ymd = moment(tz02).tz(tz);
*/
	return ymd.format('YYYY-MM');
}
function now_timezone_ymd(ymd){
/*	var tz = $("#myinfo_tzSelectT").val();

	var tz01 = moment();
	var tz02 = tz01.format('YYYY-MM-DD hh:mm:ss');
	var ymd = moment(tz02).tz(tz);
*/
	return ymd.format('YYYY-MM-DD');
}
function now_timezone_ymd_b(ymd){
/*	var tz = $("#myinfo_tzSelectT").val();

	var tz01 = moment();
	var tz02 = tz01.format('YYYY-MM-DD hh:mm:ss');
	var ymd = moment(tz02).tz(tz);
*/
	return ymd.format('YYYY-MM-DD');
}
function now_timezone_ymdhms(ymd){
/*	var tz = $("#myinfo_tzSelectT").val();

	var tz01 = moment();
	var tz02 = tz01.format('YYYY-MM-DD hh:mm:ss');
	var ymdhms = moment(tz02).tz(tz);
*/
	return ymd.format('YYYY-MM-DD HH:mm:ss');
}
function timezone_ymdhms(){
	var tz = $("#myinfo_tzSelectT").val();
 	var tz01 = moment();
	var tz02 = tz01.format('YYYY-MM-DD HH:mm:ss');
	var ymdhms = moment(tz02).tz(tz);
//moment().add(1, "m").format();
//moment().add(-1, "months").format('YYYY-MM-DD HH:mm:ss');
//var atz01 = moment();
//var atz02 = atz01.format('YYYY-MM-DD HH:mm:ss');
//var aymdhms = moment().tz('Asia/Seoul');
//var atz02 = aymdhms.format('YYYY-MM-DD HH:mm:ss');

	return ymdhms;
}
//분기 계산
function now_timezone_per(ymd){
	var per = timezone_ymdhms().format("M");
	var per1 = Math.ceil(per / 3);
	if(per1 == 1)
		return 0;
	else if(per1 == 2)
		return 3;
	else if(per1 == 3)
		return 6;
	else if(per1 == 4)
		return 9;
}

function pre_timezone_ymd(d){
	return timezone_ymdhms().add(d, "d").format('YYYY-MM-DD HH:mm:ss');
}

function getYM(){
	return now_timezone_ym(timezone_ymdhms());
}
function getYMD(){
	return now_timezone_ymd_b(timezone_ymdhms());
}
function getYM_pre(m){
	var dd = timezone_ymdhms().add(-m, "months");
	dd = moment(dd);
	return dd.format('YYYY-MM');
}
function getYear_pre(y){
	var dd = timezone_ymdhms().subtract(y,'year')
	dd = moment(dd);
	return dd.format('YYYY');
}

function getYM_pre1(m, ymd){
	var dd = ymd.add(-m, "months");
	dd = moment(dd);
	return dd.format('YYYY-MM-DD');
}

function getLastDay(m){
	var t = m;
	var regex = /[^0-9]/g;				// 숫자가 아닌 문자열을 선택하는 정규식
	var result = t.replace(regex, "");
	if(result.length == 6){
		var date = new Date(result.substr(0, 4), result.substr(4, 2), 0);
		return date.getDate();
	}
	return "01";
}

function ymd_reset(ymd){
	if(ymd.length == 8){
		return ymd.substr(0, 4) + "-" + ymd.substr(4, 2) + "-" + ymd.substr(6, 2);
	}
	return "";
}
/*
let chk9 = false;
function processChunk() {
	//var chk1 = false;
if(chk9 == false){
let aaa = 5000;
let Arraykkk = new Array(aaa);
for(var kkk=0;kkk<aaa;kkk++){
	Arraykkk[kkk] = kkk+" aaaa";
}
chk9 = select_reset("cpSelect", Arraykkk);
	setImmediate(processChunk);
}
}
*/
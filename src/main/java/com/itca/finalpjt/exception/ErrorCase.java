package com.itca.finalpjt.exception;

public enum ErrorCase {

    CRAWLING_KEY_NOT_FOUND(404, "a001", "해당 수집키를 찾을 수 없습니다."),
    CRAWLING_DETAIL_NOT_FOUND(404, "a001", "등록된 xpath가 없습니다."),
    REQUEST_FAIL(400, "a002", "해당 요청처리를 실패했습니다."),
    DATA_MATCH_FAIL(400, "a003", "잘못된 정보를 입력하셨습니다."),
    SCHEDULE_CONTROL_FAIL(410, "a004", "해당 스케쥴을 변경할 수 없습니다."),
    FAIL_UPDATE_STATUS(400, "a005", "상태를 저장하는 도중 오류가 발생했습니다."),
    INVALID_PARAMETER(400, null, "잘못된 정보 또는 형식이 포함되어있습니다."),
    URL_INVALID(400, "c001", "정확한 URL 형식을 입력해주세요."),
    URL_DUPLICATED(204, "c001", "이미 수집요청된 URL 입니다."),
    FILE_UPLOAD_FAIL(400, "p001", "파일 업로드를 실패했습니다."),

    EXIST_HOSTNAME(200, "INSERT_001", "이미 존재하는 수집그룹명입니다."),

    REQUEST_INSERT_FAIL(400, "INSERT_001", "해당 요청의 등록을 실패했습니다."),
    REQUEST_UPDATE_FAIL(400, "UPDATE_001", "해당 요청의 수정을 실패했습니다."),
    EXCEL_FILE_NOT_OUTPUT(400, "", "정"),
    ENCRYPT_FAIL(400, "", "암호화에 실패했습니다.");


    private int status;
    private final String code;
    private final String message;

    public int getStatus(){
        return status;
    }
    public String getCode() {
        return code;
    }
    public String getMessage() {
        return message;
    }

    ErrorCase(final int status, final String code, final String message) {
        this.status = status;
        this.message = message;
        this.code = code;
    }

}

package com.itca.finalpjt.common.exception;

import lombok.Getter;

public enum ErrorCode {
    NOT_NULL("ERROR_CODE_0001","필수항목이 누락되었습니다")
    , LENGTH_MAX("ERROR_CODE_0002", "최대 입력가능한 길이보다 깁니다.")
    , MIN_VALUE("ERROR_CODE_0003", "최소값보다 커야 합니다.");

    @Getter
    private String code;

    @Getter
    private String errorDesc;

    ErrorCode(String code, String errorDesc) {
        this.code = code;
        this.errorDesc = errorDesc;
    }
}

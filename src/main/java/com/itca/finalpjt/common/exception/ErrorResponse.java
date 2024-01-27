package com.itca.finalpjt.common.exception;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class ErrorResponse {

    private String code;
    private String errorDesc;
    private String message;

    public ErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public ErrorResponse(String code, String errorDesc, String message) {
        this.code = code;
        this.errorDesc = errorDesc;
        this.message = message;
    }
}
package com.itca.finalpjt.domain.commoncode.exception;

public class CommonCodeNotFoundException extends RuntimeException {
    public CommonCodeNotFoundException(String msg, Throwable t) {
        super(msg, t);
    }

    public CommonCodeNotFoundException(String msg) {
        super(msg);
    }

    public CommonCodeNotFoundException() {
        super();
    }
}

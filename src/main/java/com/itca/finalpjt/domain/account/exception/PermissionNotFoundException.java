package com.itca.finalpjt.domain.account.exception;

public class PermissionNotFoundException extends RuntimeException {
    public PermissionNotFoundException(String msg, Throwable t) {
        super(msg, t);
    }

    public PermissionNotFoundException(String msg) {
        super(msg);
    }

    public PermissionNotFoundException() {
        super();
    }
}

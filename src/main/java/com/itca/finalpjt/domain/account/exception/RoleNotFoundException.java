package com.itca.finalpjt.domain.account.exception;

public class RoleNotFoundException extends RuntimeException{
    public RoleNotFoundException(String msg, Throwable t) {
        super(msg, t);
    }

    public RoleNotFoundException(String msg) {
        super(msg);
    }

    public RoleNotFoundException() {
        super();
    }
}

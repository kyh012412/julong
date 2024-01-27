package com.itca.finalpjt.domain.account.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(String msg, Throwable t) {
        super(msg, t);
    }

    public UserNotFoundException(String msg) {
        super(msg);
    }

    public UserNotFoundException() {
        super();
    }
}

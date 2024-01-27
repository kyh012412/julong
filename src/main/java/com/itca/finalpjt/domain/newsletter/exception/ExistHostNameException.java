package com.itca.finalpjt.domain.newsletter.exception;


import com.itca.finalpjt.exception.AdminException;
import com.itca.finalpjt.exception.ErrorCase;

public class ExistHostNameException extends AdminException {
    public ExistHostNameException() {
        super(ErrorCase.EXIST_HOSTNAME);
    }
}
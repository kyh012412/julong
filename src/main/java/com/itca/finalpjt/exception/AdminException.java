package com.itca.finalpjt.exception;

public class AdminException extends RuntimeException{
    private static final long serialVersionUID = 1L;

    private ErrorCase errorCase;

    public AdminException(ErrorCase errorCase) {
        super(errorCase.getMessage());
        this.errorCase = errorCase;
    }

    public ErrorCase getErrorCode() {
        return errorCase;
    }
}

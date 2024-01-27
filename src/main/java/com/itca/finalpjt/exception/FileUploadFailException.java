package com.itca.finalpjt.exception;


public class FileUploadFailException extends AdminException {
    public FileUploadFailException() {
        super(ErrorCase.FILE_UPLOAD_FAIL);
    }
}
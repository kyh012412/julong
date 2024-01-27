package com.itca.finalpjt.common.crypto;

public enum EncryptKey {
    XTRM_SALES("123xtrm-sales456");

    private final String code;

    EncryptKey(String code) {
        this.code = code;
    }

    public String code() {
        return code;
    }
}

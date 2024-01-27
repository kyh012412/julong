package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeSso {
    NONE("SITE", "없음(자체로그인)"),
    SSO("test", "company");

    private final String code;
    private final String codeName;

    CodeSso(String code, String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public String code() { return code; }
    public String codeName() { return codeName; }
}

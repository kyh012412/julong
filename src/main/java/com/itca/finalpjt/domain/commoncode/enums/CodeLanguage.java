package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeLanguage {
    EN("EN", "영어"),
    KO("KO", "한국어");

    private final String code;
    private final String codeName;

    CodeLanguage(String code, String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public String code() { return code; }
    public String codeName() { return codeName; }
}

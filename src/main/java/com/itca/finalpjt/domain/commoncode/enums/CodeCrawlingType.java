package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeCrawlingType {
    GENERAL("GENERAL", "일반타입 수집"),
    API("API", "API/RSS타입 수집"),
    LIST("LIST", "리스트타입 수집"),
    PEOPLE("PEOPLE", "인명정보 수집");

    private final String code;
    private final String codeName;

    CodeCrawlingType(String code, String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public String code() {
        return code;
    }
    public String codeName() { return codeName; }
}
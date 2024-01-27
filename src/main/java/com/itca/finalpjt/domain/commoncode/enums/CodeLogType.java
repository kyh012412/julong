package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeLogType {
    SUCCESS("SUCCESS", "성공"),
    DISCARD("DISCARD", "폐기"),
    ERROR("ERROR", "실패"),
    BLANK_DATA("BLANK_DATA", "데이터없음");

    private final String code;
    private final String codeName;

    CodeLogType(String code, String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public String code() {
        return code;
    }
    public String codeName() { return codeName; }
}

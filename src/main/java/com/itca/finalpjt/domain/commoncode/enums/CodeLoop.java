package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeLoop {
    MINUTE("MINUTE", "분"),
    HOUR("HOUR", "시간"),
    DAY("DAY", "일"),
    WEEK("WEEK", "요일"),
    MONTH("MONTH", "월");

    private final String code;
    private final String codeName;

    CodeLoop(String code, String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public String code() {
        return code;
    }
    public String codeName() {
        return codeName;
    }
}

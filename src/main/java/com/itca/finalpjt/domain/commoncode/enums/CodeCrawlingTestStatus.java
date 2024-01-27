package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeCrawlingTestStatus {
    WAIT("WAIT", "대기"),
    RUN("RUN", "수행"),
    SUCCESS("SUCCESS", "성공"),
    FAIL("FAIL", "실패");

    private final String code;
    private final String codeName;

    CodeCrawlingTestStatus(String code, String codeName) {
        this.code = code;
        this.codeName = codeName;
    }
    public String code() {
        return code;
    }
    public String codeName() { return codeName; }
}

package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeCrawlingStatus {
    STOP("STOP", "정지"),
    WAIT("WAIT", "대기"),
    RUN("RUN", "수행"),
    COMPLETE("COMPLETE", "완료"),
     FAIL("FAIL", "장애발생"),
    SKIP("SKIP", "건너뜀");

    private final String code;
    private final String codeName;

    CodeCrawlingStatus(String code, String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public String code() {
        return code;
    }
    public String codeName() { return codeName; }
}

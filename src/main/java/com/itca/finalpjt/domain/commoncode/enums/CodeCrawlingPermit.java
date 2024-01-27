package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeCrawlingPermit {
    REQUEST("REQUEST", "승인요청"),
    WAIT("WAIT", "승인대기"),
    APPROVED("APPROVED", "승인"),
    REJECT("REJECT", "반려");

    private final String code;
    private final String codeName;

    CodeCrawlingPermit(String code, String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public String code() {
        return code;
    }
    public String codeName() { return codeName; }

}

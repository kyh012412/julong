package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeMemberType {
    SYSTEM_ADM("SUPER_ADM", "시스템관리자"),
    SUPER_ADM("SUPER_ADM", "슈퍼관리자"),
    USER("USER", "사용자"),
    NEWBIE("NEWBIE", "신규가입");

    private final String code;
    private final String codeName;

    CodeMemberType(String code, String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public String code() {
        return code;
    }
    public String codeName() { return codeName; }
}

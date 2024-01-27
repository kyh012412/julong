package com.itca.finalpjt.domain.commoncode.enums;

public enum CommonCodeType {
    // 회원
    SSO("X001"),
    MEMBER_TYPE("X008"),
    MEMBER_AUTH("X014"),

    TIMEZONE("X035"),
    KEYWORD("V008"),
    MENUL("X032"),

    // 수집
    ALERT("X002"),
    CRAWLING_TYPE("X003"),
    CATEGORY("X004"),
    CRAWLING_STATUS("X005"),
    CRAWLING_PERMIT("X006"),
    LOOP("X007"),
    WEEK_LOOP_NO("X015"),
    CONTINENT("X016"),
    CONTINENT_DETAIL("X017"),
    LANGUAGE("X018"),
    NATION("X020"),
    ANALYSIS_TYPE("X024"),
    HOST_TYPE("X025"),
    ETL("X026"),
    ETL_RESULT("X027"),
    ETL_LOG_TYPE("X031"),
    TEST_STATUS("X029"),
    LIST_TYPE("X030"),

    // 서버
    SERVER_ZONE("X010"),
    SERVER_TYPE("X011"),
    SERVER_STATUS("X012"),
    SERVER_ENV("X013"),

    // 메뉴
    MENU_1DEPTH("X021"),
    MENU_2DEPTH("X022"),
    MENU_3DEPTH("X023"),

    // PU구분
    PU_SELECT("X034");

    private final String codeNo;

    CommonCodeType(String codeNo) {
        this.codeNo = codeNo;
    }

    public String codeNo() {
        return codeNo;
    }
}

package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeCategory {
    NEWS("NEWS", "뉴스"),
    CUSTOMER("CUSTOMER", "고객사"),
    COMPETITOR("COMPETITOR", "경쟁사"),
    KEYWORD("KEYWORD", "키워드수집자료"),
    BIDDING("BIDDING", "입찰정보"),
    MYCOMPANY("MYCOMPANY", "나의회사"),
    PEOPLE("PEOPLE", "인물");

    private final String code;
    private final String codeName;

    CodeCategory(String code, String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public String code() {
        return code;
    }
    public String codeName() { return codeName; }

}

package com.itca.finalpjt.domain.commoncode.enums;

public enum CodeWeekLoop {
    SUN("SUN", "일", "1"),
    MON("MON", "월", "2"),
    TUE("TUE", "화", "3"),
    WEN("WEN", "수", "4"),
    THU("THU", "목", "5"),
    FRI("FRI", "금", "6"),
    SAT("SAT", "토", "7");

    private final String code;
    private final String codeName;
    private final String refTxt01;

    CodeWeekLoop(String code, String codeName, String refTxt01) {
        this.code = code;
        this.codeName = codeName;
        this.refTxt01 = refTxt01;
    }

    public String code() {
        return code;
    }
    public String codeName() {
        return codeName;
    }
    public String refNum01() { return refTxt01; }
}

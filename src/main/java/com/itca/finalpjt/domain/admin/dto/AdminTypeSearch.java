package com.itca.finalpjt.domain.admin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminTypeSearch {

    private String udSelect;
    private String adminSearch;
    private String roleTypeChk;
    private String userId;
    private String teamSelect;
    private String surveyId;
    private String nowday;
    private String lastday;

    private String companychk;
    private String puchk;
    private String teamchk;

    private int memberkey;
    private int firstDelete;

    private String puOnchange;
    private String teamOnchange;

    private String codeLang; //코드 추가;

    private String lockyn;
    private String useyn;
    private String fromdt;
    private String todt;

}

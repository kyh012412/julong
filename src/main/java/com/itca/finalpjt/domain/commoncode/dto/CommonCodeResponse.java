package com.itca.finalpjt.domain.commoncode.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@NoArgsConstructor
public class CommonCodeResponse implements Serializable {
    private String codeNo;
    private String code;
    private String codeName;

    private String refTxt01;
    private String refTxt02;
    private String refTxt03;
    private String refTxt04;
    private String refTxt05;
    private String refTxt06;
    private String refTxt07;
    private String refTxt08;
    private String refTxt09;
    private String refTxt10;

    private int refNum01;
    private int refNum02;
    private int refNum03;
    private int refNum04;
    private int refNum05;

    private String localeCodeName;

    public void convertLocaleCodeName(String localeCodeName){
        this.localeCodeName = localeCodeName;
    }
}

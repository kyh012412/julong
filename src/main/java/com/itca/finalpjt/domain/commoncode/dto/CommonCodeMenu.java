package com.itca.finalpjt.domain.commoncode.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@NoArgsConstructor
public class CommonCodeMenu implements Serializable {
    private static final long serialVersionUID = -178251896371237281L;

    private String parentsMenuCode;
    private String menuCode;
    private String menuName;
    private String localeMenuName;
    private String url;

    public void convertLocaleMenuName(String localeMenuName){
        this.localeMenuName = localeMenuName;
    }
}

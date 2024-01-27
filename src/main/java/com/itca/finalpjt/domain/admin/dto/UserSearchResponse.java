package com.itca.finalpjt.domain.admin.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class UserSearchResponse {

    private int memberKey;
    private String memberId;
    private String memberName;
    private String companyKrName;
    private String PuKrName;
    private String divisionKrName;
    private String position;
    private String memberinquiryright;
    private String memberpuinquiryright;
    private List memberId_arr;

    @Builder
    public UserSearchResponse(int memberKey, String memberId, String memberName, String companyKrName, String PuKrName,
                              String divisionKrName, String position, String memberinquiryright, String memberpuinquiryright) {
        this.memberKey = memberKey;
        this.memberId = memberId;
        this.memberName = memberName;
        this.companyKrName = companyKrName;
        this.PuKrName = PuKrName;
        this.divisionKrName = divisionKrName;
        this.position = position;
        this.memberinquiryright = memberinquiryright;
        this.memberpuinquiryright = memberpuinquiryright;
    }

}

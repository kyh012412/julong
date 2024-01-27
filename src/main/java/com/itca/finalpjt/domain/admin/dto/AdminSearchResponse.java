package com.itca.finalpjt.domain.admin.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminSearchResponse {

    private int memberKey;
    private String memberName;
    private String memberId;
    private String codeMemberType;
    private String position;
    private String divisionKrName;
    private String email;
    private String memberinquiryright;
    private String memberpuinquiryright;
    private boolean useYn;
    private boolean lockYn;
    private String memberinquiryright_v;
    private String memberpuinquiryright_v;

    @Builder
    public AdminSearchResponse(int memberKey, String memberName, String memberId, String position, String divisionKrName,
                               String email, String memberinquiryright, String memberpuinquiryright, String codeMemberType, boolean useYn, boolean lockYn) {

        this.memberKey = memberKey;
        this.memberName = memberName;
        this.memberId = memberId;
        this.position = position;
        this.divisionKrName = divisionKrName;
        this.email = email;
        this.memberinquiryright = memberinquiryright;
        this.memberpuinquiryright = memberpuinquiryright;
        this.codeMemberType = codeMemberType;
        this.useYn = useYn;
        this.lockYn = lockYn;
    }

}
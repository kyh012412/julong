package com.itca.finalpjt.domain.admin.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserExcelupload {
    private int memberKey;
    private String memberName;
    private String employeeNo;
    private String codeMemberType;
    private String memberInquiryRight;
    private String memberPuInquiryRight;
    private String useYn;
    private String lockYn;

    private String position;

    private String teamName;

    private String aaaa;

    private boolean useYnLast;
    private boolean lockYnLast;

    private String memberId;

    @Builder
    public UserExcelupload(int memberKey, String memberName, String employeeNo, String codeMemberType
		, String memberInquiryRight, String memberPuInquiryRight , String useYn , String lockYn
		){
        this.memberKey = memberKey;
        this.memberName = memberName;
        this.employeeNo = employeeNo;
        this.codeMemberType = codeMemberType;
        this.memberInquiryRight = memberInquiryRight;
        this.memberPuInquiryRight = memberPuInquiryRight;
        this.useYn = useYn;
        this.lockYn = lockYn;
    }
}

package com.itca.finalpjt.domain.account.dto;

import com.itca.finalpjt.domain.account.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
public class MemberResponse {
    private int memberKey;
    private String memberId;
    private String codeMemberType;
    private String memberName;
    private String email;
    private String phoneNo;

    @Builder
    public MemberResponse(Member member) {
        this.memberKey = member.getMemberKey();
        this.memberId = member.getMemberId();
        this.codeMemberType = member.getCodeMemberType();
        this.memberName = member.getMemberName();
        this.email = member.getEmail();
        this.phoneNo = member.getPhoneNo();
    }
}

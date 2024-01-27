package com.itca.finalpjt.domain.account.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Getter
@NoArgsConstructor
public class MemberRequest {
    @NotBlank(message = "아이디는 필수 입력사항입니다.")
    private String memberId;
    @NotBlank(message = "비밀번호는 필수 입력사항입니다.")
    private String password;
    @NotBlank(message = "이름은 필수 입력사항입니다.")
    private String memberName;
    @NotBlank(message = "이메일은 필수 입력사항입니다.")
    private String email;
    @NotBlank(message = "휴대폰번호는 필수 입력사항입니다.")
    private String phoneNo;

}

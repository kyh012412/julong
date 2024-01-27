package com.itca.finalpjt.domain.account.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class MyInfoRequest {
    @NotNull(message = "회원정보를 다시 확인해주세요.")
    private int memberKey;
    private String employeeNo;
    private String codeMemberType;
    private String memberName;
    private String memberEnName;
    private String memberCnName;
    private String memberId;
    private String companyCode;
    private String companyKrName;
    private String companyEnName;
    private String companyCnName;
    private String resignationStatus;
    private String divisionCode;
    private String rank;
    @Length(max = 128, message = "전화번호는 최대 128자까지 입력가능합니다.")
    private String telNo;
    // @NotBlank(message = "휴대폰번호는 필수입력사항입니다.")
    @Length(max = 128, message = "휴대폰번호는 최대 128자까지 입력가능합니다.")
    private String phoneNo;
    // @NotBlank(message = "이메일은 필수입력사항입니다.")
    @Length(max = 50, message = "이메일은 최대 50자까지 입력가능합니다.")
    private String email;
    @Length(max = 50, message = "부서는 최대 50자까지 입력가능합니다.")
    private String divisionName;
    // @NotBlank(message = "언어는 필수선택사항입니다.")
    private String codeLanguage;
    private String photoPath;
    private String photoFile;
    private String timeZone;
    private String pgCode;
    private String pgKrName;
    private String pgEnName;
    private String pgCnName;
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime createDatetime = LocalDateTime.now();
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime updateDatetime = LocalDateTime.now();
    private String puCode;
    private String puKrName;
    private String puEnName;
    private String puCnName;

    private String divisionKrName;
    private String divisionEnName;
    private String divisionCnName;
    private String useYn;
    private String lockYn;

    @Length(max = 256, message = "비밀번호는 최대 256자까지 입력가능합니다.")
    private String password;
    @Length(max = 256, message = "비밀번호는 최대 256자까지 입력가능합니다.")
    private String newPassword;

    private String pukeyword01;
    private String pukeyword02;
    private String pukeyword03;
    private String pukeyword04;

    private String code;
    private String codeName;

}

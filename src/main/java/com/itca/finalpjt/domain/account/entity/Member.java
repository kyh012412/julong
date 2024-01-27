package com.itca.finalpjt.domain.account.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.itca.finalpjt.domain.admin.entity.UserdataAuth;
import jdk.jfr.Timestamp;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table
@Getter
@DynamicUpdate
@NoArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private int memberKey;
    @Column
    private String memberId;
    @Column
    private String password;
    @Column
    private String codeMemberType;
    @Column
    private String memberName;
    @Column
    private String memberEnName;
    @Column
    private String memberCnName;
    @Column
    private String email;
    @Column
    private String phoneNo;
    @Column
    private String telNo;
    @Column
    private String companyCode;
    @Column
    private String companyKrName;
    @Column
    private String companyEnName;
    @Column
    private String companyCnName;
    @Column
    private String pgCode;
    @Column
    private String pgKrName;
    @Column
    private String pgEnName;
    @Column
    private String pgCnName;
    @Column
    private String puCode;
    @Column
    private String puKrName;
    @Column
    private String puEnName;
    @Column
    private String puCnName;
    @Column
    private String divisionCode;
    @Column
    private String divisionKrName;
    @Column
    private String divisionEnName;
    @Column
    private String divisionCnName;
    @Column
    private String position;
    @Column
    private String job;
    @Column
    private String rank;
    @Column
    private String employeeNo;
    @Column
    private String resignationStatus;
    @Column
    private String createId;
    @CreationTimestamp
    @Column
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime createDatetime;
    @Column
    private String updateId;
    @UpdateTimestamp
    @Column
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime updateDatetime;
    @Column
    private String codeSso;
    @Column
    private String photoPath;
    @Column
    private String photoFile;
    @Column
    private boolean useYn;
    @Column
    private boolean lockYn;
    @Timestamp
    @Column
    private LocalDateTime lastLoginDatetime;
    @Column
    private String codeLanguage;
    @Column
    private String timeZone;

    @Timestamp
    @Column
    private LocalDateTime pwdupdatedatetime;

    @Column
    private String memberinquiryright;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "memberKey")
    private UserdataAuth userdataAuth;

    @Builder
    public Member(String memberId, String password, String codeMemberType, String memberName, String memberEnName,
            String memberCnName, String email, String phoneNo, String telNo, String companyCode, String companyKrName,
            String companyEnName, String companyCnName, String pgCode, String pgKrName, String pgEnName,
            String pgCnName, String puCode, String puKrName, String puEnName, String puCnName, String divisionCode,
            String divisionKrName, String divisionEnName, String divisionCnName, String position, String job,
            String rank, String employeeNo, String resignationStatus, String createId, String updateId, String codeSso,
            String photoPath, String photoFile, boolean useYn, boolean lockYn, String codeLanguage, String timeZone,
            UserdataAuth userdataAuth, LocalDateTime pwdupdatedatetime, String memberinquiryright) {
        this.memberId = memberId;
        this.password = password;
        this.codeMemberType = codeMemberType;
        this.memberName = memberName;
        this.memberEnName = memberEnName;
        this.memberCnName = memberCnName;
        this.email = email;
        this.phoneNo = phoneNo;
        this.telNo = telNo;
        this.companyCode = companyCode;
        this.companyKrName = companyKrName;
        this.companyEnName = companyEnName;
        this.companyCnName = companyCnName;
        this.pgCode = pgCode;
        this.pgKrName = pgKrName;
        this.pgEnName = pgEnName;
        this.pgCnName = pgCnName;
        this.puCode = puCode;
        this.puKrName = puKrName;
        this.puEnName = puEnName;
        this.puCnName = puCnName;
        this.divisionCode = divisionCode;
        this.divisionKrName = divisionKrName;
        this.divisionEnName = divisionEnName;
        this.divisionCnName = divisionCnName;
        this.position = position;
        this.job = job;
        this.rank = rank;
        this.employeeNo = employeeNo;
        this.resignationStatus = resignationStatus;
        this.createId = createId;
        this.updateId = updateId;
        this.codeSso = codeSso;
        this.photoPath = photoPath;
        this.photoFile = photoFile;
        this.useYn = useYn;
        this.lockYn = lockYn;
        this.codeLanguage = codeLanguage;
        this.timeZone = timeZone;
        this.userdataAuth = userdataAuth;
        this.pwdupdatedatetime = pwdupdatedatetime;
        this.memberinquiryright = memberinquiryright;
    }

    public void updateLastLoginDatetime(LocalDateTime lastLoginDatetime) {
        this.lastLoginDatetime = lastLoginDatetime;
    }

    public void updateCodeLanguage(String language) {
        this.codeLanguage = language;
    }
}

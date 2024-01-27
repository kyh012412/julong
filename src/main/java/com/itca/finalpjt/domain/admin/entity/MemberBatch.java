package com.itca.finalpjt.domain.admin.entity;

import jdk.jfr.Timestamp;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Setter
@Table(name="member")
@NoArgsConstructor
public class MemberBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private String memberKey;
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
    private LocalDateTime createDatetime;
    @Column
    private String updateId;
    @UpdateTimestamp
    @Column
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


    @Builder
    public MemberBatch(String memberKey,String memberId, String password, String codeMemberType
            , String memberName, String memberEnName, String memberCnName, String email, String phoneNo, String telNo
            , String companyCode, String companyKrName, String companyEnName, String companyCnName
            , String pgCode, String pgKrName, String pgEnName, String pgCnName, String puCode, String puKrName, String puEnName, String puCnName
            , String divisionCode, String divisionKrName, String divisionEnName, String divisionCnName
            , String position, String job, String rank, String employeeNo
            , String resignationStatus, String createId,LocalDateTime createDatetime ,String updateId
            , String codeSso, String photoPath, String photoFile,LocalDateTime updateDatetime
            , boolean useYn, boolean lockYn
            , String codeLanguage, String timeZone
    ) {
        this.memberKey = memberKey;
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
        this.createDatetime= createDatetime;
        this.updateId = updateId;
        this.codeSso = codeSso;
        this.photoPath = photoPath;
        this.photoFile = photoFile;
        this.useYn = useYn;
        this.lockYn = lockYn;
        this.codeLanguage = codeLanguage;
        this.updateDatetime = updateDatetime;
        this.timeZone = timeZone;
    }

    public void updateLastLoginDatetime(LocalDateTime lastLoginDatetime
    ) {
        this.lastLoginDatetime = lastLoginDatetime;
    }

    public void updateCodeLanguage(String language) {
        this.codeLanguage = language;
    }

    public void updateDatetime(LocalDateTime updateDatetime
    ) {
        this.updateDatetime = updateDatetime;
    }

}


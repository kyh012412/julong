package com.itca.finalpjt.domain.account.entity;

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
@NoArgsConstructor
@IdClass(MemberTypeAuthId.class)
@DynamicUpdate
public class MemberTypeAuth {
    @Id
    @Column
    private String codeMemberType;
    @Id
    @Column
    private String codeMemberAuth;
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

    @Builder
    public MemberTypeAuth(String codeMemberType, String codeMemberAuth, String createId, String updateId
    ) {
        this.codeMemberType = codeMemberType;
        this.codeMemberAuth = codeMemberAuth;
        this.createId = createId;
        this.updateId = updateId;
    }
}

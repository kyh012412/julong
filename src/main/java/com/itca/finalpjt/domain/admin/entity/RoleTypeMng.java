package com.itca.finalpjt.domain.admin.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name="roletypemng")
@NoArgsConstructor
public class RoleTypeMng {
	@Id
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="memberkey")
    private int memberKey;
    //@Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    //@Column(name="codemembertype")
    private String codeMemberType;

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
    public RoleTypeMng(String codeMemberType, int memberKey
            , String createId, String updateId , LocalDateTime createDatetime, LocalDateTime updateDatetime
    ) {
        this.codeMemberType = codeMemberType;
        this.memberKey = memberKey;
        this.createId = createId;
        this.updateId = updateId;
        this.createDatetime = createDatetime;
        this.updateDatetime = updateDatetime;

    }

}

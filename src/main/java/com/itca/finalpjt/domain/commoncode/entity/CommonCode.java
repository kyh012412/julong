package com.itca.finalpjt.domain.commoncode.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Table
@DynamicUpdate
@IdClass(CommonCodeId.class)
@NoArgsConstructor
public class CommonCode {
    @Id
    @Column
    private String codeNo;
    @Id
    @Column
    private String code;
    @Column
    private String codeName;
    @Column
    private String refTxt01;
    @Column
    private String refTxt02;
    @Column
    private String refTxt03;
    @Column
    private String refTxt04;
    @Column
    private String refTxt05;
    @Column
    private String refTxt06;
    @Column
    private String refTxt07;
    @Column
    private String refTxt08;
    @Column
    private String refTxt09;
    @Column
    private String refTxt10;

    @Column
    private int refNum01;
    @Column
    private int refNum02;
    @Column
    private int refNum03;
    @Column
    private int refNum04;
    @Column
    private int refNum05;

    @Column
    private short sortSeq;
    @Column
    private boolean useYn;
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
    private String remark;

}

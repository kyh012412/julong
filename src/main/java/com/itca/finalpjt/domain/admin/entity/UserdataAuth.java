package com.itca.finalpjt.domain.admin.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.itca.finalpjt.domain.account.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@DynamicUpdate
@Table(name = "userdataauth")
@NoArgsConstructor
public class UserdataAuth {

    @Id
    @Column
    private int memberKey;
    @Column
    private String memberinquiryright;
    @Column
    private String memberpuinquiryright;
    @Column
    private String createId;
    @CreationTimestamp
    @Column
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createDatetime = LocalDateTime.now();
    @Column
    private String updateId;

    @UpdateTimestamp
    @Column
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updateDatetime = LocalDateTime.now();

    @OneToOne(mappedBy = "userdataAuth")
    private Member member;

    @Builder
    public UserdataAuth(int memberKey, String memberinquiryright, String memberpuinquiryright, String createId,
            String updateId, LocalDateTime createDatetime, LocalDateTime updateDatetime) {
        this.memberKey = memberKey;
        this.memberinquiryright = memberinquiryright;
        this.memberpuinquiryright = memberpuinquiryright;
        this.createId = createId;
        this.updateId = updateId;
        this.createDatetime = createDatetime;
        this.updateDatetime = updateDatetime;
    }

    public void createDatetime(LocalDateTime createDatetime) {
        this.createDatetime = createDatetime;
    }

    public void updateDatetime(LocalDateTime updateDatetime) {
        this.updateDatetime = updateDatetime;
    }

}

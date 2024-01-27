package com.itca.finalpjt.domain.account.dto;

import jdk.jfr.Timestamp;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class UpPassword {

    private String memberId;
    private String originpw;
    private String newpw;
    private int memberkey;
    @Timestamp
    @Column
    private LocalDateTime pwdDatetime;

    @Builder
    public UpPassword(String memberId, String originpw, String newpw, int memberkey, LocalDateTime pwdDatetime) {

        this.memberId = memberId;
        this.originpw = originpw;
        this.newpw = newpw;
        this.memberkey = memberkey;
        this.pwdDatetime = pwdDatetime;
    }
}

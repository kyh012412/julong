package com.itca.finalpjt.domain.admin.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AdminAuthRequest {

    private int memberKey;
    private String memberinquiryright;
    private String memberpuinquiryright;
    private String createId;

    @UpdateTimestamp
    @Column
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createDateTime = LocalDateTime.now();

    private String updateId;

    @UpdateTimestamp
    @Column
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updateDatetime = LocalDateTime.now();

    private String codeMemberType;
    private boolean useYn;
    private boolean lockYn;


    public void createDatetime(LocalDateTime createDateTime
    ) {
        this.createDateTime = createDateTime;
    }

    public void updateDatetime(LocalDateTime updateDatetime
    ) {
        this.updateDatetime = updateDatetime;
    }

}

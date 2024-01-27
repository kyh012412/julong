package com.itca.finalpjt.domain.newsletter.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name="newsletter")
@Getter
@Setter
@DynamicUpdate
@NoArgsConstructor
public class Newsletter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private int newsletterKey;
    @Column
    private String subject;
    @Column
    private String contents;
    @Column
    private String membersid;
    @Column
    private int filegroupid;
    @Column
    private String url;
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime writedatetime;

    @Builder
    public Newsletter(String subject, String contents, String membersid, LocalDateTime writedatetime,int filegroupid
    ) {
        this.subject = subject;
        this.contents = contents;
        this.membersid = membersid;
        this.writedatetime = writedatetime;
        this.filegroupid = filegroupid;
    }
}

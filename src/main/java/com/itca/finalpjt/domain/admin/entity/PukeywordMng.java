package com.itca.finalpjt.domain.admin.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "pukeywordmng")
@NoArgsConstructor
public class PukeywordMng {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pukeywordkey;

    @Column(name = "pucode")
    private String pucode;
    @Column(name = "pukeywordcode")
    private String pukeywordcode;

    private String pukeyword;

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
    public PukeywordMng(
            int pukeywordkey, String pucode, String pukeywordcode, String pukeyword, String createId, String updateId,
            LocalDateTime createDatetime, LocalDateTime updateDatetime) {
        this.pukeywordkey = pukeywordkey;
        this.pucode = pucode;
        this.pukeywordcode = pukeywordcode;
        this.pukeyword = pukeyword;
        this.createId = createId;
        this.updateId = updateId;
        this.createDatetime = createDatetime;
        this.updateDatetime = updateDatetime;
    }

}

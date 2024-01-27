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
@Table(name = "programmng")
@NoArgsConstructor
public class ProgramMng {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "programkey")
    private int programkey;
    @Column
    private String programname;
    @Column
    private String programurl;
    @Column
    private String menulgroupcode;
    @Column
    private String menumgroupcode;
    @Column
    private int sortno;
    @Column
    private boolean useyn;
    @Column
    private boolean singlemenuyn;
    @Column
    private boolean inoutyn;

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
    public ProgramMng(int programkey, String programname, String programurl, String menulgroupcode,
            String menumgroupcode, int sortno, boolean useyn, boolean singlemenuyn, boolean inoutyn, String createId,
            String updateId) {
        this.programkey = programkey;
        this.programname = programname;
        this.programurl = programurl;
        this.menulgroupcode = menulgroupcode;
        this.menumgroupcode = menumgroupcode;
        this.sortno = sortno;
        this.useyn = useyn;
        this.singlemenuyn = singlemenuyn;
        this.inoutyn = inoutyn;

        this.createId = createId;
        this.updateId = updateId;
    }

}

package com.itca.finalpjt.domain.admin.entity;

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
@Table(name = "roletypeuserauth")
@NoArgsConstructor
@DynamicUpdate
public class RoletypeUserauth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private int roleTypeKey;

    @Column
    private String codemembertype;

    @Column
    private int programkey;

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
    public RoletypeUserauth(String codemembertype, int programkey, String createId, String updateId,
            LocalDateTime createDatetime, LocalDateTime updateDatetime) {
        this.codemembertype = codemembertype;
        this.programkey = programkey;
        this.createId = createId;
        this.updateId = updateId;
        this.createDatetime = createDatetime;
        this.updateDatetime = updateDatetime;
    }

}

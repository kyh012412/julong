package com.itca.finalpjt.domain.newsletter.entity;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;


@Entity
@Table(name="newsletterFilelist")
@Getter
@Setter
@DynamicUpdate
@NoArgsConstructor
public class NewsletterFileList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private int filelistkey;
    @Column
    private int filegroupid;
    @Column
    private String notiatchmflno;
    @Column
    private String atchmflext;
    @Column
    private String atchmflpath;
    @Column
    private String atchmnflnm;
    @Column
    private String atchmnflnmori;
    @Column
    private int temp_no;

    @Builder
    public NewsletterFileList(int filegroupid, String notiatchmflno, String atchmflext, String atchmflpath, String atchmnflnm, String atchmnflnmori, int temp_no
    ) {
        this.filegroupid = filegroupid;
        this.notiatchmflno = notiatchmflno;
        this.atchmflext = atchmflext;
        this.atchmflpath = atchmflpath;
        this.atchmnflnm = atchmnflnm;
        this.atchmnflnmori = atchmnflnmori;
        this.temp_no = temp_no;
    }
}



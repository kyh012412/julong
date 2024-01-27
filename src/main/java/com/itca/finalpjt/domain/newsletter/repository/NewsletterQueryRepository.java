package com.itca.finalpjt.domain.newsletter.repository;

import com.itca.finalpjt.domain.newsletter.entity.Newsletter;
import com.itca.finalpjt.domain.newsletter.entity.NewsletterFileList;
import com.itca.finalpjt.domain.newsletter.entity.QNewsletter;

import com.itca.finalpjt.domain.newsletter.entity.QNewsletterFileList;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class NewsletterQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;
    private final NewsletterRepository newsletterRepository;
    private final NewsletterFilelistRepository newsletterFilelistRepository;
    @PersistenceContext
    EntityManager entityManager;



    public NewsletterFileList readNewsLetterFileListMax() {

        QNewsletterFileList newsletterFileList = QNewsletterFileList.newsletterFileList;
        return jpaQueryFactory
                .select (Projections.fields(NewsletterFileList.class
                        , newsletterFileList.filegroupid.max().as("filelistkey")
                ))
                .from(newsletterFileList)
                .fetchOne();
    }


    public List<Newsletter> readNewsletterList() {

        QNewsletter newsletter = QNewsletter.newsletter;
        return jpaQueryFactory
                .select(Projections.fields(Newsletter.class
                        , newsletter.newsletterKey
                        , newsletter.membersid
                        , newsletter.subject
                        , newsletter.contents
                        , newsletter.url
                        , newsletter.writedatetime
                        , newsletter.filegroupid
                ))
                .from(newsletter)
                .orderBy(newsletter.writedatetime.desc())
                .fetch();
    }


    public List<NewsletterFileList> readFileList(int fileGroupId) {

        QNewsletterFileList list = QNewsletterFileList.newsletterFileList;
        return jpaQueryFactory
                .select(Projections.fields(NewsletterFileList.class
                        , list.filelistkey
                        , list.filegroupid
                        , list.notiatchmflno
                        , list.atchmflext
                        , list.atchmflpath
                        , list.atchmnflnm
                        , list.atchmnflnmori

                ))
                .from(list)
                .where(list.filegroupid.eq(fileGroupId))
                .orderBy(list.filegroupid.desc())
                .fetch();

    }

    @Transactional
    public boolean deleteNewsletterList(int newsletterKey,int filegroupid) {
        QNewsletter newsletter = QNewsletter.newsletter;
        QNewsletterFileList newsletterFileList = QNewsletterFileList.newsletterFileList;

        long Result = jpaQueryFactory
                .delete(newsletter)
                .where(newsletter.newsletterKey.eq(newsletterKey)
                )
                .execute();

        if(filegroupid>0){
            Result = jpaQueryFactory
                    .delete(newsletterFileList)
                    .where(newsletterFileList.filegroupid.eq(filegroupid)
                    )
                    .execute();
        }

        return Result > 0;


    }

    @Transactional
    public boolean newsletterUpdate(Newsletter request) {
        QNewsletter newsletter = QNewsletter.newsletter;
        long Result = jpaQueryFactory
                .update(newsletter)
                .set( newsletter.subject, request.getSubject().trim())
                .set( newsletter.contents, request.getContents().replace("\\",""))
                .where(newsletter.newsletterKey.eq(request.getNewsletterKey())
                )
                .execute();
        return Result > 0;
    }

    @Transactional
    public boolean newsletterUpdateWithGroupid(Newsletter request) {
        QNewsletter newsletter = QNewsletter.newsletter;
        long Result = jpaQueryFactory
                .update(newsletter)
                .set( newsletter.filegroupid, request.getFilegroupid())
                .where(newsletter.newsletterKey.eq(request.getNewsletterKey())
                )
                .execute();
        return Result > 0;
    }

    @Transactional
    public boolean newsletterDeleteWithFileGroupId(Newsletter request) {
        QNewsletter newsletter = QNewsletter.newsletter;
        long Result = jpaQueryFactory
                .update(newsletter)
                .set( newsletter.filegroupid, 0)
                .where(newsletter.newsletterKey.eq(request.getNewsletterKey())
                )
                .execute();
        return Result > 0;
    }


    @Transactional
    public Newsletter newsletterInsert(Newsletter request,String name) {
        Newsletter newsletter = Newsletter.builder()
                .subject(request.getSubject().trim())
                .contents(request.getContents().trim().replace("\\",""))
                .membersid(name.trim())
                .writedatetime(LocalDateTime.now())
                .filegroupid(request.getFilegroupid())
                .build();
        return newsletterRepository.saveAndFlush(newsletter);
}


    @Transactional
    public NewsletterFileList newsletterFileListInsert(NewsletterFileList request) {
        NewsletterFileList newsletterFileList = NewsletterFileList.builder()
                .filegroupid(request.getFilegroupid())
                //.notiatchmflno(request.getNotiatchmflno().trim())
                .atchmflext(request.getAtchmflext().trim())
                .atchmflpath(request.getAtchmflpath().trim())
                .atchmnflnm(request.getAtchmnflnm().trim())
                .atchmnflnmori(request.getAtchmnflnmori().trim())
                .build();
        return newsletterFilelistRepository.saveAndFlush(newsletterFileList);
    }

    @Transactional
    public Long newsletterFileListDelete(int key) {
        QNewsletter newsletter = QNewsletter.newsletter;
        Newsletter result= jpaQueryFactory
                .select(Projections.fields(Newsletter.class
                        , newsletter.filegroupid

                ))
                .from(newsletter)
                .where(newsletter.newsletterKey.eq(key))
                .fetchOne();
        QNewsletterFileList newsletterFileList = QNewsletterFileList.newsletterFileList;
        long Result = jpaQueryFactory
                .delete(newsletterFileList)
                .where(newsletterFileList.filegroupid.eq(result.getFilegroupid()))
                .execute();

        return Result;

    }

}

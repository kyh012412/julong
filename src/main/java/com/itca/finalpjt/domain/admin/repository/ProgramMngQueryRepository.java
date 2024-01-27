package com.itca.finalpjt.domain.admin.repository;

import com.itca.finalpjt.domain.admin.dto.ProgramMngRequest;
import com.itca.finalpjt.domain.admin.dto.ProgramMngResponse;
import com.itca.finalpjt.domain.admin.entity.ProgramMng;
import com.itca.finalpjt.domain.admin.entity.QProgramMng;
import com.itca.finalpjt.domain.admin.entity.QRoletypeUserauth;
import com.itca.finalpjt.domain.commoncode.dto.CommonCodeResponse;
import com.itca.finalpjt.domain.commoncode.entity.QCommonCode;
import com.itca.finalpjt.domain.commoncode.enums.CommonCodeType;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ProgramMngQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;
    private final ProgramMngRepository programMngRepository;

    @PersistenceContext
    EntityManager entityManager;

    // 멀티 메뉴 1 레벨
    public List<CommonCodeResponse> readMenuList() {
        QCommonCode commonCodeA = new QCommonCode("commonCodeA");

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class, commonCodeA.code,
                        commonCodeA.codeName, commonCodeA.refTxt01))
                .from(commonCodeA)
                .where(commonCodeA.codeNo.eq(CommonCodeType.MENUL.codeNo())
                        .and(commonCodeA.code.gt("$"))
                        .and(commonCodeA.useYn.eq(true)))
                .orderBy(commonCodeA.sortSeq.asc())
                .fetch();
    }

    public List<CommonCodeResponse> readMenuList_2() {
        QCommonCode commonCodeA = new QCommonCode("commonCodeA");

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class, commonCodeA.code,
                        commonCodeA.codeName, commonCodeA.refTxt01, commonCodeA.refTxt02))
                .from(commonCodeA)
                .where(commonCodeA.codeNo.eq("X033")
                        .and(commonCodeA.code.gt("$"))
                        .and(commonCodeA.useYn.eq(true)))
                .orderBy(commonCodeA.sortSeq.asc())
                .fetch();
    }

    public List<ProgramMngResponse> readMenuList_3(String type) {
        QProgramMng programMng = QProgramMng.programMng;
        QRoletypeUserauth roletypeUserauth = QRoletypeUserauth.roletypeUserauth;

        return jpaQueryFactory
                .select(Projections.fields(ProgramMngResponse.class, programMng.programkey,
                        programMng.programname, programMng.programurl,
                        programMng.menulgroupcode, programMng.menumgroupcode,
                        programMng.singlemenuyn,programMng.sortno))
                .from(programMng)
                .innerJoin(roletypeUserauth).on(roletypeUserauth.programkey.eq(programMng.programkey))
                .where(programMng.useyn.eq(true)
                        .and(roletypeUserauth.codemembertype.eq(type)))
                .orderBy(programMng.sortno.asc())
                .fetch();
    }

    public List<ProgramMngResponse> readMenuListMiddleFilterList(String type) {
        QProgramMng programMng = QProgramMng.programMng;
        QRoletypeUserauth roletypeUserauth = QRoletypeUserauth.roletypeUserauth;
        QCommonCode commonCode = QCommonCode.commonCode;
        return jpaQueryFactory
                .select(Projections.fields(ProgramMngResponse.class, //programMng.programkey,
                        //programMng.programname, programMng.programurl,
                        //programMng.menulgroupcode,
                        programMng.menumgroupcode,
                        //programMng.singlemenuyn,
                        commonCode.codeName.as("menumgroupcodename"),
                        commonCode.refTxt02.as("menulgroupcode")))
                .from(programMng)
                .innerJoin(roletypeUserauth).on(roletypeUserauth.programkey.eq(programMng.programkey))
                .leftJoin(commonCode).on(programMng.menumgroupcode.eq(commonCode.code)
                        .and(commonCode.codeNo.eq("X033"))
                        .and(commonCode.code.ne("$"))
                        .and(commonCode.useYn.eq(true)))
                .where(programMng.useyn.eq(true)
                        .and(roletypeUserauth.codemembertype.eq(type))
                        .and(commonCode.codeName.isNotNull()))
                .groupBy(programMng.menumgroupcode,
                         commonCode.codeName,
                         commonCode.refTxt02)
                .fetch();
    }

    // 상담일지용... 난중에 합치까...
    public List<ProgramMngResponse> readMenuList_31(String type) {
        QProgramMng programMng = QProgramMng.programMng;
        QRoletypeUserauth roletypeUserauth = QRoletypeUserauth.roletypeUserauth;

        return jpaQueryFactory
                .select(Projections.fields(ProgramMngResponse.class, programMng.programkey,
                        programMng.programname, programMng.programurl,
                        programMng.menulgroupcode, programMng.menumgroupcode,
                        programMng.singlemenuyn))
                .from(programMng)
                .innerJoin(roletypeUserauth).on(roletypeUserauth.programkey.eq(programMng.programkey))
                .where(programMng.useyn.eq(true)
                        .and(roletypeUserauth.codemembertype.eq(type))
                        .and(programMng.inoutyn.eq(false)))
                .orderBy(programMng.sortno.asc())
                .fetch();
    }

    // 프로그램 리스트
    public List<ProgramMngResponse> programList(ProgramMngRequest params) {
        QProgramMng programMng = QProgramMng.programMng;
        QCommonCode commonCodeA = new QCommonCode("commonCodeA");
        QCommonCode commonCodeB = new QCommonCode("commonCodeB");
        String programname = params.getProgramname();
        return jpaQueryFactory
                .select(Projections.fields(ProgramMngResponse.class, programMng.programkey,
                        programMng.programname, programMng.programurl,
                        programMng.menulgroupcode, programMng.menumgroupcode, programMng.sortno,
                        programMng.singlemenuyn, programMng.useyn, programMng.createId,
                        programMng.createDatetime, programMng.updateId,
                        programMng.updateDatetime,
                        commonCodeA.codeName.as("menulgroupcodename"),
                        commonCodeB.codeName.as("menumgroupcodename")))
                .from(programMng)
                .leftJoin(commonCodeA)
                .on(commonCodeA.codeNo.eq(CommonCodeType.MENUL.codeNo())
                        .and(commonCodeA.code.eq(programMng.menulgroupcode)))
                .leftJoin(commonCodeB)
                .on(commonCodeB.codeNo.eq(commonCodeA.refTxt01)
                        .and(commonCodeB.code.eq(programMng.menumgroupcode)))
                .where(programMng.programkey.gt(0)
                        .and(programName_c(programname)))
                .orderBy(programMng.sortno.asc())
                .fetch();
    }

    @Transactional
    public void programInsert(ProgramMngRequest request, String memberid) {
        ProgramMng programMng = ProgramMng.builder()
                .programname(request.getProgramname().trim())
                .programurl(request.getProgramurl().trim())
                .menulgroupcode(request.getMenulgroupcode().trim())
                .menumgroupcode(request.getMenumgroupcode().trim())
                .sortno(request.getSortno())
                .useyn(request.isUseyn())
                .singlemenuyn(request.isSinglemenuyn())
                .createId(memberid)
                .updateId(memberid)
                .build();
        programMngRepository.save(programMng);
    }

    @Transactional
    public boolean programUpdate(ProgramMngRequest request, String memberid) {
        QProgramMng programMng = QProgramMng.programMng;
        int programkey = request.getProgramkey();

        Long Result = jpaQueryFactory
                .update(programMng)
                .set(programMng.programname, request.getProgramname().trim())
                .set(programMng.programurl, request.getProgramurl().trim())
                .set(programMng.menulgroupcode, request.getMenulgroupcode())
                .set(programMng.menumgroupcode, request.getMenumgroupcode())
                .set(programMng.sortno, request.getSortno())
                .set(programMng.singlemenuyn, request.isSinglemenuyn())
                .set(programMng.useyn, request.isUseyn())

                .set(programMng.updateId, memberid)
                .set(programMng.updateDatetime, LocalDateTime.now())
                .where(programMng.programkey.eq(programkey))
                .execute();

        return Result > 0;
    }

    @Transactional
    public boolean programDelete(ProgramMngRequest request, String memberid) {
        QProgramMng programMng = QProgramMng.programMng;
        int programkey = request.getProgramkey();

        Long Result = jpaQueryFactory
                .delete(programMng)
                .where(programMng.programkey.eq(programkey))
                .execute();

        return Result > 0;
    }

    //
    public List<ProgramMngResponse> programListLabelaaa(String url) {
        QProgramMng programMng = QProgramMng.programMng;
        QCommonCode commonCodeA = new QCommonCode("commonCodeA");
        QCommonCode commonCodeB = new QCommonCode("commonCodeB");
        return jpaQueryFactory
                .select(Projections.fields(ProgramMngResponse.class, programMng.programname,
                        commonCodeB.codeName.as("menumgroupcodename")))
                .from(programMng)
                .leftJoin(commonCodeA)
                .on(commonCodeA.codeNo.eq(CommonCodeType.MENUL.codeNo())
                        .and(commonCodeA.code.eq(programMng.menulgroupcode)))
                .leftJoin(commonCodeB)
                .on(commonCodeB.codeNo.eq(commonCodeA.refTxt01)
                        .and(commonCodeB.code.eq(programMng.menumgroupcode)))
                .where(programMng.programurl.eq(url))
                .orderBy(programMng.sortno.asc())
                .fetch();
    }

    //
    public List<ProgramMngResponse> programListLabel() {
        QProgramMng programMng = QProgramMng.programMng;
        QCommonCode commonCodeA = new QCommonCode("commonCodeA");
        QCommonCode commonCodeB = new QCommonCode("commonCodeB");
        return jpaQueryFactory
                .select(Projections.fields(ProgramMngResponse.class, programMng.programurl,
                        programMng.programname, commonCodeB.codeName.as("menumgroupcodename")))
                .from(programMng)
                .leftJoin(commonCodeA)
                .on(commonCodeA.codeNo.eq(CommonCodeType.MENUL.codeNo())
                        .and(commonCodeA.code.eq(programMng.menulgroupcode)))
                .leftJoin(commonCodeB)
                .on(commonCodeB.codeNo.eq(commonCodeA.refTxt01)
                        .and(commonCodeB.code.eq(programMng.menumgroupcode)))
                // .where(programMng.programurl.eq(url)
                // )
                .orderBy(programMng.sortno.asc())
                .fetch();
    }

    // 업종
    private BooleanExpression programName_c(String val) {
        if (val == null)
            return null;
        if ("".equals(val))
            return null;

        QProgramMng programMng = QProgramMng.programMng;
        return programMng.programname.contains(val);
    }

}

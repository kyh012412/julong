package com.itca.finalpjt.domain.commoncode.repository;

import com.itca.finalpjt.domain.commoncode.dto.CommonCodeResponse;
import com.itca.finalpjt.domain.commoncode.entity.QCommonCode;
import com.itca.finalpjt.domain.commoncode.enums.CommonCodeType;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CrawlingcontrolCommonCodeQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    public List<CommonCodeResponse> getCodeCrawlingType() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class,
                        commonCode.codeName,
                        commonCode.code))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.CRAWLING_TYPE.codeNo())
                        .and(commonCode.useYn.eq(true))
                        .and(commonCode.code.gt("$")))
                .orderBy(commonCode.sortSeq.asc())
                .fetch();
    }

    public List<CommonCodeResponse> getScheduleStatus() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class,
                        commonCode.codeName,
                        commonCode.code))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.CRAWLING_STATUS.codeNo())
                        .and(commonCode.useYn.eq(true))
                        .and(commonCode.code.gt("$")))
                .orderBy(commonCode.sortSeq.asc())
                .fetch();
    }

    public List<CommonCodeResponse> getCodeAnalysisType() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class,
                        commonCode.codeName,
                        commonCode.code))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.ANALYSIS_TYPE.codeNo())
                        .and(commonCode.useYn.eq(true))
                        .and(commonCode.code.gt("$")))
                .orderBy(commonCode.sortSeq.asc())
                .fetch();
    }

    public List<CommonCodeResponse> getCodeLoop() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class,
                        commonCode.codeName,
                        commonCode.code))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.LOOP.codeNo())
                        .and(commonCode.useYn.eq(true))
                        .and(commonCode.code.gt("$")))
                .orderBy(commonCode.sortSeq.asc())
                .fetch();
    }

    public List<CommonCodeResponse> getWeekLoop() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class,
                        commonCode.codeName,
                        commonCode.refTxt01))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.WEEK_LOOP_NO.codeNo())
                        .and(commonCode.useYn.eq(true))
                        .and(commonCode.code.gt("$")))
                .orderBy(commonCode.refTxt01.asc())
                .fetch();
    }


    public List<CommonCodeResponse> getCodecategory() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class,
                        commonCode.codeName,
                        commonCode.code))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.CATEGORY.codeNo())
                        .and(commonCode.useYn.eq(true))
                        .and(commonCode.code.gt("$")))
                .orderBy(commonCode.sortSeq.asc())
                .fetch();
    }

    public List<CommonCodeResponse> getNation() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class,
                        commonCode.codeName,
                        commonCode.code))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.NATION.codeNo())
                        .and(commonCode.useYn.eq(true))
                        .and(commonCode.code.gt("$")))
                .orderBy(commonCode.sortSeq.desc(), commonCode.codeName.asc())
                .fetch();
    }

    public List<CommonCodeResponse> getCodeCrawlingPermit() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class,
                        commonCode.codeName,
                        commonCode.code))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.CRAWLING_PERMIT.codeNo())
                  .and(commonCode.useYn.eq(true))
                  .and(commonCode.code.gt("$")))
                .orderBy(commonCode.sortSeq.asc())
                .fetch();
    }
}

package com.itca.finalpjt.domain.commoncode.repository;

import com.itca.finalpjt.domain.commoncode.dto.CommonCodeResponse;
import com.itca.finalpjt.domain.commoncode.enums.CommonCodeType;
import com.itca.finalpjt.domain.commoncode.entity.QCommonCode;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CrawlingCommonCodeQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    public List<CommonCodeResponse> getCategoryList() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class
                      , commonCode.codeNo
                      , commonCode.code
                      , commonCode.codeName
                ))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.CATEGORY.codeNo())
                  .and(commonCode.useYn.eq(true))
                  .and(commonCode.code.gt("$"))
                )
                .orderBy(commonCode.sortSeq.asc())
                .fetch();
    }

    public List<CommonCodeResponse> getNationList() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class
                      , commonCode.codeNo
                      , commonCode.code
                      , commonCode.codeName
                ))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.NATION.codeNo())
                  .and(commonCode.useYn.eq(true))
                  .and(commonCode.code.gt("$"))
                )
                .orderBy(commonCode.sortSeq.desc(), commonCode.codeName.asc())
                .fetch();
    }

    public List<CommonCodeResponse> getCrawlingPermitList() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class
                        , commonCode.codeNo
                        , commonCode.code
                        , commonCode.codeName
                ))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.CRAWLING_PERMIT.codeNo())
                        .and(commonCode.useYn.eq(true))
                        .and(commonCode.code.gt("$"))
                )
                .orderBy(commonCode.sortSeq.asc())
                .fetch();
    }

    public List<CommonCodeResponse> getPupuselect() {
        QCommonCode commonCode = QCommonCode.commonCode;

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class
                        , commonCode.codeNo
                        , commonCode.code
                        , commonCode.codeName
                ))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.PU_SELECT.codeNo())
                        .and(commonCode.useYn.eq(true))
                        .and(commonCode.code.gt("$"))
                )
                .orderBy(commonCode.sortSeq.asc())
                .fetch();
    }
}

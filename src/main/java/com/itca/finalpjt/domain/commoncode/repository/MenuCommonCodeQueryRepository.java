package com.itca.finalpjt.domain.commoncode.repository;

import com.itca.finalpjt.domain.account.entity.QMember;
import com.itca.finalpjt.domain.account.entity.QMemberTypeAuth;
import com.itca.finalpjt.domain.commoncode.dto.CommonCodeMenu;
import com.itca.finalpjt.domain.commoncode.enums.CommonCodeType;
import com.itca.finalpjt.domain.commoncode.entity.QCommonCode;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MenuCommonCodeQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    public List<CommonCodeMenu> getMainMenuList(String memberId) {
        QMember member = QMember.member;
        QMemberTypeAuth memberTypeAuth = QMemberTypeAuth.memberTypeAuth;
        QCommonCode commonCodeA = new QCommonCode("commonCodeA");
        QCommonCode commonCodeB = new QCommonCode("commonCodeB");

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeMenu.class
                        , commonCodeB.code.trim().as("menuCode")
                        , commonCodeB.codeName.as("menuName")
                ))
                .from(member)
                .innerJoin(memberTypeAuth).on(memberTypeAuth.codeMemberType.eq(member.codeMemberType))
                .innerJoin(commonCodeA).on(commonCodeA.codeNo.eq(CommonCodeType.MEMBER_AUTH.codeNo()))
                                       .on(commonCodeA.code.eq(memberTypeAuth.codeMemberAuth))
                .innerJoin(commonCodeB).on(commonCodeB.codeNo.eq(CommonCodeType.MENU_1DEPTH.codeNo()))
                                       .on(commonCodeB.code.eq(commonCodeA.refTxt01))
                                       .on(commonCodeB.useYn.eq(true))
                .where(member.memberId.eq(memberId)
                  .and(member.useYn.eq(true)).and(member.lockYn.eq(false))
                )
                .orderBy(commonCodeB.sortSeq.asc())
                .fetch();
    }

    public List<CommonCodeMenu> getSubMenuList(List<CommonCodeMenu> parentsMenuCodes, String parentsDepthCodeNo, String childDepthCodeNo) {
        QCommonCode commonCodeA = new QCommonCode("commonCodeA");
        QCommonCode commonCodeB = new QCommonCode("commonCodeB");

        BooleanBuilder builder = new BooleanBuilder();
        parentsMenuCodes.forEach(parentsCode -> {
            builder.or(commonCodeA.code.eq(parentsCode.getMenuCode()));
        });

        return jpaQueryFactory
                .select(Projections.fields(CommonCodeMenu.class
                        , commonCodeA.code.trim().as("parentsMenuCode")
                        , commonCodeB.code.trim().as("menuCode")
                        , commonCodeB.codeName.as("menuName")
                        , commonCodeB.refTxt02.trim().as("url")
                ))
                .from(commonCodeA)
                .innerJoin(commonCodeB).on(commonCodeB.codeNo.eq(childDepthCodeNo))
                                       .on(commonCodeB.refTxt01.eq(commonCodeA.code))
                                       .on(commonCodeB.useYn.eq(true))
                .where(commonCodeA.codeNo.eq(parentsDepthCodeNo)
                  .and(builder)
                  .and(commonCodeA.useYn.eq(true))
                )
                .orderBy(commonCodeA.sortSeq.asc(), commonCodeB.sortSeq.asc())
                .fetch();
    }

}

package com.itca.finalpjt.domain.admin.repository;

import com.itca.finalpjt.domain.admin.dto.UserdataAuthResponse;
import com.itca.finalpjt.domain.admin.entity.QUserdataAuth;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserdataAuthQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    public List<UserdataAuthResponse> inquiryRight(int memberKey) {
        QUserdataAuth userauth = QUserdataAuth.userdataAuth;
        return jpaQueryFactory
                .select(Projections.fields(UserdataAuthResponse.class,
                        userauth.memberinquiryright.coalesce("").as("memberinquiryright"),
                        userauth.memberpuinquiryright.coalesce("").as("memberpuinquiryright")))
                .from(userauth)
                .where(
                        userauth.memberKey.eq(memberKey))
                .fetch();
    }

    @Transactional
    public long authDelete(int memberKey) {

        QUserdataAuth userdataAuth = new QUserdataAuth("userdataAuth");

        return jpaQueryFactory.delete(userdataAuth).where(userdataAuth.memberKey.eq(memberKey)).execute();

    }
}

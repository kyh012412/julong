package com.itca.finalpjt.domain.admin.repository;


import com.itca.finalpjt.domain.admin.entity.RoleTypeMng;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MemberRoletypeMng extends JpaRepository<RoleTypeMng, Integer> {
/*    boolean existsByMemberId(String memberId);
    Optional<Member> findByMemberId(String memberId);*/
}

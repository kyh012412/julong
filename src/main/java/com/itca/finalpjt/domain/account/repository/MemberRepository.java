package com.itca.finalpjt.domain.account.repository;


import com.itca.finalpjt.domain.account.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    boolean existsByMemberId(String memberId);
    Optional<Member> findByMemberId(String memberId);
}

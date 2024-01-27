package com.itca.finalpjt.domain.admin.repository;


import com.itca.finalpjt.domain.admin.entity.RoletypeUserauth;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserdataAuthRepository extends JpaRepository<RoletypeUserauth, Integer> {
    //boolean existsBycodemembertype(String codemembertype);
    //boolean existsBymemberKey(int memberKey);

}

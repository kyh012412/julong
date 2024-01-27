package com.itca.finalpjt.domain.commoncode.repository;

import com.itca.finalpjt.domain.commoncode.entity.CommonCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommonCodeRepository extends JpaRepository<CommonCode, String> {
    Optional<CommonCode> findByCodeNoAndCodeAndUseYnTrue(String codeNo, String code);
}

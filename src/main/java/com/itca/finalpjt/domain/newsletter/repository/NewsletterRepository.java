package com.itca.finalpjt.domain.newsletter.repository;


import com.itca.finalpjt.domain.newsletter.entity.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface NewsletterRepository extends JpaRepository<Newsletter, Integer> {
    boolean existsByNewsletterKey(int newsletterKey);
    Optional<Newsletter> findByNewsletterKey(int newsletterKey);
}

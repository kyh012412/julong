package com.itca.finalpjt.domain.index.controller;

import com.itca.finalpjt.domain.account.dto.MemberResponse;
import com.itca.finalpjt.domain.account.service.MemberService;
import com.itca.finalpjt.domain.commoncode.enums.CodeMemberType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.Locale;

@Slf4j
@Controller
@RequestMapping("/main")
@RequiredArgsConstructor
public class MainController {
    private final MemberService memberService;

    @RequestMapping
    public String index(Principal principal, HttpSession session) {
        if (principal == null)
            return "redirect:/account/login";

        MemberResponse member = memberService.getResponseByMemberId(principal.getName());
        log.info("ABCDEFG   index 1 " + principal.getName());

        /* 회원가입 후 권한 부여 받기 전의 회원이 접근 가능한 페이지 */
        if (member.getCodeMemberType() != null
                && member.getCodeMemberType().trim().equals(CodeMemberType.NEWBIE.code().trim())) {
            return "/index-newbie";
        }
        log.info("ABCDEFG   index 2");
        /* 권한을 부여 받은 회원이 접근 가능한 페이지 */

        String language = (String) session.getAttribute("codeLang");
        log.info("hhhhhhhhhh " + language);
        return "redirect:/collecting/dashboard";
    }

    @PostMapping("/lang")
    public ResponseEntity<?> langChange(HttpServletRequest request, HttpSession session) {
        String language = request.getParameter("language");

        log.info("langChange " + language);

        if ("KO".equals(language)) {
            session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, new Locale("ko"));
        } else if ("EN".equals(language)) {
            session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, new Locale("en"));
        } else {
            session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, new Locale("cn"));
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}

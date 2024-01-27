package com.itca.finalpjt.common.controller;

import com.itca.finalpjt.domain.account.dto.UpPassword;
import com.itca.finalpjt.domain.account.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/account")
public class LoginController {
    private final MemberService memberService;

    @GetMapping("/login")
    public String loginPage(HttpServletRequest request) {
        log.info("ABCDEFG   LoginController 1");

        String userAgent = request.getHeader("User-Agent");
        log.info("ABCDEFG   loginPage--311 aaaaaaaaaaaaaaaaaaaaaaaaaaaa ");
        log.info("ABCDEFG   loginPage--311 = " + userAgent);
        log.info("ABCDEFG   loginPage--311 bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");

        log.info("ABCDEFG   LoginController 2");

        return "account/login";
    }

    @GetMapping("/form-login")
    public String FormLoginPage(HttpServletRequest request) {
        return "account/form-login";
    }

    @PostMapping("/login")
    public String loginError(Model model) {
        model.addAttribute("errorCheck", true);
        return "account/login";
    }


    @PostMapping("/logoutx")
    public String logoutp(HttpServletRequest request, HttpServletResponse response) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/form-login?logout";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/form-login?logout";
    }


    @GetMapping("/newsign")
    public String newsign(Model model, HttpSession session, HttpServletRequest request) {

        return "account/sign-up";
    }



    @PostMapping("/pwUdate")
    public ResponseEntity<?> pwUdate(@RequestBody UpPassword upPassword) {
        boolean aa = memberService.updatePasswordto(upPassword);
        return new ResponseEntity<>(aa, HttpStatus.OK);
    }

    @GetMapping("/sessionOut")
    public String sessionOut() {
        return "account/logout";
    }
}

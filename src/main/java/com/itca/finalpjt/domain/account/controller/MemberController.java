package com.itca.finalpjt.domain.account.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    @GetMapping("/signup")
    public String memberSignUp() {
        return "account/sign-up";
    }

}

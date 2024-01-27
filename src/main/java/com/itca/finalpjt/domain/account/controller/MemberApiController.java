package com.itca.finalpjt.domain.account.controller;

import com.itca.finalpjt.domain.account.dto.MemberRequest;
import com.itca.finalpjt.domain.account.dto.MyInfoRequest;
import com.itca.finalpjt.domain.account.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/member")
@RequiredArgsConstructor
public class MemberApiController {
    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<String> memberSignUp(@RequestBody @Valid MemberRequest request, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {  return new ResponseEntity<>(bindingResult.getFieldError().getDefaultMessage(), HttpStatus.BAD_REQUEST); }
        var member = memberService.signUp(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/myInfo")
    public Map<String, Object> readMyInfo(Principal principal) {
        System.out.println("principalprincipalprincipalprincipal" + principal);
        return memberService.readMyInfo(principal.getName());
    }

    @PostMapping(value = "/myInfo")
    public ResponseEntity<String> updateMyInfo(@Valid MyInfoRequest request, BindingResult bindingResult, MultipartFile file, HttpSession session, Principal principal) {
        if(bindingResult.hasErrors()) {  return new ResponseEntity<>(HttpStatus.BAD_REQUEST);}
        memberService.updateMyinfo(request, file, principal.getName());
        session.setAttribute("codeLang", request.getCodeLanguage());
        return new ResponseEntity<>(HttpStatus.OK);
    }

}

package com.itca.finalpjt.common.security;

import com.itca.finalpjt.domain.account.dto.MyInfoRequest;
import com.itca.finalpjt.domain.admin.dto.ProgramMngResponse;
import com.itca.finalpjt.domain.account.entity.Member;
import com.itca.finalpjt.domain.account.service.MemberService;
import com.itca.finalpjt.domain.admin.dto.UserdataAuthResponse;
import com.itca.finalpjt.domain.admin.service.ProgramMngService;
import com.itca.finalpjt.domain.admin.service.UserdataAuthService;
import com.itca.finalpjt.domain.commoncode.dto.CommonCodeResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@RequiredArgsConstructor
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {
    public static final String ADMIN_LOGIN_FLAG = "adminLoginFlag";
    private static final String PARAMETER_LANGUAGE = "language";
    private static final String DEFAULT_SUCCESS_URL = "/main";

    private final MemberService memberService;

    private final UserdataAuthService userdataAuthService;
    private final ProgramMngService programMngService;

    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @SneakyThrows
    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();

        log.info("ABCDEFG   onAuthenticationSuccess 00  " + request.getParameter("username"));
        log.info("ABCDEFG   onAuthenticationSuccess 001  " + authentication);
        log.info("ABCDEFG   onAuthenticationSuccess 1 " + memberId);

        var session = request.getSession();
        var language = (String) session.getAttribute(PARAMETER_LANGUAGE);

        log.info("customLogun " + language);

        if ("EN".equals(language)) {
            session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, new Locale("en"));
        } else if ("ZH".equals(language)) {
            session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, new Locale("zh"));
        } else {
            session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, new Locale("ko"));
        }

        log.info("ABCDEFG   onAuthenticationSuccess 2 [" + memberId);
        // 최종로그인시각 업데이트
        Member member = memberService.updateLastLoginDatetimeAndLanguage(memberId, language);
        List<Member> pwdaychk = memberService.passwordChk(member.getMemberKey());

        Calendar getToday = Calendar.getInstance();
        getToday.setTime(new Date()); // 금일 날짜
        // String s_date = "2020-03-01";

        log.info("ABCDEFG   onAuthenticationSuccess 3 [" + memberId);
        String jump1 = "";
        long diffDays = 30000000000L;

        if (null == pwdaychk.get(0).getPwdupdatedatetime()) {
            jump1 = "up";
        } else {
            String s_date = pwdaychk.get(0).getPwdupdatedatetime().toString();
            Date date = new SimpleDateFormat("yyyy-MM-dd").parse(s_date);
            Calendar cmpDate = Calendar.getInstance();
            cmpDate.setTime(date); // 특정 일자

            long diffSec = (getToday.getTimeInMillis() - cmpDate.getTimeInMillis()) / 1000;
            diffDays = diffSec / (24 * 60 * 60); // 일자수 차이
        }
        log.info("ABCDEFG   onAuthenticationSuccess 4 [" + memberId);
        session.setAttribute("memberId", memberId);
        session.setAttribute("memberkey", member.getMemberKey());

        session.setAttribute("companyCode", member.getCompanyCode());
        session.setAttribute("codeLang", member.getCodeLanguage());
        session.setAttribute("divisionCd", member.getDivisionCode());
        if ("EN".equals(language))
            session.setAttribute("divisionNm", member.getDivisionEnName());
        else if ("ZH".equals(language))
            session.setAttribute("divisionNm", member.getDivisionCnName());
        else
            session.setAttribute("divisionNm", member.getDivisionKrName());
        session.setAttribute("memberName", member.getMemberName());

        // sso 인증 여부
        String ssoFlag = request.getParameter("ssoFlag") != null ? "N" : "Y";
        log.info("ABCDEFG   onAuthenticationSuccess 41 session.ssoFlag [" + ssoFlag);
        session.setAttribute("ssoFlag", ssoFlag);

        // sso,form login 세션 만료시 체크 로직 추가
        // 2022.12.02 form login으로 로그인시에 타임아웃후 form-login으로 redirect 추가
        Cookie cookie = null;
        if (ssoFlag.equals("Y")) {
            cookie = new Cookie("isSSO", "Y"); // 쿠키 이름 지정하여 생성( key, value 개념)
        } else {
            cookie = new Cookie("isSSO", "N"); // 쿠키 이름 지정하여 생성( key, value 개념)

        }
        cookie.setMaxAge(60 * 60 * 24); // 쿠키 유효 기간: 하루로 설정(60초 * 60분 * 24시간)
        cookie.setPath("/"); // 모든 경로에서 접근 가능하도록 설정
        response.addCookie(cookie); // response에 Cookie 추가

        // adminLogin 인증 여부
        String adminLoginFlag = request.getParameter(ADMIN_LOGIN_FLAG) != null ? "Y" : "N";
        session.setAttribute(ADMIN_LOGIN_FLAG, adminLoginFlag);

        String edgeLoginFlag = request.getParameter("edgeLoginFlag");
        log.info("ABCDEFG   onAuthenticationSuccess 411 session.edgeLoginFlag [" + edgeLoginFlag);
        session.setAttribute("edgeLoginFlag", edgeLoginFlag);

        // 회사 , PU
        List<UserdataAuthResponse> inquiryRight = userdataAuthService.inquiryRight(member.getMemberKey());
        log.info("ABCDEFG   onAuthenticationSuccess 6 [" + memberId);
        session.setAttribute("codeLang", member.getCodeLanguage());

        // 상단 메뉴용
        session.setAttribute("menuMap1", programMngService.readMenuList());
        session.setAttribute("menuMap2", programMngService.readMenuList_2());
        if (member.getCodeMemberType() != null && member.getCodeMemberType().length() > 0)
            session.setAttribute("menuMap3", programMngService.readMenuList_3(member.getCodeMemberType()));

        log.info("ABCDEFG   onAuthenticationSuccess 7 [" + memberId);
        if (("up".equals(jump1) || diffDays >= 60) && "N".equals(ssoFlag) && adminLoginFlag.equals("N")) {
            // 로걸에서는 안넘어감
            // dev, 운영에서는 넘어감
            log.info("pwd change");
            // session.setAttribute("sort_Menu","/account/permissionupload" );
            request.setAttribute("memberkey", member.getMemberKey());
            // request.getSession().invalidate();
            redirectStrategy.sendRedirect(request, response, "/account/passchng");
            return;

        } else {
            log.info("ABCDEFG   onAuthenticationSuccess 81 [" + memberId);
            if (member.getCodeMemberType() != null && member.getCodeMemberType().length() > 0) {
                Map<String, List<ProgramMngResponse>> list_m = programMngService
                        .readMenuList_3(member.getCodeMemberType());
                Set set2 = list_m.entrySet();
                Iterator iterator2 = set2.iterator();
                while (iterator2.hasNext()) {
                    Map.Entry<String, List<ProgramMngResponse>> entry_m = (Map.Entry) iterator2.next();
                    String key_m = (String) entry_m.getKey();
                    List<ProgramMngResponse> value_m = entry_m.getValue();
                    if ("menu_3".equals(key_m) && value_m.size() > 0) {
                        session.setAttribute("sort_Menu", value_m.get(0).getProgramurl());
                        // System.out.println(value_m.);
                    }
                    if (value_m.size() == 0) {
                        request.getSession().invalidate();
                        redirectStrategy.sendRedirect(request, response, "/account/newsign");
                        return;
                    }
                }
                    //로그인 사용자 메뉴리스트 만들기
                    Map<String, List<CommonCodeResponse>> topMenuList = programMngService.readMenuList();
                    List<ProgramMngResponse> middleMenuList = programMngService.readMenuListMiddleFilter(member.getCodeMemberType());
                    List<Map<String, Object>> menuListTop = new ArrayList<Map<String, Object>>();
                    List<Map<String, Object>> menuListMiddle = new ArrayList<Map<String, Object>>();
                    List<Map<String, Object>> menuListSub = new ArrayList<Map<String, Object>>();

                    for (CommonCodeResponse item : topMenuList.get("menu_1")) {
                        Map<String, Object> tempMap = new HashMap<>();
                        tempMap.put( "code", item.getCode());
                        tempMap.put( "name", item.getCodeName());
                        tempMap.put( "singlemenuyn", false);

                        menuListTop.add(tempMap);
                    }

                    for (ProgramMngResponse item : middleMenuList) {
                        Map<String, Object> tempMap = new HashMap<>();
                        tempMap.put( "code", item.getMenumgroupcode());
                        tempMap.put( "name", item.getMenumgroupcodename());
                        tempMap.put( "tcode", item.getMenulgroupcode());
                        menuListMiddle.add(tempMap);
                    }

                    for (ProgramMngResponse item : list_m.get("menu_3")) {
                        Map<String, Object> tempMap = new HashMap<>();
                        if(item.isSinglemenuyn() == true){
                            tempMap.put( "code", item.getMenulgroupcode());
                            tempMap.put( "name", item.getProgramname());
                            tempMap.put( "url", item.getProgramurl());
                            tempMap.put( "singlemenuyn", true);
                            /*
                               싱글메뉴일 경우 메뉴 정렬이 되지 않는 버그 수정
                             */
                            menuListTop.add(item.getSortno(),tempMap);

                        }else{
                            tempMap.put( "tcode", item.getMenulgroupcode());
                            tempMap.put( "mcode", item.getMenumgroupcode());
                            tempMap.put( "name", item.getProgramname());
                            tempMap.put( "url", item.getProgramurl());
                            tempMap.put( "singlemenuyn", false);
                            menuListSub.add(tempMap);
                        }
                    }

                    for(Map<String, Object> mapTop : menuListTop){
                        List<Map<String, Object>> menuListTemp = menuListMiddle.stream().filter(v -> v.get("tcode").equals(mapTop.get("code"))).collect(Collectors.toList());
                        if(menuListTemp.size() > 0){
                            List<Map<String, Object>> menuListTemp2 = menuListSub.stream().filter(v -> v.get("tcode").equals(mapTop.get("code")) && ObjectUtils.isEmpty(v.get("mcode"))).collect(Collectors.toList());
                            for(Map<String, Object> map : menuListTemp2){
                                menuListTemp.add(map);
                            }
                            mapTop.put("mMenuList", menuListTemp);
                        }else{
                            List<Map<String, Object>> menuListTemp3 = menuListSub.stream().filter(v -> v.get("tcode").equals(mapTop.get("code"))).collect(Collectors.toList());
                            mapTop.put("mMenuList", menuListTemp3);
                        }
                    }

                    for(Map<String, Object> mapTop : menuListTop){
                        List<Map> mMenuList = (List<Map>) mapTop.get("mMenuList");
                        for(Map map : mMenuList){
                            List<Map<String, Object>> menuListTemp = menuListSub.stream().filter(v -> v.get("mcode").equals(map.get("code"))).collect(Collectors.toList());
                            map.put("subMenuList", menuListTemp);
                        }
                    }
                    log.info("menuListTop" + menuListTop);

                    session.setAttribute("menuListUser", menuListTop);
            }
            log.info("ABCDEFG   onAuthenticationSuccess 82 [" + memberId);
            Map<String, Object> map1 = memberService.readMyInfo(memberId);
            MyInfoRequest myinfo = (MyInfoRequest) map1.get("myInfo");

            log.info("customLogunSession " + myinfo.getCodeLanguage());

            session.setAttribute("codeLang", myinfo.getCodeLanguage());
            log.info("ABCDEFG   onAuthenticationSuccess 830 ====["
                    + SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME);
            if ("EN".equals(myinfo.getCodeLanguage())) {
                session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, new Locale("en"));
            } else if ("ZH".equals(myinfo.getCodeLanguage())) {
                session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, new Locale("zh"));
            } else {
                session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, new Locale("ko"));
            }

            session.setAttribute("programUrlnameList", programMngService.programListLabel());
            log.info("ABCDEFG   onAuthenticationSuccess 83 [" + memberId);
            String pu1 = "";
            if (inquiryRight.size() > 0) {
                // 조회권한
                session.setAttribute("inquiryRight", inquiryRight.get(0).getMemberinquiryright());
                // PU 조회권한
                session.setAttribute(MemberService.INQUIRYRIGHTPU, inquiryRight.get(0).getMemberpuinquiryright());
                pu1 = inquiryRight.get(0).getMemberpuinquiryright();
                session.setAttribute("inquiryRightABC", pu1);
            } else {
                request.getSession().invalidate();
                redirectStrategy.sendRedirect(request, response, "/account/ssonewsign");
                return;
            }

            session.setAttribute("codememberType", member.getCodeMemberType());
            if (member.getTimeZone() == null || "".equals(member.getTimeZone()))
                session.setAttribute("timeZone", "Asia/Seoul");
            else
                session.setAttribute("timeZone", member.getTimeZone());
            log.info("ABCDEFG   onAuthenticationSuccess 8555 [" + memberId);

            clearAuthenticationAttributes(request);
            this.getReturnUrl(request, response);
        }
        log.info("ABCDEFG   onAuthenticationSuccess end [" + memberId);
    }

    private void getReturnUrl(HttpServletRequest request, HttpServletResponse response) throws IOException {
        redirectStrategy.sendRedirect(request, response, DEFAULT_SUCCESS_URL);
    }

    private void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        log.info("ABCDEFG   clearAuthenticationAttributes " + session);
        if (session == null)
            return;
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }
}

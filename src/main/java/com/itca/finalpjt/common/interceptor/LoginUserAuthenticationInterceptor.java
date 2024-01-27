package com.itca.finalpjt.common.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
public class LoginUserAuthenticationInterceptor implements HandlerInterceptor {
	public void setPath(HttpServletRequest request) {
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		if (handler instanceof HandlerMethod) {
			String url = request.getRequestURI();
			HttpSession session = request.getSession();
			session.setAttribute("programUrlname", url);

			String browser = "";
			String userAgent = request.getHeader("User-Agent");
			if (userAgent.indexOf("Trident") > -1) {
				// IE
				browser = "ie";
			} else if (userAgent.indexOf("Edge") > -1) {
				// Edge
				browser = "edge";
			} else if (userAgent.indexOf("Whale") > -1) {
				// Naver Whale
				browser = "whale";
			} else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
				// Opera
				browser = "opera";
			} else if (userAgent.indexOf("Firefox") > -1) {
				// Firefox
				browser = "firefox";
			} else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1) {
				// Safari
				browser = "safari";
			} else if (userAgent.indexOf("Chrome") > -1) {
				// Chrome
				browser = "chrome";
			}

			if ("/account/passchng".equals(url) && null == session.getAttribute("memberId")) {
				response.sendRedirect("/account/login");
			}
			if ("ie".equals(browser)) {
				if ("/account/login".equals(url) || "/account/form-login".equals(url)) {
				}
			}
		}

		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView model)
			throws Exception {
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
	}

}

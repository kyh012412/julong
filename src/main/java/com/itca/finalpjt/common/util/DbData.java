package com.itca.finalpjt.common.util;


import com.itca.finalpjt.domain.admin.dto.ProgramMngResponse;
import com.itca.finalpjt.domain.admin.service.ProgramMngService;
import lombok.RequiredArgsConstructor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * Created by
 */
@RequiredArgsConstructor
public class DbData {
	private final ProgramMngService programMngService;
	// programmng 테이블의 프로그램 명을 보낸다
    public String tableName(HttpServletRequest request){
        String result = "";

		HttpSession session = request.getSession();
		// common.interceptor 의 preHandle 에서 넣은값
		// session.setAttribute("programUrlname", url);
		String url = (String)session.getAttribute("programUrlname");
		List<ProgramMngResponse> programUrlname = (List<ProgramMngResponse>)session.getAttribute("programUrlnameList");
		String programUrlname1 = "", programUrlname2 = "";
		for(ProgramMngResponse value : programUrlname) {
			if(url.equals(value.getProgramurl().trim())) {
				programUrlname1 = value.getMenumgroupcodename();
				programUrlname2 = value.getProgramname();
			}
		}
		if(programUrlname1 == null || "".equals(programUrlname1))
			result = programUrlname2;
		else
			result = programUrlname1 + ": " + programUrlname2;

        return result;
    }

	public String tableName(HttpServletRequest request, String url){
		String result = "";

		HttpSession session = request.getSession();
		// common.interceptor 의 preHandle 에서 넣은값
		// session.setAttribute("programUrlname", url);
		//String url = (String)session.getAttribute("programUrlname");
		List<ProgramMngResponse> programUrlname = (List<ProgramMngResponse>)session.getAttribute("programUrlnameList");
		String programUrlname1 = "", programUrlname2 = "";
		for(ProgramMngResponse value : programUrlname) {
			if(url.equals(value.getProgramurl().trim())) {
				programUrlname1 = value.getMenumgroupcodename();
				programUrlname2 = value.getProgramname();
			}
		}
		if(programUrlname1 == null || "".equals(programUrlname1))
			result = programUrlname2;
		else
			result = programUrlname1 + ": " + programUrlname2;

		return result;
	}
}

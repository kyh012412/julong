package com.itca.finalpjt.domain.admin.service;

import com.itca.finalpjt.domain.admin.dto.ProgramMngRequest;
import com.itca.finalpjt.domain.admin.dto.ProgramMngResponse;
import com.itca.finalpjt.domain.admin.repository.ProgramMngQueryRepository;
import com.itca.finalpjt.domain.commoncode.dto.CommonCodeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProgramMngService {
    private final ProgramMngQueryRepository programMngQueryRepository;

    public Map<String, List<CommonCodeResponse>> readMenuList() {
        Map<String, List<CommonCodeResponse>> menuMap = new HashMap<>();
        var menuOneList1 = programMngQueryRepository.readMenuList();
        menuMap.put("menu_1", menuOneList1);
        return menuMap;
    }

    public Map<String, List<CommonCodeResponse>> readMenuList_2() {
        Map<String, List<CommonCodeResponse>> menuMap = new HashMap<>();
        var menuOneList2 = programMngQueryRepository.readMenuList_2();
        menuMap.put("menu_2", menuOneList2);
        return menuMap;
    }

    public Map<String, List<ProgramMngResponse>> readMenuList_3(String type) {
        Map<String, List<ProgramMngResponse>> menuMap = new HashMap<>();
        var menuOneList3 = programMngQueryRepository.readMenuList_3(type);
        menuMap.put("menu_3", menuOneList3);
        return menuMap;
    }

    public List<ProgramMngResponse> readMenuListMiddleFilter(String type) {
        List<ProgramMngResponse> menuList = programMngQueryRepository.readMenuListMiddleFilterList(type);
        return menuList;
    }
    // 상담일지용
    public Map<String, List<ProgramMngResponse>> readMenuList_31(String type) {
        Map<String, List<ProgramMngResponse>> menuMap = new HashMap<>();
        var menuOneList3 = programMngQueryRepository.readMenuList_31(type);
        menuMap.put("menu_3", menuOneList3);
        return menuMap;
    }

    public List<CommonCodeResponse> readMenuListLmenu() {
        return programMngQueryRepository.readMenuList();
    }

    public List<CommonCodeResponse> readMenuListMmenu() {
        return programMngQueryRepository.readMenuList_2();
    }

    public List<ProgramMngResponse> programList(ProgramMngRequest params) {
        List<ProgramMngResponse> programList = programMngQueryRepository.programList(params);
        return programList;
    }

    @Transactional
    public void programInsert(ProgramMngRequest request, String memberid) {
        programMngQueryRepository.programInsert(request, memberid);
    }

    @Transactional
    public void programUpdate(ProgramMngRequest request, String memberid) {
        boolean result = programMngQueryRepository.programUpdate(request, memberid);
        if (!result) {
            throw new IllegalArgumentException("저장을 실패했습니다.");
        }
    }

    @Transactional
    public void programDelete(ProgramMngRequest request, String memberid) {
        boolean result = programMngQueryRepository.programDelete(request, memberid);
        if (!result) {
            throw new IllegalArgumentException("저장을 실패했습니다.");
        }
    }

    public List<ProgramMngResponse> programListLabelaaa(String url) {
        List<ProgramMngResponse> programList = programMngQueryRepository.programListLabelaaa(url);
        return programList;
    }

    public List<ProgramMngResponse> programListLabel() {
        List<ProgramMngResponse> programList = programMngQueryRepository.programListLabel();
        return programList;
    }


}

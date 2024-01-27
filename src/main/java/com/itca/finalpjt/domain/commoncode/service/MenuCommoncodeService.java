package com.itca.finalpjt.domain.commoncode.service;

import com.itca.finalpjt.domain.commoncode.dto.CommonCodeMenu;
import com.itca.finalpjt.domain.commoncode.enums.CommonCodeType;
import com.itca.finalpjt.domain.commoncode.repository.MenuCommonCodeQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuCommoncodeService {
    private final MenuCommonCodeQueryRepository commonCodeQueryRepository;
    private final MessageSource messageSource;

    public Map<String, List<CommonCodeMenu>> getMenuMap(String memberId) {
        Map<String, List<CommonCodeMenu>> menuMap = new HashMap<>();
        List<CommonCodeMenu> menuOneList = commonCodeQueryRepository.getMainMenuList(memberId);
//        menuOneList = convertLocaleMenuName(menuOneList);
        menuMap.put("menu_1", menuOneList);

        List<CommonCodeMenu> menuTwoList = commonCodeQueryRepository.getSubMenuList(menuOneList, CommonCodeType.MENU_1DEPTH.codeNo(), CommonCodeType.MENU_2DEPTH.codeNo());
//        menuTwoList = convertLocaleMenuName(menuTwoList);
        menuMap.put("menu_2", menuTwoList);

        List<CommonCodeMenu> parentsMenuTwoList = menuTwoList.stream()
                .filter(menuTwo -> menuTwo.getUrl().equals(""))
                .collect(Collectors.toList());

        if(parentsMenuTwoList.size() == 0) {
            menuMap.put("menu_3", null);
        } else {
            List<CommonCodeMenu> menuThreeList = commonCodeQueryRepository.getSubMenuList(parentsMenuTwoList, CommonCodeType.MENU_2DEPTH.codeNo(), CommonCodeType.MENU_3DEPTH.codeNo());
//            menuThreeList = convertLocaleMenuName(menuThreeList);
            menuMap.put("menu_3", menuThreeList);
        }

        return menuMap;
    }

    // kms : 메뉴이름 다국어적용
    public List<CommonCodeMenu> convertLocaleMenuName(List<CommonCodeMenu> menuList){
        for(var menuDto : menuList){
            String localMenuName = messageSource.getMessage(menuDto.getMenuName(), null, LocaleContextHolder.getLocale());
            menuDto.convertLocaleMenuName(localMenuName);
        }
        return menuList;
    }
}

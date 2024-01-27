package com.itca.finalpjt.domain.commoncode.service;

import com.itca.finalpjt.domain.commoncode.repository.CrawlingCommonCodeQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CrawlingCommoncodeService {
    private final CrawlingCommonCodeQueryRepository crawlingCommonCodeQueryRepository;

    public Map<String, Object> getClientCrawlingCommoncodeMap() {
        Map<String, Object> commonCodeMap = new HashMap<>();
        commonCodeMap.put("categoryList", crawlingCommonCodeQueryRepository.getCategoryList());
        commonCodeMap.put("nationList", crawlingCommonCodeQueryRepository.getNationList());
        commonCodeMap.put("permitList", crawlingCommonCodeQueryRepository.getCrawlingPermitList());
        commonCodeMap.put("puselect", crawlingCommonCodeQueryRepository.getPupuselect());
        return commonCodeMap;
    }
}

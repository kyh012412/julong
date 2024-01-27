package com.itca.finalpjt.common.config;

import lombok.Getter;

@Getter
enum CacheType {
    KEYWORD("keyword", 5, 10000),
    STOCK("stock", 5, 10000),
    ANALYSIS_JSON("analysisJson", 5, 10000),
    ANALYSIS_VALUE("analysisValue", 5, 10000),
    ANALYSIS_FILES("analysisFiles", 5, 10000),
    ANALYSIS_LIST("analysisList", 5, 1000),
    ANALYSIS_CRAWLING_ID_LIST("analysisCrawlingIdList", 5, 1000),
    ANALYSIS_ABSTRACT("analysisAbstraction", 5, 1000),
    ANALYSIS_FILE_COUNT("analysisFileCount", 5, 1000),
    TYPE_COMPANIES("typeCompanies", 5, 10000),
    COMPANY_ITEMS("companyItems", 5, 10000),
    PERSONAL_CONDITION("personalCondition", 5, 10000),
    PERSONAL_CONDITION_TYPE("personalConditionType", 5, 10000),
    CONDITION_TYPE("conditionType", 5, 1);

    CacheType(String cacheName, int expiredAfterWrite, int maximumSize) {
        this.cacheName = cacheName;
        this.expiredAfterWrite = expiredAfterWrite;
        this.maximumSize = maximumSize;
    }

    private final String cacheName;
    private final int expiredAfterWrite;
    private final int maximumSize;
}

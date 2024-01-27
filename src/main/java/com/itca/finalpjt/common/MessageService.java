package com.itca.finalpjt.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageSource messageSource;

//    : /crawlingcontrol/request/list 수집요청목록
    public String GetCrawlingRequestListMsg() throws JsonProcessingException {
        Map<String, String> msg = new HashMap<>();
        msg.put("valid_minCycle", messageSource.getMessage("valid.minCycle", null, LocaleContextHolder.getLocale()));
        msg.put("valid_nonCollectionDays", messageSource.getMessage("valid.nonCollectionDays", null, LocaleContextHolder.getLocale()));

        msg.put("req_confirmInfo", messageSource.getMessage("req.confirmInfo", null, LocaleContextHolder.getLocale()));
        msg.put("req_duplicateUrl", messageSource.getMessage("req.duplicateUrl", null, LocaleContextHolder.getLocale()));
        msg.put("req_testFirst", messageSource.getMessage("req.testFirst", null, LocaleContextHolder.getLocale()));
        msg.put("req_checkNonCollectionDays", messageSource.getMessage("req.checkNonCollectionDays", null, LocaleContextHolder.getLocale()));
        msg.put("req_pageField", messageSource.getMessage("req.pageField", null, LocaleContextHolder.getLocale()));
        msg.put("req_checkPageField", messageSource.getMessage("req.checkPageField", null, LocaleContextHolder.getLocale()));
        msg.put("req_checkMappingInfo", messageSource.getMessage("req.checkMappingInfo", null, LocaleContextHolder.getLocale()));
        msg.put("req_rejectMsg", messageSource.getMessage("req.rejectMsg", null, LocaleContextHolder.getLocale()));
        msg.put("req_checkUrl", messageSource.getMessage("req.checkUrl", null, LocaleContextHolder.getLocale()));
        msg.put("req_excelOutputFail", messageSource.getMessage("error.excelOutputFail", null, LocaleContextHolder.getLocale()));
        msg.put("req_checkXpath", messageSource.getMessage("req.checkXpath", null, LocaleContextHolder.getLocale()));
        msg.put("req_checkXpath", messageSource.getMessage("req.checkXpath", null, LocaleContextHolder.getLocale()));
        msg.put("req_checkXtraMapping", messageSource.getMessage("req.checkXtraMapping", null, LocaleContextHolder.getLocale()));

        msg.put("info_useStopKey", messageSource.getMessage("info.useStopKey", null, LocaleContextHolder.getLocale()));
        msg.put("info_useKey", messageSource.getMessage("info.useKey", null, LocaleContextHolder.getLocale()));
        msg.put("info_checkGroupName", messageSource.getMessage("info.checkGroupName", null, LocaleContextHolder.getLocale()));
        msg.put("info_checkParentsNameOnly", messageSource.getMessage("info.checkParentsNameOnly", null, LocaleContextHolder.getLocale()));
        msg.put("info_deleteData", messageSource.getMessage("info.deleteData", null, LocaleContextHolder.getLocale()));
        msg.put("info_testing", messageSource.getMessage("info.testing", null, LocaleContextHolder.getLocale()));
        msg.put("info_requestTestText", messageSource.getMessage("info.requestTestText", null, LocaleContextHolder.getLocale()));

        msg.put("error_delete", messageSource.getMessage("error.delete", null, LocaleContextHolder.getLocale()));
        msg.put("error_alreadyExistUrl", messageSource.getMessage("error.alreadyExistUrl", null, LocaleContextHolder.getLocale()));
        msg.put("error_requestFail", messageSource.getMessage("error.requestFail", null, LocaleContextHolder.getLocale()));
        msg.put("error_testFail", messageSource.getMessage("error.testFail", null, LocaleContextHolder.getLocale()));
        msg.put("error_testResultFail", messageSource.getMessage("error.testResultFail", null, LocaleContextHolder.getLocale()));
        msg.put("error_notFoundXpath", messageSource.getMessage("error.notFoundXpath", null, LocaleContextHolder.getLocale()));
        msg.put("error_save", messageSource.getMessage("error.save", null, LocaleContextHolder.getLocale()));
        msg.put("error_excelOutputFail", messageSource.getMessage("error.excelOutputFail", null, LocaleContextHolder.getLocale()));
        msg.put("error_stop", messageSource.getMessage("error.stop", null, LocaleContextHolder.getLocale()));

        msg.put("success_approve", messageSource.getMessage("success.approve", null, LocaleContextHolder.getLocale()));
        msg.put("success_save", messageSource.getMessage("success.save", null, LocaleContextHolder.getLocale()));
        msg.put("success_stop", messageSource.getMessage("success.stop", null, LocaleContextHolder.getLocale()));
        msg.put("success_complete", messageSource.getMessage("success.complete", null, LocaleContextHolder.getLocale()));
        msg.put("success_duplicatedUrl", messageSource.getMessage("success.duplicatedUrl", null, LocaleContextHolder.getLocale()));
        msg.put("success_deleteKey", messageSource.getMessage("success.deleteKey", null, LocaleContextHolder.getLocale()));
        msg.put("success_requestTest", messageSource.getMessage("success.requestTest", null, LocaleContextHolder.getLocale()));

        msg.put("confirm_stopSchedule", messageSource.getMessage("confirm.stopSchedule", null, LocaleContextHolder.getLocale()));
        msg.put("confirm_deleteSchedule", messageSource.getMessage("confirm.deleteSchedule", null, LocaleContextHolder.getLocale()));
        msg.put("confirm_deleteData", messageSource.getMessage("confirm.deleteData", null, LocaleContextHolder.getLocale()));
        msg.put("confirm_useKey", messageSource.getMessage("confirm.useKey", null, LocaleContextHolder.getLocale()));
        msg.put("confirm_useStopKey", messageSource.getMessage("confirm.useStopKey", null, LocaleContextHolder.getLocale()));
        msg.put("confirm_deleteKey", messageSource.getMessage("confirm.deleteKey", null, LocaleContextHolder.getLocale()));

        msg.put("button_save", messageSource.getMessage("button.save", null, LocaleContextHolder.getLocale()));
        msg.put("button_modify", messageSource.getMessage("button.modify", null, LocaleContextHolder.getLocale()));
        msg.put("button_cancle", messageSource.getMessage("button.cancle", null, LocaleContextHolder.getLocale()));
        msg.put("button_delete", messageSource.getMessage("button.delete", null, LocaleContextHolder.getLocale()));

        msg.put("common_request", messageSource.getMessage("common.request", null, LocaleContextHolder.getLocale()));
        msg.put("common_wait", messageSource.getMessage("common.wait", null, LocaleContextHolder.getLocale()));
        msg.put("common_approved", messageSource.getMessage("common.approved", null, LocaleContextHolder.getLocale()));
        msg.put("common_reject", messageSource.getMessage("common.reject", null, LocaleContextHolder.getLocale()));

        msg.put("common_news", messageSource.getMessage("common.news", null, LocaleContextHolder.getLocale()));
        msg.put("common_myCompany", messageSource.getMessage("common.myCompany", null, LocaleContextHolder.getLocale()));
        msg.put("common_customer", messageSource.getMessage("common.customer", null, LocaleContextHolder.getLocale()));
        msg.put("common_competitor", messageSource.getMessage("common.competitor", null, LocaleContextHolder.getLocale()));
        msg.put("common_bidding", messageSource.getMessage("common.bidding", null, LocaleContextHolder.getLocale()));
        msg.put("common_person", messageSource.getMessage("common.person", null, LocaleContextHolder.getLocale()));


        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(msg);
    }

//    : /crawlingcontrol/schedule/list 전체 스케줄 목록
    public String GetCrawlingScheduleListMsg() throws JsonProcessingException {
        Map<String, String> msg = new HashMap<>();
        msg.put("confirm_save", messageSource.getMessage("confirm.save", null, LocaleContextHolder.getLocale()));
        msg.put("confirm_deleteSchedule", messageSource.getMessage("confirm.deleteSchedule", null, LocaleContextHolder.getLocale()));
        msg.put("confirm_stopSchedule", messageSource.getMessage("confirm.stopSchedule", null, LocaleContextHolder.getLocale()));

        msg.put("error_registerFail", messageSource.getMessage("error.registerFail", null, LocaleContextHolder.getLocale()));
        msg.put("error_requestFail", messageSource.getMessage("error.requestFail", null, LocaleContextHolder.getLocale()));
        msg.put("error_delete", messageSource.getMessage("error.delete", null, LocaleContextHolder.getLocale()));
        msg.put("error_stop", messageSource.getMessage("error.stop", null, LocaleContextHolder.getLocale()));


        msg.put("success_delete", messageSource.getMessage("success.delete", null, LocaleContextHolder.getLocale()));
        msg.put("success_stop", messageSource.getMessage("success.stop", null, LocaleContextHolder.getLocale()));

        msg.put("button_save", messageSource.getMessage("button.save", null, LocaleContextHolder.getLocale()));
        msg.put("button_modify", messageSource.getMessage("button.modify", null, LocaleContextHolder.getLocale()));
        msg.put("button_cancle", messageSource.getMessage("button.cancle", null, LocaleContextHolder.getLocale()));
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(msg);
    }

    public String GetCrawlingRequestMsg() throws JsonProcessingException {
        Map<String, String> msg = new HashMap<>();
        msg.put("confirm_requestCollection", messageSource.getMessage("confirm.requestCollection", null, LocaleContextHolder.getLocale()));
        msg.put("confirm_save", messageSource.getMessage("confirm.requestCollection", null, LocaleContextHolder.getLocale()));

        msg.put("success_requestCollection", messageSource.getMessage("success.requestCollection", null, LocaleContextHolder.getLocale()));
        msg.put("success_duplicatedUrl", messageSource.getMessage("success.duplicatedUrl", null, LocaleContextHolder.getLocale()));
        msg.put("success_save", messageSource.getMessage("success.save", null, LocaleContextHolder.getLocale()));

        msg.put("info_requestCollection", messageSource.getMessage("info.requestCollection", null, LocaleContextHolder.getLocale()));
        msg.put("info_duplicateComplete", messageSource.getMessage("info.duplicateComplete", null, LocaleContextHolder.getLocale()));

        msg.put("button_goToList", messageSource.getMessage("button.goToList", null, LocaleContextHolder.getLocale()));
        msg.put("button_anotherRequest", messageSource.getMessage("button.anotherRequest", null, LocaleContextHolder.getLocale()));
        msg.put("button_save", messageSource.getMessage("button.save", null, LocaleContextHolder.getLocale()));
        msg.put("button_modify", messageSource.getMessage("button.modify", null, LocaleContextHolder.getLocale()));
        msg.put("button_cancle", messageSource.getMessage("button.cancle", null, LocaleContextHolder.getLocale()));

        msg.put("error_requestFail", messageSource.getMessage("error.requestFail", null, LocaleContextHolder.getLocale()));
        msg.put("error_idCardFail", messageSource.getMessage("error.idCardFail", null, LocaleContextHolder.getLocale()));
        msg.put("error_impossibleUrl", messageSource.getMessage("error.impossibleUrl", null, LocaleContextHolder.getLocale()));
        msg.put("error_save", messageSource.getMessage("error.save", null, LocaleContextHolder.getLocale()));
        msg.put("error_excelOutputFail", messageSource.getMessage("error.excelOutputFail", null, LocaleContextHolder.getLocale()));

        msg.put("req_notBlankUrl", messageSource.getMessage("req.notBlankUrl", null, LocaleContextHolder.getLocale()));
        msg.put("req_duplicateUrl", messageSource.getMessage("req.duplicateUrl", null, LocaleContextHolder.getLocale()));


        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(msg);
    }
}

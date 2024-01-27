package com.itca.finalpjt.common.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.util.HashMap;

/**
 * Created by Jehee on 2020-05-28.
 */
public class HttpRequest {

    public String dmzTestRequest(String url, HashMap<String, Object> map, String requestType){
        String result = "";
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String params = objectMapper.writeValueAsString(map);

            HttpHeaders httpHeaders  = new HttpHeaders();
            httpHeaders.setContentType(new MediaType("application","json",Charset.forName("UTF-8")));

            HttpEntity entity = new HttpEntity(params, httpHeaders);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            System.out.println(url + requestType + responseEntity.getStatusCode());
            // requestType 테스트 : " 테스트 수집 요청 [테스트 수집] : "
            // requestType 인물수집승인 : " 인물 수집 요청 [인물 수집] : "
//            result = UriUtils.decode(responseEntity.getBody(),"UTF-8");
            result = responseEntity.getBody();

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }


        return result;

    }

}

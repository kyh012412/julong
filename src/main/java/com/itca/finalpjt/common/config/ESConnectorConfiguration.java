package com.itca.finalpjt.common.config;

import lombok.RequiredArgsConstructor;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ESConnectorConfiguration {

    private Map<String, RestClient> restClientMap = new HashMap<>();

    public RestClient restClient(String type) {
        if (restClientMap.containsKey(type)) {
            return restClientMap.get(type);
        } else {
            RestClientBuilder builder = RestClient.builder(new HttpHost("52.188.126.241", 18200, "http"));
            RestHighLevelClient restHighLevelClient = new RestHighLevelClient(builder);
            RestClient client = restHighLevelClient.getLowLevelClient();
            restClientMap.put(type, client);
            return client;
        }
    }

    public RestHighLevelClient restHighLevelClient() {
        RestClientBuilder builder = RestClient.builder(new HttpHost("52.188.126.241", 18200, "http"));

        return new RestHighLevelClient(builder);
    }

    public RestHighLevelClient restHighLevelClientLocal(String type) {
        RestClientBuilder builder = RestClient.builder(new HttpHost("52.188.126.241", 18200, "http"));
        return new RestHighLevelClient(builder);
    }
}

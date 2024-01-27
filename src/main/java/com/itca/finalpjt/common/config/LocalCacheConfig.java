package com.itca.finalpjt.common.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static java.util.stream.Collectors.toList;

@EnableCaching
@Configuration
public class LocalCacheConfig {

    @Bean
    public CacheManager cacheManager() {
        var cacheManager = new SimpleCacheManager();
        List<CaffeineCache> caches = Arrays.stream(CacheType.values())
                .map(cache -> new CaffeineCache(cache.getCacheName(), Caffeine.newBuilder().recordStats()
                                .expireAfterWrite(cache.getExpiredAfterWrite(), TimeUnit.MINUTES)
                                .maximumSize(cache.getMaximumSize())
                                .build()
                        )
                )
                .collect(toList());
        cacheManager.setCaches(caches);
        return cacheManager;
    }
}

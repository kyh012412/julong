package com.itca.finalpjt.common.infra.logging;

import lombok.Getter;

import java.util.List;

@Getter
public class FileLogResponse {
    private List<String> adminLog;
    private long position;

    public FileLogResponse(List<String> adminLog, long position) {
        this.adminLog = adminLog;
        this.position = position;
    }
}

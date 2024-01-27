package com.itca.finalpjt.common.infra.logging;

import com.itca.finalpjt.common.util.logging.LogFileRead;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoggingService {
    private final LoggingClient loggingClient;

    public FileLogResponse adminInfoGetLogFile(FilePosition filePosition) {
        String logging = "logback-dev.log";
        return LogFileRead.readByPosition(logging, filePosition.getPosition());
    }

}

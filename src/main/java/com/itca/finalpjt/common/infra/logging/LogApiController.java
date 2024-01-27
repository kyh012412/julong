package com.itca.finalpjt.common.infra.logging;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logging")
@RequiredArgsConstructor
public class LogApiController {

    private final LoggingService loggingService;

    @PostMapping("/admin")
    public ResponseEntity<Object> adminInfo(@RequestBody FilePosition filePosition) {
        return new ResponseEntity<>(loggingService.adminInfoGetLogFile(filePosition), HttpStatus.OK);
    }

}

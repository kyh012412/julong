package com.itca.finalpjt.common.infra.logging;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("logging")
@RequiredArgsConstructor
public class LogController {

    @GetMapping("system")
    public String system(Model model) {
        return "logging/system";
    }

}

package com.itca.finalpjt.common.util.logging;

import com.itca.finalpjt.common.exception.RequestValidException;
import com.itca.finalpjt.common.infra.logging.FileLogResponse;
import com.itca.finalpjt.common.util.common.DateFormat;

import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class LogFileRead {

    public static FileLogResponse readByPosition(String logging, long position) {
        try {
            // Log File Path
            int size = 20;
            File file = new File("./logs/"+logging);

            if (position < 0) {
                LineNumberReader lr = new LineNumberReader(new FileReader(file));
                lr.skip(Long.MAX_VALUE);
                position = lr.getLineNumber();
                if (position < 0) size = (int) position;
            }

            long setPos = 0;

            List<String> fileLog = new ArrayList<>();
            if (position > size) setPos = position - size;
            // 파일 묶음 만들기
            int logSize = 0;
            StringBuilder tmp = new StringBuilder();
            do {
                BufferedReader br = new BufferedReader(new FileReader(file));
                List<String> collect = br.lines().skip(setPos).limit(size).collect(Collectors.toList());
                Collections.reverse(collect);
                boolean finsh = false;
                List<String> tmpList = new ArrayList<>();
                for (String log : collect) {
                    if (DateFormat.formDate(log.split(" ")[0]) == null) {
                        finsh = true;
                        tmp.insert(0, "\n"+log);
                        continue;
                    } else {
                        tmp.insert(0, log);
                        tmpList.add(tmp.toString());
                        tmp = new StringBuilder();
                        finsh = false;
                    }
                    logSize++;
                }
                if (finsh) logSize = 0;

                fileLog.addAll(tmpList);
                if (logSize == 0) {
                    setPos = ((setPos - size) < 0) ? 0 : (setPos - size);
                }
            } while (logSize < 1);

            return new FileLogResponse(fileLog, setPos);
        } catch (IOException e) {
            throw new RequestValidException("Log 파일이 없습니다.", "position: "+ position);
        }
    }
}

package com.itca.finalpjt.common.util;

import java.util.Arrays;
import java.util.HashSet;

public class StringUtil {
    public static String[] duplicateAndNullCheck(String[] keywords) {
        keywords = Arrays.stream(keywords)
                .filter(s -> (s != null && s.length() > 0)).toArray(String[]::new);
        keywords = new HashSet<>(Arrays.asList(keywords)).toArray(new String[0]);
        return keywords;
    }

    private static String join (String[] str) {
        return String.join(",", str);
    }

    public static String check (String str) {
        return join(duplicateAndNullCheck(str.split(",")));
    }
}

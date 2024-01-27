package com.itca.finalpjt.common.util.common;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class DateFormat {

    public static String getCurrentTime(){
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
        return date.format(new Date(System.currentTimeMillis()));

    }

    public static String getTodayCurrentTimeWithoutDay() {
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM");
        String dates = date.format(new Date(System.currentTimeMillis()));
        return dates;
    }

    public static Map<String, String> getFromWhen(Integer ago) {
        Map<String, String> map = new HashMap<>();
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat formatter = new SimpleDateFormat ("yyyy-MM-dd");
        String to = formatter.format(cal.getTime());
        cal.add(Calendar.DATE, -ago);
        String from = formatter.format(cal.getTime());

        map.put("from", from);
        map.put("to", to);
        return map;
    }

    public static Map<String, String> getFromMonth(Integer ago) {
        Map<String, String> map = new HashMap<>();
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat formatter = new SimpleDateFormat ("yyyy-MM-dd");
        String to = formatter.format(cal.getTime());

        cal.add(Calendar.MONTH, -ago);
        formatter = new SimpleDateFormat ("yyyy-MM-dd");
        String from = formatter.format(cal.getTime());

        map.put("from", from);
        map.put("to", to);
        return map;
    }

    public static Date getDiffDate(int diffMonth) throws ParseException {
        //create Calendar instance
        Calendar now = Calendar.getInstance();
        now.add(Calendar.MONTH, diffMonth);
        String diff =  now.get(Calendar.YEAR)+"-"+(now.get(Calendar.MONTH) + 1)+"-"+now.get(Calendar.DATE)+" 00:00:00";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("YYYY-MM-DD HH:mm:ss");
        return simpleDateFormat.parse(diff);
    }

    public static Date formDate(String logDate) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date parse = format.parse(logDate);
            return parse;
        } catch (ParseException e) {
            return null;
        }
    }

    public static String getformDate(Long timestamp) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Date date = new Date(timestamp);
            return format.format(date);
        } catch (Exception e) {
            return null;
        }
    }

    public static Long getTimestamp(String date) throws ParseException {
        Date converteDate = new SimpleDateFormat("mm/dd/yy").parse(date);
        return converteDate.getTime();
    }
}

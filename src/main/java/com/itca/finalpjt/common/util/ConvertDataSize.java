package com.itca.finalpjt.common.util;

public class ConvertDataSize {

    private static final long KILOBYTE = 1024L;
    private static final long MEGABYTE = KILOBYTE * 1024L;
    private static final long GIGABYTE = MEGABYTE * 1024L;
    private static final long TERABYTE = GIGABYTE * 1024L;

    public static String size(double byteSize) {
        if (byteSize < KILOBYTE) {
            return String.format("%d", (int) byteSize) + " B";
        } else if (byteSize > KILOBYTE && byteSize < MEGABYTE) {
            return String.format("%.2f", byteSize / KILOBYTE) + " KB";
        } else if (byteSize > MEGABYTE && byteSize < GIGABYTE) {
            return String.format("%.2f", byteSize / MEGABYTE) + " MB";
        } else if (byteSize > GIGABYTE && byteSize < TERABYTE) {
            return String.format("%.2f", byteSize / GIGABYTE) + " GB";
        } else {
            return String.format("%.2f", byteSize / TERABYTE) + " TB";
        }
    }

}

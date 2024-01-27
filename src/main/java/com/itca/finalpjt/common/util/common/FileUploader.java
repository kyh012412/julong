package com.itca.finalpjt.common.util.common;


import com.itca.finalpjt.exception.FileUploadFailException;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.net.URLEncoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Component
public class FileUploader {
    @Value("${spring.profiles.active}")
    private String activeProfile;
    @Value("${file.upload.path.businessCard}")
    private String fileUploadPathBusinessCard;
    @Value("${file.upload.path.profile}")
    private String fileUploadPathProfile;
    // @Value("/opt/xtrm-sales/pdfCompare/pdf_files/")
    @Value("${file.upload.path.pdf}")
    private String fileUploadPathPdfFiles;
    // @Value("/opt/xtrm-sales/data/sharedata/")
    @Value("${file.upload.path.sharedata}")
    private String fileUploadPathDataFiles;

    @Value("${file.upload.path.excelfile}")
    private String excelfilecall;

    @Value("${file.upload.path}")
    private String fileUploadPath;


    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    // 첨부파일 - community
    public String communityUploadFile(String noticd, MultipartFile file) {
        String changeFilename = "" + UUID.randomUUID();
        logger.debug("communityUploadFile changeFilename : " + changeFilename);
        String fpath = "";
        fpath = fileUploadPath;
        /*
        if ("01".equals(noticd) || "02".equals(noticd) || "03".equals(noticd)) {

            fpath = fileUploadPath;
        }else if ("05".equals(noticd))
            fpath = fileUploadPath;
        else if ("101".equals(noticd))
            fpath = fileUploadPath;
        */
        try {
            // File dest = new File(fileUploadPathProfile + changeFilename);
            // file.transferTo(dest);
            logger.debug("file ==================================");
            Path dest = Paths.get(fpath + "/" + changeFilename).toAbsolutePath();
            logger.debug("communityUploadFile file path : " + dest);
            // System.out.println("file ========================================================== ");
            // System.out.println("file communityUploadFile file path [" + dest);
            // file.transferTo(dest.toFile());
            org.springframework.util.FileCopyUtils.copy(file.getBytes(), dest.toFile());
        } catch (Exception e) {
            logger.debug("uploadError" + e.getMessage());
            //throw new FileUploadFailException();
        }
        return changeFilename;
    }

    public void board_download_file(JSONArray array, HttpServletResponse response) throws Exception {
        try {
            String fnm_ori = "", fnm = "", fpath = "", fext = "";
            for (int i = 0; i < array.size(); i++) {
                JSONObject obj = (JSONObject) array.get(i);

                fnm_ori = (String) obj.get("atchmnflnmori");
                fnm = (String) obj.get("atchmnflnm");
                fpath = (String) obj.get("atchmflpath");
                fext = (String) obj.get("atchmflext");
            }

            File downloadFile = new File(fpath + "/" + fnm);
            byte fileByte[] = FileUtils.readFileToByteArray(downloadFile);

            response.setContentType(fext);

            String title11 = new String(fnm_ori.getBytes("KSC5601"), "EUC-KR");
            title11 = URLEncoder.encode(title11, "UTF-8");

            response.setHeader("Content-Disposition", String.format("attachment;filename=%s", title11));
            response.setHeader("Set-Cookie", "fileDownload=true; path=/");


            response.getOutputStream().write(fileByte);
            response.getOutputStream().flush();
            response.getOutputStream().close();
        } finally {
            // JAVA 6에서는
            // workbook.close();
            // JAVA 7부터는 workbook.close(); 안함
        }

    }

    public void as_download_file(JSONArray array, HttpServletResponse response) throws Exception {
        try {
            String fnm_ori = "", fnm = "", fpath = "", fext = "";
            for (int i = 0; i < array.size(); i++) {
                JSONObject obj = (JSONObject) array.get(i);
                // System.out.println("========================== ===");
                // System.out.println(obj.get("atchmnflnm"));
                // System.out.println(obj.get("atchmnflnmori"));
                // System.out.println(obj.get("atchmflpath"));

                fnm_ori = (String) obj.get("atchmnflnmori");
                fnm = (String) obj.get("atchmnflnm");
                fpath = (String) obj.get("atchmnflpath");
                fext = (String) obj.get("atchmnflext");
            }

            File downloadFile = new File(fpath + "/" + fnm);
            byte fileByte[] = FileUtils.readFileToByteArray(downloadFile);

            /*
            logger.error("UTF-8 -> EUC-KR        : " + new String(fnm.getBytes("UTF-8"), "EUC-KR"));
            logger.error("UTF-8 -> KSC5601       : " + new String(fnm.getBytes("UTF-8"), "KSC5601"));
            logger.error("UTF-8 -> X-WINDOWS-949 : " + new String(fnm.getBytes("UTF-8"), "X-WINDOWS-949"));
            logger.error("UTF-8 -> ISO-8859-1    : " + new String(fnm.getBytes("UTF-8"), "ISO-8859-1"));
            logger.error("UTF-8 -> MS949         : " + new String(fnm.getBytes("UTF-8"), "MS949"));

            logger.error("ISO-8859-1 -> EUC-KR        : " + new String(fnm.getBytes("ISO-8859-1"), "EUC-KR"));
            logger.error("ISO-8859-1 -> KSC5601       : " + new String(fnm.getBytes("ISO-8859-1"), "KSC5601"));
            logger.error("ISO-8859-1 -> X-WINDOWS-949 : " + new String(fnm.getBytes("ISO-8859-1"), "X-WINDOWS-949"));
            logger.error("ISO-8859-1 -> UTF-8         : " + new String(fnm.getBytes("ISO-8859-1"), "UTF-8"));
            logger.error("ISO-8859-1 -> MS949         : " + new String(fnm.getBytes("ISO-8859-1"), "MS949"));

            logger.error("EUC-KR -> UTF-8         : " + new String(fnm.getBytes("EUC-KR"), "UTF-8"));
            logger.error("EUC-KR -> KSC5601       : " + new String(fnm.getBytes("EUC-KR"), "KSC5601"));
            logger.error("EUC-KR -> X-WINDOWS-949 : " + new String(fnm.getBytes("EUC-KR"), "X-WINDOWS-949"));
            logger.error("EUC-KR -> ISO-8859-1    : " + new String(fnm.getBytes("EUC-KR"), "ISO-8859-1"));
            logger.error("EUC-KR -> MS949         : " + new String(fnm.getBytes("EUC-KR"), "MS949"));

            logger.error("KSC5601 -> EUC-KR        : " + new String(fnm.getBytes("KSC5601"), "EUC-KR"));
            logger.error("KSC5601 -> UTF-8         : " + new String(fnm.getBytes("KSC5601"), "UTF-8"));
            logger.error("KSC5601 -> X-WINDOWS-949 : " + new String(fnm.getBytes("KSC5601"), "X-WINDOWS-949"));
            logger.error("KSC5601 -> ISO-8859-1    : " + new String(fnm.getBytes("KSC5601"), "ISO-8859-1"));
            logger.error("KSC5601 -> MS949         : " + new String(fnm.getBytes("KSC5601"), "MS949"));

            logger.error("X-WINDOWS-949 -> EUC-KR     : " + new String(fnm.getBytes("X-WINDOWS-949"), "EUC-KR"));
            logger.error("X-WINDOWS-949 -> UTF-8      : " + new String(fnm.getBytes("X-WINDOWS-949"), "UTF-8"));
            logger.error("X-WINDOWS-949 -> KSC5601    : " + new String(fnm.getBytes("X-WINDOWS-949"), "KSC5601"));
            logger.error("X-WINDOWS-949 -> ISO-8859-1 : " + new String(fnm.getBytes("X-WINDOWS-949"), "ISO-8859-1"));
            logger.error("X-WINDOWS-949 -> MS949      : " + new String(fnm.getBytes("X-WINDOWS-949"), "MS949"));

            logger.error("MS949 -> EUC-KR        : " + new String(fnm.getBytes("MS949"), "EUC-KR"));
            logger.error("MS949 -> UTF-8         : " + new String(fnm.getBytes("MS949"), "UTF-8"));
            logger.error("MS949 -> KSC5601       : " + new String(fnm.getBytes("MS949"), "KSC5601"));
            logger.error("MS949 -> ISO-8859-1    : " + new String(fnm.getBytes("MS949"), "ISO-8859-1"));
            logger.error("MS949 -> X-WINDOWS-949 : " + new String(fnm.getBytes("MS949"), "X-WINDOWS-949"));
             */
            //response.setContentType("application/pdf");
            response.setContentType(fext);
            //String title11 = new String(fnm.getBytes("KSC5601"), "ISO-8859-1");
            String title11 = new String(fnm_ori.getBytes("KSC5601"), "EUC-KR");
            // logger.error("Mdown file name [" + title11);
            // response.setHeader("Content-Disposition", "inline; filename=" + title1 + ".pdf");
            response.setHeader("Content-Disposition", String.format("attachment;filename=%s", title11));
            response.setHeader("Set-Cookie", "fileDownload=true; path=/");

            // wb.write(response.getOutputStream());
            // doc.save(response.getOutputStream());
            // doc.close();
            response.getOutputStream().write(fileByte);
            response.getOutputStream().flush();
            response.getOutputStream().close();
        } finally {
            System.out.println("sss");
            // JAVA 6에서는
            // workbook.close();
            // JAVA 7부터는 workbook.close(); 안함
        }

    }

    // 명함 이미지 업로드
    public String ocrUploadFile(Long crawlingKey, MultipartFile file) {
        String changeFilename = crawlingKey + "-" + UUID.randomUUID();

        try {
            File dest = new File(fileUploadPathBusinessCard + changeFilename);
            file.transferTo(dest);
        } catch (Exception e) {
            throw new FileUploadFailException();
        }
        return changeFilename;
    }

    // 프로필 사진 업로드
    public String userUploadFile(int memberKey, MultipartFile file) {
        String changeFilename = memberKey + "-" + UUID.randomUUID();

        try {
            File dest = new File(fileUploadPathProfile + changeFilename);
            file.transferTo(dest);
        } catch (Exception e) {
            throw new FileUploadFailException();
        }
        return changeFilename;
    }

    // PDF 파일 업로드
    public String pdfUploadFile(MultipartFile file, boolean flagBefore) {
        String changeFilename = "";

        if (flagBefore == true) {
            changeFilename = "before.pdf";
        } else {
            changeFilename = "after.pdf";
        }

        try {
            File dest = new File(fileUploadPathPdfFiles + changeFilename);
            file.transferTo(dest);
        } catch (Exception e) {
            log.info("fileUploadPathPdfFiles {}", e.getMessage());
            throw new FileUploadFailException();
        }
        return changeFilename;
    }

    //data 파일 업로드
    public String UploadFile(MultipartFile file,boolean flagBefore ) {
        //String changeFilename = UUID.randomUUID().toString();
        String changeFilename = "";
        changeFilename=file.getOriginalFilename();
        try {
            //File dest = new File(fileUploadPathPdfFiles + changeFilename);
            File dest = new File(fileUploadPathDataFiles + changeFilename);
            file.transferTo(dest);
        } catch (Exception e) {
            log.info("fileUploadPathDataFiles {}",e.getMessage());
            throw new FileUploadFailException();
        }
        return changeFilename;
    }

    // 엑셀파일 업로드
    public String userexcelFile(MultipartFile file) {

        String changeFilename = file.getName() + UUID.randomUUID() + ".xlsx";
        try {
            Path dest = Paths.get(excelfilecall + "/" + changeFilename).toAbsolutePath();
            file.transferTo(dest);
        } catch (Exception e) {
            throw new FileUploadFailException();
        }
        return changeFilename;
    }

    public String shareDataFile(MultipartFile file, boolean flagBefore) {
        String changeFilename = UUID.randomUUID().toString();
        try {
            File dest = null;
            if ("local".equals(activeProfile)) {
                Path uploadDir = Paths.get(fileUploadPathDataFiles);
                String uploadPath = uploadDir.toFile().getAbsolutePath();
                dest = new File(uploadPath + "\\" + changeFilename);
            } else
                dest = new File(fileUploadPathDataFiles + changeFilename);

            file.transferTo(dest);
        } catch (Exception e) {
            log.info("fileUploadPathDataFiles {}", e.getMessage());
            throw new FileUploadFailException();
        }
        return changeFilename;
    }

    public static void directoryConfirmAndMake(String targetDir) {
        File d = new File(targetDir);

        if (!d.exists()) {
            if (!d.mkdirs()) {
                log.error(String.format("[%s] mkdir failed. Please check permission", targetDir));
            }
        }
    }
}
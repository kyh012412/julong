package com.itca.finalpjt.domain.newsletter.controller;

import com.google.gson.JsonObject;
import com.itca.finalpjt.domain.account.service.MemberService;

import com.itca.finalpjt.domain.newsletter.service.NewsletterService;

import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Controller
@RequestMapping("/newsletter/list")
@RequiredArgsConstructor
public class NewsletterController {
    private final NewsletterService newsletterService;

    private final MemberService memberService;


    @Value("${file.upload.path.excelfile}")
    private String excelfilecall;

    @Value("${file.upload.path}")
    private String uploadpath;

    @GetMapping("")
    public String newsletterMain(Model model) {
        return "newsletter/list";
    }



    @RequestMapping(value="/uploadSummernoteImageFile", produces = "application/json; charset=utf8")
    @ResponseBody
    public String uploadSummernoteImageFile(@RequestParam("file") MultipartFile multipartFile, HttpServletRequest request )  {
        JsonObject jsonObject = new JsonObject();

        /*
         * String fileRoot = "C:\\summernote_image\\"; // 외부경로로 저장을 희망할때.
         */

        // 내부경로로 저장
        String contextRoot = new HttpServletRequestWrapper(request).getRealPath("/");
        String fileRoot = contextRoot+"resources/fileupload/";

        String originalFileName = multipartFile.getOriginalFilename();	//오리지날 파일명
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));	//파일 확장자
        String savedFileName = UUID.randomUUID() + extension;	//저장될 파일 명

        File targetFile = new File(fileRoot + savedFileName);
        try {
            InputStream fileStream = multipartFile.getInputStream();
            FileUtils.copyInputStreamToFile(fileStream, targetFile);	//파일 저장
            jsonObject.addProperty("url", "/summernote/resources/fileupload/"+savedFileName); // contextroot + resources + 저장할 내부 폴더명
            //jsonObject.addProperty("url", uploadpath + savedFileName); // contextroot + resources + 저장할 내부 폴더명
            jsonObject.addProperty("responseCode", "success");

        } catch (IOException e) {
            FileUtils.deleteQuietly(targetFile);	//저장된 파일 삭제
            jsonObject.addProperty("responseCode", "error");
            e.printStackTrace();
        }
        String a = jsonObject.toString();
        return a;
    }



}

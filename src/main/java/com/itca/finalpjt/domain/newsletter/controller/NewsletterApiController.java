package com.itca.finalpjt.domain.newsletter.controller;

import com.itca.finalpjt.common.util.common.FileUploader;
import com.itca.finalpjt.domain.account.service.MemberService;
import com.itca.finalpjt.domain.newsletter.service.NewsletterService;
import lombok.RequiredArgsConstructor;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/newsletter/")
@RequiredArgsConstructor
public class NewsletterApiController {
    private final NewsletterService newsletterService;

    private final MemberService memberService;

    @Autowired
    private FileUploader fileUploader;

    @Value("${file.upload.path.excelfile}")
    private String excelfilecall;

    @GetMapping("")
    public String newsletterMain(Model model) {

        return "newsletter/list";
    }

    @GetMapping("/list")
    public Map<String,Object> readNewsletter() {

        return newsletterService.readNewsletterList();
    }

    @DeleteMapping("/delete")
    public boolean deleteNewsletter(@RequestBody Map<String, Object> params) {

        return newsletterService.deleteNewsletterList(params);
    }


    //Service단에서 user데이터가 있는지 체크 후에 없다면 insert

    @PostMapping(value = "/add")
    //public ResponseEntity<?> addData(Principal principal,@RequestBody Newsletter request, @RequestParam(value = "file", required = false) MultipartFile file ) {
    public ResponseEntity<?> addData(@RequestParam Map<String, Object> params, Principal principal) throws Exception {
        newsletterService.newsletterInsert(params,principal);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(value = "/board-file-upload")
    public String support_board_file_upload(MultipartHttpServletRequest request) throws Exception {

        String result = "";
        if (request.getFile("board") != null && request.getFile("board").getSize() != 0) {
            System.out.println("저장");
            System.out.println("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");
            String noticd = request.getParameter("noticd");
            result = communityUploadFile(noticd, request.getFile("board"));
        }

        return result;
    }


    public String communityUploadFile(String noticd, MultipartFile file) {
        String changeFilename = fileUploader.communityUploadFile(noticd, file);
        // System.out.println("file =========================== ["+changeFilename);
        // boolean updateResult = memberQueryRepository.communityUploadFile(changeFilename, memberKey);
        // if (!updateResult) {
        // throw new IllegalArgumentException("파일을 업로드하는데 실패했습니다.");
        // }
        return changeFilename;
    }



    @RequestMapping(value = "/file", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> fileList(@RequestBody HashMap<String, Object> map) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("file", newsletterService.readFileList((Integer) map.get("filegroupid")));

        return resultMap;
    }

    // board - 첨부파일 다운로드
    @GetMapping("/board-download")
    @ResponseBody
    public List board_download(@RequestParam HashMap<String, Object> param, HttpServletResponse response) throws Exception {

        // int r = 0;
        String p = param.get("paramList").toString();
        p = p.replace("&quot;", "\"");
        JSONArray array = JSONArray.fromObject(p);
        // int[] results = new int[array.size()];
        fileUploader.board_download_file(array, response);

        return null;
    }



}

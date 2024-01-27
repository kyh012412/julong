package com.itca.finalpjt.domain.newsletter.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.itca.finalpjt.common.util.common.FileUploader;
import com.itca.finalpjt.domain.newsletter.entity.Newsletter;
import com.itca.finalpjt.domain.newsletter.entity.NewsletterFileList;
import com.itca.finalpjt.domain.newsletter.repository.NewsletterQueryRepository;
import com.itca.finalpjt.domain.newsletter.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NewsletterService {
    private final NewsletterQueryRepository newsletterQueryRepository;
    private final FileUploader fileUploader;
    private final NewsletterRepository newsletterRepository;
    @Value("${file.upload.path.profile}")
    private String fileUploadPathProfile;
    @Value("${file.upload.path}")
    private String fileUploadPath;


    public Map<String,Object> readNewsletterList() {
        List<Newsletter> list = newsletterQueryRepository.readNewsletterList();

        Map<String, Object> returnMap = new HashMap<>();
        returnMap.put("list", list);

        return returnMap;
    }

    public boolean deleteNewsletterList(Map<String, Object> params) {
        int newsletterKey = (int) params.get("newsletterKey");
        int filegroupid = (int) params.get("filegroupid");

        return newsletterQueryRepository.deleteNewsletterList(newsletterKey,filegroupid);
        
    }


    public Map<String,Object> readFileList(int filegroupid) {
        //return newsletterQueryRepository.readFileList(notino);

        List<NewsletterFileList> list = newsletterQueryRepository.readFileList(filegroupid);

        Map<String, Object> returnMap = new HashMap<>();


        for(int i=0; i<list.size(); i++){
            list.get(i).setTemp_no(i);
        }
        returnMap.put("list", list);
        return returnMap;

    }


    @Transactional
    public void newsletterInsert(Map<String, Object> request, Principal principal) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        String p = request.get("paramList").toString(); // 값
        //p = p.replace("&quot;", "\"");
        Map<String, Object> params1 = mapper.readValue(p, Map.class);

        //첨부파일 삭제
        p = request.get("delList").toString();
        //String delList = p.replace("&quot;", "\"");

        //첨부파일 추가
        p = request.get("insList").toString();
        //p = p.replace("&quot;", "\"");
        JSONArray insList = JSONArray.fromObject(p);

        //첨부파일이 여러개라면 첨부파일1~10을 insert하고 키값(유일)을 뽑는다.
        //키값을 부모테이블에 insert



        JsonParser jsonParser = new JsonParser();
        Object obj = jsonParser.parse(request.get("paramList").toString());
        JsonObject jsonObj = (JsonObject) obj;
        boolean newsletterData = false;

        if(jsonObj.get("newsletterKey").toString().replace("\"","").equals("") ==false){
            newsletterData = newsletterRepository.existsByNewsletterKey(Integer.parseInt(String.valueOf(jsonObj.get("newsletterKey")).replace("\"","")));
        }


        Newsletter newsletter = new Newsletter();

        newsletter.setSubject(jsonObj.get("subject").toString().substring(1,jsonObj.get("subject").toString().length()-1));
        newsletter.setContents(jsonObj.get("contents").toString().substring(1,jsonObj.get("contents").toString().length()-1));

        // 이미 글이 존재한다면
        // 무조건 기존 파일 삭제하고 다시 insert
        if (newsletterData) {
            //1.기존파일 삭제
            int pkKey = Integer.parseInt(params1.get("newsletterKey").toString());
            newsletterQueryRepository.newsletterFileListDelete(pkKey);
            //2.데이터 update
            newsletter.setNewsletterKey(Integer.parseInt(jsonObj.get("newsletterKey").toString().replace("\"","")));
            newsletterQueryRepository.newsletterUpdate(newsletter);
            //3.파일 insert
            //파일이 있을 경우
            if(insList.size()>0){
                //filegroupid가 없을 경우
                int groupid=0;
                if(((JSONObject) insList.get(0)).getString("filegroupid").equals("")){
                    groupid = newsletterQueryRepository.readNewsLetterFileListMax().getFilelistkey()+1;
                    newsletter.setFilegroupid(groupid);
                //filegroupid가 있을 경우
                }else{
                    groupid = ((JSONObject) insList.get(0)).getInt("filegroupid");
                    newsletter.setFilegroupid(groupid);
                }
                Newsletter newsletter2 = new Newsletter();
                newsletter2.setNewsletterKey(pkKey);
                newsletter2.setFilegroupid(groupid);
                newsletterQueryRepository.newsletterUpdateWithGroupid(newsletter);

                //파일첨부 insert
                for(int i=0; i<insList.size(); i++){
                    NewsletterFileList newsletterFileList = new NewsletterFileList();
                    newsletterFileList.setFilegroupid(groupid);
                    newsletterFileList.setAtchmflext(((JSONObject) insList.get(i)).getString("atchmflext"));
                    newsletterFileList.setAtchmnflnm(((JSONObject) insList.get(i)).getString("atchmnflnm"));
                    newsletterFileList.setAtchmnflnmori(((JSONObject) insList.get(i)).getString("atchmnflnmori"));
                    newsletterFileList.setAtchmflpath(fileUploadPath);
                    newsletterQueryRepository.newsletterFileListInsert(newsletterFileList);
                }

            }else{
                //4.파일이 없으면 newsletter filegroupid를 0으로 만들어줌.
                newsletter.setNewsletterKey(Integer.parseInt(jsonObj.get("newsletterKey").toString().replace("\"","")));
                newsletterQueryRepository.newsletterDeleteWithFileGroupId(newsletter);
            }

        //신규 insert라면 게시판 내용 insert후에 첨부파일 insert
        }else{
            //파일이 없을 경우
            if(insList.size()==0){
                newsletterQueryRepository.newsletterInsert(newsletter,principal.getName());
            //파일이 있을 경우
            }else{
                //newsletterfilelist의 맥스값 가져와서 filegroupid에 추가
                //맥스값 가져오기
                int groupid = newsletterQueryRepository.readNewsLetterFileListMax().getFilelistkey()+1;
                newsletter.setFilegroupid(groupid);
                //게시물 insert
                newsletterQueryRepository.newsletterInsert(newsletter,principal.getName());
                //파일첨부 insert
                for(int i=0; i<insList.size(); i++){
                    NewsletterFileList newsletterFileList = new NewsletterFileList();
                    newsletterFileList.setFilegroupid(groupid);
                    newsletterFileList.setAtchmflext(((JSONObject) insList.get(i)).getString("atchmflext"));
                    newsletterFileList.setAtchmnflnm(((JSONObject) insList.get(i)).getString("atchmnflnm"));
                    newsletterFileList.setAtchmnflnmori(((JSONObject) insList.get(i)).getString("atchmnflnmori"));
                    newsletterFileList.setAtchmflpath(fileUploadPath);
                    newsletterQueryRepository.newsletterFileListInsert(newsletterFileList);

                }

            }

        }


}


/*
    public void insertUserReturn(SystemUserResponse request, String memberId) {
        newsletterQueryRepository.insertUserReturn(request, memberId);
    }

    public void updateUserReturn(SystemUserResponse request, MultipartFile file, String memberId) {
        boolean result = newsletterQueryRepository.updateUserReturn(request, memberId);

        if(file.getSize() != 0) {
            String changeFilename = fileUploader.userUploadFile(request.getMemberKey(), file);
            updateFileInfo(request.getMemberKey(), changeFilename);
        }
        if(!result) {
            throw new IllegalArgumentException("저장을 실패했습니다.");
        }
    }
    public void updateFileInfo(int memberKey, String cardFile) {
        boolean updateResult = newsletterQueryRepository.updateFileInfo(fileUploadPathProfile, cardFile, memberKey);
        if(!updateResult) {
            throw new IllegalArgumentException("저장을 실패했습니다.");
        }
    }

    public void deleteUserReturn(SystemUserResponse request, String memberId) {
        boolean result = newsletterQueryRepository.deleteUserReturn(request, memberId);
        if(!result) {
            throw new IllegalArgumentException("저장을 실패했습니다.");
        }
    }
*/
}


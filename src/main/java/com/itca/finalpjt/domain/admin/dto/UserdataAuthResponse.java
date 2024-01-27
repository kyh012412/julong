package com.itca.finalpjt.domain.admin.dto;

import com.itca.finalpjt.domain.admin.entity.UserdataAuth;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@NoArgsConstructor
public class UserdataAuthResponse implements Serializable {
    private static final long serialVersionUID = -178251896371237281L;

    private int memberKey;
    private String memberinquiryright;
    private String memberpuinquiryright;

    @Builder
    public UserdataAuthResponse(UserdataAuth userdataauth) {
        this.memberKey = userdataauth.getMemberKey();
        this.memberinquiryright = userdataauth.getMemberinquiryright();
        this.memberpuinquiryright = userdataauth.getMemberpuinquiryright();
    }
}

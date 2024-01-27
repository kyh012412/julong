package com.itca.finalpjt.domain.admin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserdataAuthRequest {
    private int memberKey;
    private String memberinquiryright;
    private String memberpuinquiryright;
}

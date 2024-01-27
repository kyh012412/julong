package com.itca.finalpjt.domain.admin.service;

import com.itca.finalpjt.domain.admin.dto.UserdataAuthResponse;
import com.itca.finalpjt.domain.admin.repository.UserdataAuthQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserdataAuthService {
    private final UserdataAuthQueryRepository userdataAuthQueryRepository;

    public List<UserdataAuthResponse> inquiryRight(int memberKey) {
        return userdataAuthQueryRepository.inquiryRight(memberKey);
    }

}

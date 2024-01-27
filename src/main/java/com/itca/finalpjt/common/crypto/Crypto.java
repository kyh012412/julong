package com.itca.finalpjt.common.crypto;

public interface Crypto {
    String encrypt(String message) throws Exception;
    String decrypt(String encryptedMessage) throws Exception;
}

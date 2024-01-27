package com.itca.finalpjt.common.crypto;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;

public class AES128Crypto implements Crypto{
    //Initialization Vector Block Size
    private static final int BLOCK_SIZE = 16;
    //암호화 키 사이즈
    private static final int MINIMUM_ENCRYPT_KEY_SIZE = 16;
    //암호화 알고리즘
    private static final String ALGORITHM = "AES";
    private static final String CIPHER_TRANSFORMATION = "AES/CBC/PKCS5Padding";

    private final byte[] encryptKeyBytes;

//    public static String alg = "AES/CBC/PKCS5Padding";
//    private final String key = "123xtrm-sales456";
    //    private final String key = "01234567890123456789012345678901";
//    private final String iv = key.substring(0, 16); // 16byte

    public AES128Crypto(String encryptKey) {
        if(encryptKey == null || encryptKey.length() < MINIMUM_ENCRYPT_KEY_SIZE) {
            throw new RuntimeException(String.format("암호화 키는 최소 %d자리 이상이어야 합니다.", MINIMUM_ENCRYPT_KEY_SIZE));
        }

        //암호화키를 16자리만 자른 후 사용한다.
        encryptKeyBytes = encryptKey.substring(0, MINIMUM_ENCRYPT_KEY_SIZE).getBytes(StandardCharsets.UTF_8);
    }

    /**
     * 암호화
     * */
    public String encrypt(String message) throws Exception {
        byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);

        SecretKeySpec keySpec = new SecretKeySpec(encryptKeyBytes, ALGORITHM);
        byte[] ivBytes = createRandomIv();
        IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);

        Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);

        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
        byte[] inputBytes = new byte[BLOCK_SIZE + messageBytes.length];

        //iv 와 Plain Text를 합쳐서 암호화 한다.
        System.arraycopy(ivBytes, 0, inputBytes, 0, BLOCK_SIZE);
        System.arraycopy(messageBytes, 0, inputBytes, BLOCK_SIZE, messageBytes.length);
        return Base64.encodeBase64String(cipher.doFinal(inputBytes));
    }

    /**
     * 복호화
     * */
    public String decrypt(String encryptedMessage) throws Exception {
        byte[] msgBytes = Base64.decodeBase64(encryptedMessage);

        //암호화된 메세지 자체가 (iv + 메세지)로 되어있기 때문에 앞에서 부터 BLOCK_SIZE 만큼 잘라내어 iv를 만들고
        //나머지 부분을 잘라내서 복호화한다.
        byte[] ivBytes = Arrays.copyOfRange(msgBytes, 0, BLOCK_SIZE);
        byte[] inputBytes = Arrays.copyOfRange(msgBytes, BLOCK_SIZE, msgBytes.length);

        IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);
        SecretKeySpec keySpec = new SecretKeySpec(encryptKeyBytes, ALGORITHM);
        Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
        return new String(cipher.doFinal(inputBytes));
    }

    /**
     * Create Random Initialization Vector
     * */
    private byte[] createRandomIv(){
        SecureRandom random = new SecureRandom();
        byte[] ivBytes = new byte[BLOCK_SIZE];
        random.nextBytes(ivBytes);

        return ivBytes;
    }
}

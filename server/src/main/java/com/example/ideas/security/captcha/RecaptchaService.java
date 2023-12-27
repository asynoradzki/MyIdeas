package com.example.ideas.security.captcha;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.regex.Pattern;

@Service
public class RecaptchaService {
    @Value("${google.recaptcha.secret}")
    private String recaptchaSecret;

    private static final String GOOGLE_RECAPTCHA_VERIFY_URL =
            "https://www.google.com/recaptcha/api/siteverify";

    private static Pattern RESPONSE_PATTERN = Pattern.compile("[A-Za-z0-9_-]+");

    private final RestTemplate restTemplate;

    public RecaptchaService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean isValidCaptcha(String ip, String recaptchaResponse) {

        if(!responseSanityCheck(recaptchaResponse)) {
            return false;
        }

        String params = "?secret=" + recaptchaSecret + "&response=" + recaptchaResponse + "&remoteip=" + ip;
        String completeUrl = GOOGLE_RECAPTCHA_VERIFY_URL + params;
        CaptchaResponse resp = restTemplate.postForObject(completeUrl, null, CaptchaResponse.class);

        if(resp != null) {
            return resp.isSuccess();
        }
        return false;
    }

    private boolean responseSanityCheck(String response) {
        return StringUtils.hasLength(response) && RESPONSE_PATTERN.matcher(response).matches();
    }

}

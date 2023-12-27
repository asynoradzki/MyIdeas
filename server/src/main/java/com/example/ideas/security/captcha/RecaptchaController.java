package com.example.ideas.security.captcha;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class RecaptchaController {

    private final RecaptchaService recaptchaService;

    @PostMapping("/recaptcha")
    public ResponseEntity<?> verifyRecaptcha(
            @RequestParam(name = "g-recaptcha-response", required = false) String recaptchaResponse,
            HttpServletRequest request
    ) {

        String ip;

        try {
            ip = request.getRemoteAddr();
            if (ip.equals("0:0:0:0:0:0:0:1") || ip.equals("127.0.0.1")) {
                InetAddress hostAddress = InetAddress.getLocalHost();
                ip = hostAddress.getHostAddress();
            }
        } catch (UnknownHostException e) {
            ip = "unknown";
        }

        return ResponseEntity.ok(recaptchaService.isValidCaptcha(ip, recaptchaResponse));
    }

}

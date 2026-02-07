package com.example.gateway;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ProfileController {

    @GetMapping("/profile")
    public Mono<Map<String, Object>> profile(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        }

        Map<String, Object> profile = new HashMap<>();
        profile.put("authenticated", true);
        profile.put("name", principal.getAttribute("name"));
        profile.put("email", principal.getAttribute("email"));
        profile.put("picture", principal.getAttribute("picture"));
        return Mono.just(profile);
    }
}

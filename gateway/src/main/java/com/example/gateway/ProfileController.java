package com.example.gateway;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ProfileController {

    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> profile(@AuthenticationPrincipal OidcUser user) {
        if (user == null) return ResponseEntity.status(401).build();
        String name = user.getFullName() != null ? user.getFullName() : user.getName();
        return ResponseEntity.ok(Map.of(
            "name", name != null ? name : "",
            "email", user.getEmail() != null ? user.getEmail() : ""
        ));
    }
}

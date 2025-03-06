# 解决CORS跨域问题指南

## 问题描述

前端应用（运行在 `http://localhost:8080`）尝试访问后端API（位于 `http://192.168.194.9:8080`），但由于跨域安全策略，请求被阻止了。

错误信息：
```
Access to XMLHttpRequest at 'http://192.168.194.9:8080/api/user/register' from origin 'http://localhost:8080' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

后端日志显示：
```
2025-03-06 14:56:07.503 [http-nio-8080-exec-1] DEBUG org.springframework.web.servlet.DispatcherServlet-OPTIONS "/api/user/register", parameters={}
2025-03-06 14:56:07.503 [http-nio-8080-exec-1] DEBUG o.s.w.s.m.m.a.RequestMappingHandlerMapping-Mapped to com.yiguang.controller.UserController#register(RegisterDTO)
2025-03-06 14:56:07.504 [http-nio-8080-exec-1] DEBUG org.springframework.web.servlet.DispatcherServlet-Completed 403 FORBIDDEN
```

## 解决方案（Spring Boot后端）

### 方案1：添加CORS配置类

在Spring Boot项目中创建一个CORS配置类：

```java
package com.yiguang.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 允许的来源，可以是具体的域名，也可以是*表示所有
        config.addAllowedOrigin("http://localhost:8080"); // 允许本地前端
        config.addAllowedOrigin("http://localhost:8081"); // 如果有其他前端地址，也可以添加
        // config.addAllowedOrigin("*"); // 或者允许所有来源（不推荐生产环境使用）
        
        // 允许的HTTP方法
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        
        // 允许的头信息
        config.addAllowedHeader("*");
        
        // 是否允许发送Cookie
        config.setAllowCredentials(true);
        
        // 预检请求的有效期，单位为秒
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### 方案2：使用@CrossOrigin注解

在控制器类或方法上添加@CrossOrigin注解：

```java
package com.yiguang.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:8080"}, allowCredentials = "true")
public class UserController {

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        // 注册逻辑
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        // 登录逻辑
    }
}
```

### 方案3：在WebMvcConfigurer中配置

```java
package com.yiguang.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## 临时解决方案（前端）

在后端解决CORS问题之前，前端已经实现了临时解决方案：

1. 使用本地存储模拟用户注册和登录
2. 注册的用户信息存储在浏览器的localStorage中
3. 登录时会先检查localStorage中是否有匹配的用户信息

### 测试账号

默认测试账号：
- 手机号：13800138000
- 密码：123456

## 恢复API请求

一旦后端CORS问题解决，只需要取消注释前端代码中的API请求部分，并注释掉临时解决方案部分即可恢复正常的API交互。 
package com.example.purchases.messaging;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Bean
    public Queue notificationQueue() {
        return new Queue("notificaciones_queue", true);
    }
}
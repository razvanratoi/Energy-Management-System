package org.example;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeoutException;

public class Main {
    public static void main(String[] args) {

        UUID deviceId = UUID.fromString("7e75e251-8203-4c6c-8bb5-8db9bfa0b9fd");
        List<Float> records = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader("sensor.csv"))) {
            String line;
            while ((line = br.readLine()) != null) {
                Float value = Float.parseFloat(line);
                records.add(value);
            }
        } catch (IOException e) {
            System.out.println("error reading");
        }

        ConnectionFactory factory = new ConnectionFactory();
        try {
            factory.setUri("amqps://qinwybqg:TJQeSID2VvIIwQReWqshX6aymy-3Qljl@rat.rmq2.cloudamqp.com/qinwybqg");
        } catch (URISyntaxException | KeyManagementException | NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        Connection connection = null;
        try {
            connection = factory.newConnection();
            Channel channel = connection.createChannel();
            int index = 52;
            channel.queueDeclare("device_consumption", false, false, false, null);
            while(index < records.size()) {
                Float consumption = records.get(index++);
                long timestamp = System.currentTimeMillis() + 30 * 60 * 1000;
                String jsonObj = String.format("{ \"timestamp\": \"%s\", \"device_id\": \"%s\", \"measurement_value\": %s }",
                        timestamp, deviceId, consumption.toString());
                channel.basicPublish("", "device_consumption", null, jsonObj.getBytes());
                System.out.println(jsonObj);
                Thread.sleep(15000);
            }

            channel.close();
            connection.close();
        } catch (InterruptedException | IOException | TimeoutException e) {
            throw new RuntimeException(e);
        }


    }
}
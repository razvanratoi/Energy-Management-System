using System.Globalization;
using System.Text;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MonitoringMicroserviceNET.Models;
using MonitoringMicroserviceNET.Services;
using RabbitMQ.Client;
using System.Numerics;
using Microsoft.AspNetCore.SignalR;
using MonitoringMicroserviceNET.Hubs;
using RabbitMQ.Client.Events;

namespace MonitoringMicroservice.Consumers;

public class Consumer
{
    private readonly MonitoringService _monitoringService;
    private readonly LimitService _limitService;
    private readonly IHubContext<NotificationHub> _hubContext;

    private readonly string _ConsumptionUri =
        "amqps://qinwybqg:TJQeSID2VvIIwQReWqshX6aymy-3Qljl@rat.rmq2.cloudamqp.com/qinwybqg";

    private readonly string _DeviceUri =
        "amqps://ajwoanau:hR_GqkrxZMzGYdHQv3_J9fF6QI9AB1Hm@rattlesnake.rmq.cloudamqp.com/ajwoanau";

    public Consumer(MonitoringService monitoringService, LimitService limitService, IHubContext<NotificationHub> hubContext)
    {
        _monitoringService = monitoringService;
        _limitService = limitService;
        _hubContext = hubContext;
    }

    public void ConsumeMessages()
    {
        var factory = new ConnectionFactory
        {
            Uri = new Uri(_ConsumptionUri)
        };

        var connection = factory.CreateConnection();
        var channel = connection.CreateChannel();
        
        channel.QueueDeclare("device_consumption", durable: false, exclusive: false, autoDelete: false, arguments: null);
        var consumer = new EventingBasicConsumer(channel);
        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            Console.WriteLine(message);

            var monitoring = GetMonitoring(message);
            _monitoringService.CreateMonitoring(monitoring);
            CheckConsumption(monitoring);
        };

        channel.BasicConsume("device_consumption", true, consumer);
        
        
        var factory2 = new ConnectionFactory
        {
            Uri = new Uri(_DeviceUri)
        };
        var connection2 = factory2.CreateConnection();
        var channel2 = connection2.CreateChannel();
        channel2.QueueDeclare("max_queue", durable: false, exclusive: false, autoDelete: false, arguments: null);
        var consumer2 = new EventingBasicConsumer(channel2);
        consumer2.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

            var limit = GetLimit(message);
            Console.WriteLine(limit);

            var dbLimit = _limitService.GetLimitByDevice(limit.DeviceId);
            
            if(dbLimit.Equals(null))
            {
                Limit createResult;
                createResult = _limitService.CreateLimit(limit);
                Console.WriteLine("Created: " + createResult);
            }
            else 
                _limitService.UpdateLimit(limit);

            dbLimit = _limitService.GetLimitByDevice(limit.DeviceId);
            Console.WriteLine("Created: " + dbLimit);
        }; 
        channel2.BasicConsume("max_queue", true, consumer2);
    }


    private Monitoring GetMonitoring(string message)
    {
        int timestampIndex = message.IndexOf("\"timestamp\":") + "\"timestamp\":".Length + 2;
        int deviceIdIndex = message.IndexOf("\"device_id\":") + "\"device_id\":".Length + 2;
        int measurementIndex = message.IndexOf("\"measurement_value\":") + "\"measurement_value\":".Length + 1;
        
        string timestampString = message.Substring(timestampIndex, message.IndexOf("\",", timestampIndex) - timestampIndex);
        string deviceIdString = message.Substring(deviceIdIndex, message.IndexOf("\",", deviceIdIndex) - deviceIdIndex);
        string measurementString = message.Substring(measurementIndex, message.IndexOf("}", measurementIndex) - measurementIndex);
        long timestamp = long.Parse(timestampString);

        Guid deviceId = Guid.Parse(deviceIdString);
        double measurement = double.Parse(measurementString);
        return new Monitoring(timestamp, deviceId, measurement);
    }

    private Limit GetLimit(string message)
    {
        int deviceIdIndex = message.IndexOf("\"device_id\":") + "\"device_id\":".Length + 2;
        int maxConsumptionIndex = message.IndexOf("\"max_consumption\":") + "\"max_consumption\":".Length + 2;

        string deviceIdString = message.Substring(deviceIdIndex, message.IndexOf("\",", deviceIdIndex) - deviceIdIndex);
        string maxConsumptionString = message.Substring(maxConsumptionIndex, message.IndexOf("}", maxConsumptionIndex) - maxConsumptionIndex - 1);

        Guid deviceId = Guid.Parse(deviceIdString);
        double maxConsumption = double.Parse(maxConsumptionString);

        return new Limit(deviceId, maxConsumption);
    }

    private void CheckConsumption(Monitoring monitoring)
    {
        var maxConsumption = _limitService.GetLimitByDevice(monitoring.DeviceId).MaxHourlyConsumption;

        Console.WriteLine("Comparing " + monitoring.Consumption + " to " + maxConsumption + " for device " + monitoring.DeviceId);
        if (monitoring.Consumption > maxConsumption)
        {
            _hubContext.Clients.All.SendAsync("NotifyFrontend", $"Max consumption reached for device {monitoring.DeviceId}");
        }
    }
    
}

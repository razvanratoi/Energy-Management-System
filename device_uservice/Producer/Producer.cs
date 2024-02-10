using System.Text;
using DeviceMicroservice.Models;
using RabbitMQ.Client;

namespace DeviceMicroservice.Producer;

public class Producer
{
    private const string Url =
        "amqps://ajwoanau:hR_GqkrxZMzGYdHQv3_J9fF6QI9AB1Hm@rattlesnake.rmq.cloudamqp.com/ajwoanau";

    public void AlertDeviceCreation(Device device)
    {
        var factory = new ConnectionFactory
        {
            Uri = new Uri(Url)
        };
        
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateChannel();
        
        channel.QueueDeclare("max_queue", durable: false, exclusive: false, autoDelete: false, arguments: null);
        
        var message = $"{{\"device_id\": \"{device.Id}\", \"max_consumption\": \"{device.MaxHourlyConsumption}\"}}";
        var body = Encoding.UTF8.GetBytes(message);
        BasicProperties props = new BasicProperties();
        channel.BasicPublish("", "max_queue", props, body);
        
    }

}
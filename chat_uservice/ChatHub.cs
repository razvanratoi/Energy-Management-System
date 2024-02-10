using Microsoft.AspNetCore.SignalR;

namespace ChatMicroservice;

public class ChatHub : Hub
{
    public async void AlertTyping(Message message)
    {
        await Clients.All.SendAsync("ReceiveAlertTyping", message);
    }

    public async void SendMessage(Message message)
    {
        Console.WriteLine(message.Content);
        await Clients.All.SendAsync("ReceiveMessage", message);
        Console.WriteLine("Message sent");
    }

    public async void SeenMessage(Message message)
    {
        await Clients.All.SendAsync("ReceiveSeenMessage", message);
    }
}
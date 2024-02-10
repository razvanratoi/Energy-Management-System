using ChatMicroservice;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod().WithHeaders("X-Requested-With", "Content-Type");
        });
});

builder.Services.AddSignalR();


var app = builder.Build();

app.UseCors("Frontend");
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2),
    AllowedOrigins = { "*" }
    
};

app.UseWebSockets(webSocketOptions);

app.MapHub<ChatHub>("/chatHub");

app.Run();
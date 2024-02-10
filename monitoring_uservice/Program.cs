using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MonitoringMicroservice.Consumers;
using MonitoringMicroserviceNET.Data;
using MonitoringMicroserviceNET.Hubs;
using MonitoringMicroserviceNET.Repos;
using MonitoringMicroserviceNET.Services;

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

builder.Services.AddDbContext<MonitoringDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddSignalR();
builder.Services.AddScoped<MonitoringRepo>();
builder.Services.AddScoped<LimitRepo>();
builder.Services.AddScoped<MonitoringService>();
builder.Services.AddScoped<LimitService>();
builder.Services.AddControllers();

var app = builder.Build();

var monitoringService = app.Services.GetRequiredService<MonitoringService>();
var limitService = app.Services.GetRequiredService<LimitService>();
var hub = app.Services.GetRequiredService<IHubContext<NotificationHub>>();
var consumer = new Consumer(monitoringService, limitService, hub);
consumer.ConsumeMessages();

app.UseCors("Frontend");
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2),
    AllowedOrigins = { "*" }
    
};

app.UseWebSockets(webSocketOptions);
app.MapHub<NotificationHub>("/notificationHub");

app.MapControllers();
app.Run();
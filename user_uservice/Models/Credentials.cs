namespace UsersMicroservice.Models;

public class Credentials
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public Credentials(string username, string password)
    {
        Username = username;
        Password = password;
    }
}
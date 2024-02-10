using Crypt = BCrypt.Net.BCrypt;

namespace UsersMicroservice.Services;

public class PasswordService
{
    public string GenerateSalt()
    {
        return Crypt.GenerateSalt(10);
    }

    public string HashPassword(string Password, string Salt){
        return Crypt.HashPassword(Password, Salt);
    }

    public bool CheckPassword(string Password, string Salt, string DbHashedPassword)
    {
        return Crypt.HashPassword(Password, Salt) == DbHashedPassword;
    }
}
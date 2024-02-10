using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using UsersMicroservice.Models;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace UsersMicroservice.Services;

public class JwtTokenService
{
    private const int JwtTokenExpireTime = 60;
    private readonly IConfiguration _config;

    public JwtTokenService(IConfiguration config)
    {
        _config = config;
    }

    public string CreateToken(User entity)
    {
        var expiration = DateTime.UtcNow.AddMinutes(JwtTokenExpireTime);
        var token = new JwtSecurityToken(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            CreateClaims(entity),
            expires: expiration,
            signingCredentials: CreateSigningCredentials()
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(token);
    }

    private List<Claim> CreateClaims(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Sub, "UserAuthentificationToken"),
            new(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
            new(JwtRegisteredClaimNames.Exp, DateTime.UtcNow.AddMinutes(JwtTokenExpireTime).ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Role, user.Role)
        };

        return claims;
    }

    private SigningCredentials CreateSigningCredentials()
    {
        return new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            ),
            SecurityAlgorithms.HmacSha256
        );
    }

    public Guid GetUserIdFromToken(HttpContext context)
    {
        if (context == null || context.Request == null || context.Request.Headers == null)
            throw new InvalidOperationException("HttpContext or its properties are null.");

        string token = context.Request.Headers["Authorization"]!;
        if (string.IsNullOrEmpty(token))
            throw new InvalidOperationException("Authorization header is missing or empty.");

        token = token.Replace("Bearer", "").Trim();

        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = (JwtSecurityToken)tokenHandler.ReadToken(token);

        return new Guid(securityToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
    }
}
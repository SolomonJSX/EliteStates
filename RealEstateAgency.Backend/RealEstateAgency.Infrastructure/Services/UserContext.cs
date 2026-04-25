using Microsoft.AspNetCore.Http;
using RealEstateAgency.Application.Interfaces;
using System.Security.Claims;

namespace RealEstateAgency.Infrastructure.Services;

public class UserContext(IHttpContextAccessor httpContextAccessor) : IUserContext
{
    public string? Id => httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
}
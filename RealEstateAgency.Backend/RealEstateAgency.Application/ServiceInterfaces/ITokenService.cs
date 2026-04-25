using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(ApplicationUser user, IList<string> roles);
}
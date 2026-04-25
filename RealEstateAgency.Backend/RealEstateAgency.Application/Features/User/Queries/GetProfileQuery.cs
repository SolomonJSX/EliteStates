using MediatR;
using RealEstateAgency.Application.DTOs;

namespace RealEstateAgency.Application.Features.User.Queries;

public record GetProfileQuery(string UserId) : IRequest<UserProfileDto>;
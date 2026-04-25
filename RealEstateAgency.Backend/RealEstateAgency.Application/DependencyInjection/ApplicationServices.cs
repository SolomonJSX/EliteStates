using Microsoft.Extensions.DependencyInjection;
using RealEstateAgency.Application.Features.Objects.Queries;

namespace RealEstateAgency.Application.DependencyInjection;

public static class ApplicationServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // В Program.cs проекта Api
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(GetObjectsByStreetQuery).Assembly));
        return services;
    }
}
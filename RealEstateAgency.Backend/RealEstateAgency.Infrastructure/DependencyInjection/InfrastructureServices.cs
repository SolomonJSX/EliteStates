using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RealEstateAgency.Infrastructure.Persistence;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Infrastructure.Repositories;
using RealEstateAgency.Infrastructure.Services;

namespace RealEstateAgency.Infrastructure.DependencyInjection
{
    public static class InfrastructureServices
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IIdentityService, IdentityService>();
            services.AddScoped<ILookupsService, LookupsService>();
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddScoped<IRealEstateService, RealEstateService>();
            services.AddHttpContextAccessor();
            services.AddScoped<IUserContext, UserContext>();
            
            return services;
        }
    }
}

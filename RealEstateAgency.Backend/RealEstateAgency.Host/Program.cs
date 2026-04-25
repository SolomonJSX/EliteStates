using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RealEstateAgency.Application.DependencyInjection;
using RealEstateAgency.Domain.Entities;
using RealEstateAgency.Infrastructure.DependencyInjection;
using RealEstateAgency.Infrastructure.Persistence;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Адрес твоего фронтенда
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // Разрешаем передачу кук/авторизации, если понадобится
    });
});

builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // 100 МБ (выставь сколько нужно)
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 104857600; // 100 МБ
});

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddAuthentication(options => {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();

app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    // Генерируем эндпоинт для спецификации (/openapi/v1.json)
    app.MapOpenApi(); 
    
    // Подключаем сам интерфейс Scalar
    app.MapScalarApiReference(options => 
    {
        options
            .WithTitle("EliteStates API")
            .WithTheme(ScalarTheme.Purple) // Можно выбрать: DeepSpace, Mars, Moon и т.д.
            .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}

app.UseCors("AllowNextJS");

app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

    // 1. Сначала роли
    string[] roles = { "Admin", "Employee", "Client" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }

    // 2. Затем наполняем Районы (Districts)
    if (!await context.Districts.AnyAsync())
    {
        context.Districts.AddRange(
            new District { Name = "Юго-Восток" },
            new District { Name = "Центр" },
            new District { Name = "Майкудук" },
            new District { Name = "Пришахтинск" } // Карагандинский колорит
        );
    }

    // 3. Типы недвижимости (PropertyTypes)
    if (!await context.PropertyTypes.AnyAsync())
    {
        context.PropertyTypes.AddRange(
            new PropertyType { Name = "Квартира" },
            new PropertyType { Name = "Дом" },
            new PropertyType { Name = "Офис" },
            new PropertyType { Name = "Участок" }
        );
    }
    
    // 4. Типы операций (OperationTypes) - Купля/Продажа/Аренда
    if (!await context.OperationTypes.AnyAsync())
    {
        context.OperationTypes.AddRange(
            new OperationType { Name = "Продажа" },
            new OperationType { Name = "Аренда" }
        );
    }

    // Сохраняем все справочники разом
    await context.SaveChangesAsync();

    // 5. Создаем админа, если его нет
    var adminEmail = "admin@elite.kz";
    if (await userManager.FindByEmailAsync(adminEmail) == null)
    {
        var admin = new ApplicationUser { UserName = adminEmail, Email = adminEmail, CreatedAt = DateTime.UtcNow };
        await userManager.CreateAsync(admin, "Admin123!");
        await userManager.AddToRoleAsync(admin, "Admin");
    }
}

app.MapControllers();

app.Run();

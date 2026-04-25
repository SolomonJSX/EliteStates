using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    // Таблицы
    public DbSet<Client> Clients { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<District> Districts { get; set; }
    public DbSet<PropertyType> PropertyTypes { get; set; }
    public DbSet<OperationType> OperationTypes { get; set; }
    public DbSet<RealEstateObject> RealEstateObjects { get; set; }
    public DbSet<Contract> Contracts { get; set; }
    public DbSet<RealEstatePhoto> RealEstatePhotos { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Настройка точности для денежных полей
        builder.Entity<RealEstateObject>()
            .Property(r => r.Price)
            .HasColumnType("decimal(18,2)");

        builder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasColumnType("decimal(18,2)");

        // Отношение "Владелец объекта" (Client -> RealEstateObject)
        builder.Entity<RealEstateObject>()
            .HasOne(r => r.Owner)
            .WithMany()
            .HasForeignKey(r => r.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Настройка контрактов (каскадное удаление лучше ограничить, чтобы не потерять историю)
        builder.Entity<Contract>()
            .HasOne(c => c.Client)
            .WithMany()
            .HasForeignKey(c => c.ClientId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // Сидинг начальных данных (Lookup-таблицы)
        builder.Entity<PropertyType>().HasData(
            new PropertyType { Id = 1, Name = "Квартира" },
            new PropertyType { Id = 2, Name = "Дом" },
            new PropertyType { Id = 3, Name = "Офис" }
        );

        builder.Entity<OperationType>().HasData(
            new OperationType { Id = 1, Name = "Продажа" },
            new OperationType { Id = 2, Name = "Аренда" }
        );
    }
}
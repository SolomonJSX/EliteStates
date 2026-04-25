using MediatR;
using RealEstateAgency.Application.Features.Contracts.Commands;
using RealEstateAgency.Application.Interfaces;
using RealEstateAgency.Domain.Entities;

namespace RealEstateAgency.Application.Features.Contracts.Handlers;

public class CreateContractHandler(
    IGenericRepository<Contract> contractRepo,
    IGenericRepository<RealEstateObject> objectRepo,
    IGenericRepository<Employee> employeeRepo,
    IUserContext userContext) : IRequestHandler<CreateContractCommand, int>
{
    public async Task<int> Handle(CreateContractCommand request, CancellationToken cancellationToken)
    {
        // 1. Ответственность Сотрудника: ищем профиль сотрудника по UserId из токена
        var userId = userContext.Id;
        if (string.IsNullOrEmpty(userId)) 
            throw new UnauthorizedAccessException("Пользователь не авторизован.");

        // Используем FindAsync вместо несуществующего GetByUserIdAsync
        var employees = await employeeRepo.FindAsync(e => e.UserId == userId);
        var employee = employees.FirstOrDefault();
    
        if (employee == null) 
            throw new UnauthorizedAccessException("У вас нет профиля сотрудника для регистрации сделок.");

        // 2. Ответственность Системы: проверка объекта
        var realEstate = await objectRepo.GetByIdAsync(request.RealEstateObjectId);
        if (realEstate == null)
            throw new InvalidOperationException("Объект не найден.");
            
        if (realEstate.Status != "Active")
            throw new InvalidOperationException("Объект уже продан, сдан или находится на модерации.");

        // 3. Создание связи (Контракт — это мост между всеми участниками)
        var contract = new Contract
        {
            DateCreated = DateTime.UtcNow,
            RealEstateObjectId = request.RealEstateObjectId,
            ClientId = request.ClientId,      // Сторона A: Покупатель (выбран из базы)
            EmployeeId = employee.Id,         // Сторона B: Агент (текущий юзер)
            OperationTypeId = request.OperationTypeId,
            DurationMonths = request.DurationMonths,
            Note = request.Note
        };

        // 4. Завершение: объект меняет статус и "улетает" из каталога
        // 1 - Продажа -> Sold, остальное -> Rented
        realEstate.Status = request.OperationTypeId == 1 ? "Sold" : "Rented";
    
        await contractRepo.AddAsync(contract);
        
        // В твоем интерфейсе Update возвращает void, так что просто вызываем
        objectRepo.Update(realEstate); 
        
        // Сохраняем всё скопом
        await contractRepo.SaveChangesAsync();
        await objectRepo.SaveChangesAsync();

        return contract.Id;
    }
}
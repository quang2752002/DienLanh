using Dms.Domain.Entities;

namespace Dms.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Category> Categories { get; }
        IGenericRepository<Menu> Menus { get; }
        IGenericRepository<SystemSetting> SystemSettings { get; }
        Task<int> CompleteAsync();
    }
}

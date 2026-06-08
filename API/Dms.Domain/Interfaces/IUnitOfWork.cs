using Dms.Domain.Entities;

namespace Dms.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Category> Categories { get; }
        IGenericRepository<ServiceDevice> ServiceDevices { get; }
        IGenericRepository<Menu> Menus { get; }
        IGenericRepository<SystemSetting> SystemSettings { get; }
        IGenericRepository<Tip> Tips { get; }
        Task<int> CompleteAsync();
    }
}

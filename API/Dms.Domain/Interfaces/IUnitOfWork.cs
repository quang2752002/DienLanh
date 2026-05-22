using Dms.Domain.Entities;

namespace Dms.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Category> Categories { get; }
        IGenericRepository<ServiceDevice> ServiceDevices { get; }
        Task<int> CompleteAsync();
    }
}

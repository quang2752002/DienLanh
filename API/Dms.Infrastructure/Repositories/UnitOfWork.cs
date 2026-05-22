using Dms.Domain.Entities;
using Dms.Domain.Interfaces;
using Dms.Infrastructure.Persistence;

namespace Dms.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IGenericRepository<Category>? _categories;
        private IGenericRepository<ServiceDevice>? _serviceDevices;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<Category> Categories => 
            _categories ??= new GenericRepository<Category>(_context);

        public IGenericRepository<ServiceDevice> ServiceDevices => 
            _serviceDevices ??= new GenericRepository<ServiceDevice>(_context);

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}

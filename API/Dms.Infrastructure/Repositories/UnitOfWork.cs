using Dms.Domain.Entities;
using Dms.Domain.Interfaces;
using Dms.Infrastructure.Persistence;

namespace Dms.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IGenericRepository<Category>? _categories;
        private IGenericRepository<Menu>? _menus;
        private IGenericRepository<SystemSetting>? _systemSettings;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<Category> Categories => 
            _categories ??= new GenericRepository<Category>(_context);

        public IGenericRepository<Menu> Menus => 
            _menus ??= new GenericRepository<Menu>(_context);

        public IGenericRepository<SystemSetting> SystemSettings => 
            _systemSettings ??= new GenericRepository<SystemSetting>(_context);

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

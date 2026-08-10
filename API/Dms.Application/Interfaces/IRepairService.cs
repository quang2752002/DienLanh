using Dms.Application.DTOs;
using Dms.Domain.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Dms.Application.Interfaces
{
    public interface IRepairService
    {
        Task<IEnumerable<RepairDto>> GetAllAsync();
        Task<RepairDto?> GetByIdAsync(int id);
        Task<PagedResult<RepairDto>> GetPagedAsync(RepairFilterDto filter);
        Task<RepairDto> CreateAsync(CreateRepairDto dto);
        Task<RepairDto?> UpdateAsync(int id, UpdateRepairDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

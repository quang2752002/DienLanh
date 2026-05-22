using Dms.Domain.Common;

namespace Dms.Domain.Entities
{
    public class ServiceDevice : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string? ModelNumber { get; set; }
        public string? SerialNumber { get; set; }
        public string? Description { get; set; }
        public string CategoryId { get; set; } = string.Empty;
        public Category? Category { get; set; }
    }
}

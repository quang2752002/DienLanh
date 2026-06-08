using Dms.Domain.Common;

namespace Dms.Domain.Entities
{
    public class Tip : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Author { get; set; } = "Kỹ thuật viên DMS";
        public bool IsActive { get; set; } = true;
    }
}

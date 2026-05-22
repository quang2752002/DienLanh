using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dms.Domain.Common
{
    public abstract class BaseEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public DateTime? Created { get; set; }
        public string? CreatedBy { get; set; }
        public string? LastModifiedBy { get; set; }
        public DateTime? LastModified { get; set; }
    }
}

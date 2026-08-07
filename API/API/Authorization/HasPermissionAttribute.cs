using Microsoft.AspNetCore.Authorization;

namespace API.Authorization
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class HasPermissionAttribute : AuthorizeAttribute
    {
        public HasPermissionAttribute(string permission)
            : base(policy: permission)
        {
        }
    }
}

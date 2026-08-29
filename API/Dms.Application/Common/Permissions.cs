namespace Dms.Application.Common
{
    public static class Permissions
    {
        public static class Categories
        {
            public const string View = "Permissions.Categories.View";
            public const string Create = "Permissions.Categories.Create";
            public const string Edit = "Permissions.Categories.Edit";
            public const string Delete = "Permissions.Categories.Delete";
        }

        public static class Repairs
        {
            public const string View = "Permissions.Repairs.View";
            public const string Create = "Permissions.Repairs.Create";
            public const string Edit = "Permissions.Repairs.Edit";
            public const string Delete = "Permissions.Repairs.Delete";
        }

        public static class Users
        {
            public const string View = "Permissions.Users.View";
            public const string Create = "Permissions.Users.Create";
            public const string Edit = "Permissions.Users.Edit";
            public const string Delete = "Permissions.Users.Delete";
            public const string ManageRoles = "Permissions.Users.ManageRoles";
        }

        public static class Menus
        {
            public const string View = "Permissions.Menus.View";
            public const string Create = "Permissions.Menus.Create";
            public const string Edit = "Permissions.Menus.Edit";
            public const string Delete = "Permissions.Menus.Delete";
        }

        public static class SystemSettings
        {
            public const string View = "Permissions.SystemSettings.View";
            public const string Edit = "Permissions.SystemSettings.Edit";
        }

        private static readonly List<string> _allPermissions = typeof(Permissions)
            .GetNestedTypes(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static)
            .SelectMany(type => type.GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.FlattenHierarchy))
            .Where(field => field.IsLiteral && !field.IsInitOnly && field.FieldType == typeof(string))
            .Select(field => (string)field.GetValue(null)!)
            .ToList();

        /// <summary>
        /// Tự động lấy toàn bộ hằng số Permission bằng Reflection (Chỉ quét 1 lần và Cache lại)
        /// Khi thêm Module/Permission mới, hàm này tự động nhận mà KHÔNG cần sửa code.
        /// </summary>
        public static List<string> GetAllPermissions() => _allPermissions;
    }
}

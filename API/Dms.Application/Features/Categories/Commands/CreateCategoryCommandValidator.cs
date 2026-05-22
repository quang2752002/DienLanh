using FluentValidation;

namespace Dms.Application.Features.Categories.Commands
{
    public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
    {
        public CreateCategoryCommandValidator()
        {
            RuleFor(v => v.Name)
                .NotEmpty().WithMessage("Tên danh mục không được phép bỏ trống.")
                .MaximumLength(150).WithMessage("Tên danh mục không được vượt quá 150 ký tự.");
                
            RuleFor(v => v.Description)
                .MaximumLength(500).WithMessage("Mô tả danh mục không được vượt quá 500 ký tự.");
        }
    }
}

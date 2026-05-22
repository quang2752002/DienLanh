using Dms.Application.DTOs;
using Dms.Domain.Entities;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Categories.Commands
{
    public record CreateCategoryCommand : IRequest<CategoryDto>
    {
        public string Name { get; init; } = string.Empty;
        public string? Description { get; init; }
    }

    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CategoryDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateCategoryCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = new Category
            {
                Name = request.Name,
                Description = request.Description,
                IsActive = true,
                Created = DateTime.UtcNow
            };

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.CompleteAsync();

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                Created = category.Created
            };
        }
    }
}

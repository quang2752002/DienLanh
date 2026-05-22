using Dms.Application.DTOs;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Categories.Queries
{
    public record GetCategoriesListQuery : IRequest<IEnumerable<CategoryDto>>;

    public class GetCategoriesListQueryHandler : IRequestHandler<GetCategoriesListQuery, IEnumerable<CategoryDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetCategoriesListQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<CategoryDto>> Handle(GetCategoriesListQuery request, CancellationToken cancellationToken)
        {
            var categories = await _unitOfWork.Categories.GetAllAsync();
            
            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                IsActive = c.IsActive,
                Created = c.Created
            });
        }
    }
}

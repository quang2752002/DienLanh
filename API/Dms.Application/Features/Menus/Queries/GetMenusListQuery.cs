using Dms.Application.DTOs;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Menus.Queries
{
    public record GetMenusListQuery : IRequest<IEnumerable<MenuDto>>;

    public class GetMenusListQueryHandler : IRequestHandler<GetMenusListQuery, IEnumerable<MenuDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetMenusListQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<MenuDto>> Handle(GetMenusListQuery request, CancellationToken cancellationToken)
        {
            var menus = await _unitOfWork.Menus.GetAllAsync();
            return menus.OrderBy(m => m.SortOrder).Select(m => new MenuDto
            {
                Id = m.Id,
                Title = m.Title,
                Url = m.Url,
                Icon = m.Icon,
                SortOrder = m.SortOrder,
                IsActive = m.IsActive,
                Created = m.Created
            });
        }
    }
}

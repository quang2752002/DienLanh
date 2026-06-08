using Dms.Application.DTOs;
using Dms.Domain.Entities;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Menus.Commands
{
    public record CreateMenuCommand : IRequest<MenuDto>
    {
        public string Title { get; init; } = string.Empty;
        public string Url { get; init; } = string.Empty;
        public string? Icon { get; init; }
        public int SortOrder { get; init; }
    }

    public class CreateMenuCommandHandler : IRequestHandler<CreateMenuCommand, MenuDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateMenuCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<MenuDto> Handle(CreateMenuCommand request, CancellationToken cancellationToken)
        {
            var menu = new Menu
            {
                Title = request.Title,
                Url = request.Url,
                Icon = request.Icon,
                SortOrder = request.SortOrder,
                IsActive = true,
                Created = DateTime.UtcNow
            };

            await _unitOfWork.Menus.AddAsync(menu);
            await _unitOfWork.CompleteAsync();

            return new MenuDto
            {
                Id = menu.Id,
                Title = menu.Title,
                Url = menu.Url,
                Icon = menu.Icon,
                SortOrder = menu.SortOrder,
                IsActive = menu.IsActive,
                Created = menu.Created
            };
        }
    }
}

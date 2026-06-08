using Dms.Application.DTOs;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Menus.Commands
{
    public record UpdateMenuCommand : IRequest<MenuDto>
    {
        public string Id { get; init; } = string.Empty;
        public string Title { get; init; } = string.Empty;
        public string Url { get; init; } = string.Empty;
        public string? Icon { get; init; }
        public int SortOrder { get; init; }
        public bool IsActive { get; init; }
    }

    public class UpdateMenuCommandHandler : IRequestHandler<UpdateMenuCommand, MenuDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateMenuCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<MenuDto> Handle(UpdateMenuCommand request, CancellationToken cancellationToken)
        {
            var menu = await _unitOfWork.Menus.GetByIdAsync(request.Id);
            if (menu == null)
            {
                throw new KeyNotFoundException($"Menu with ID {request.Id} was not found.");
            }

            menu.Title = request.Title;
            menu.Url = request.Url;
            menu.Icon = request.Icon;
            menu.SortOrder = request.SortOrder;
            menu.IsActive = request.IsActive;
            menu.LastModified = DateTime.UtcNow;

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

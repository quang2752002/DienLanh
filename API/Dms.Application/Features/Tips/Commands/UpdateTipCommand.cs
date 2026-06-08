using Dms.Application.DTOs;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Tips.Commands
{
    public record UpdateTipCommand : IRequest<TipDto>
    {
        public string Id { get; init; } = string.Empty;
        public string Title { get; init; } = string.Empty;
        public string ShortDescription { get; init; } = string.Empty;
        public string Content { get; init; } = string.Empty;
        public string? ImageUrl { get; init; }
        public string Author { get; init; } = string.Empty;
        public bool IsActive { get; init; }
    }

    public class UpdateTipCommandHandler : IRequestHandler<UpdateTipCommand, TipDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateTipCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<TipDto> Handle(UpdateTipCommand request, CancellationToken cancellationToken)
        {
            var tip = await _unitOfWork.Tips.GetByIdAsync(request.Id);
            if (tip == null)
            {
                throw new KeyNotFoundException($"Tip with ID {request.Id} was not found.");
            }

            tip.Title = request.Title;
            tip.ShortDescription = request.ShortDescription;
            tip.Content = request.Content;
            tip.ImageUrl = request.ImageUrl;
            tip.Author = request.Author;
            tip.IsActive = request.IsActive;
            tip.LastModified = DateTime.UtcNow;

            await _unitOfWork.CompleteAsync();

            return new TipDto
            {
                Id = tip.Id,
                Title = tip.Title,
                ShortDescription = tip.ShortDescription,
                Content = tip.Content,
                ImageUrl = tip.ImageUrl,
                Author = tip.Author,
                IsActive = tip.IsActive,
                Created = tip.Created
            };
        }
    }
}

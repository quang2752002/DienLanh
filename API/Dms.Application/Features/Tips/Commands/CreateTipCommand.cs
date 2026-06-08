using Dms.Application.DTOs;
using Dms.Domain.Entities;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Tips.Commands
{
    public record CreateTipCommand : IRequest<TipDto>
    {
        public string Title { get; init; } = string.Empty;
        public string ShortDescription { get; init; } = string.Empty;
        public string Content { get; init; } = string.Empty;
        public string? ImageUrl { get; init; }
        public string Author { get; init; } = "Kỹ thuật viên DMS";
    }

    public class CreateTipCommandHandler : IRequestHandler<CreateTipCommand, TipDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateTipCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<TipDto> Handle(CreateTipCommand request, CancellationToken cancellationToken)
        {
            var tip = new Tip
            {
                Title = request.Title,
                ShortDescription = request.ShortDescription,
                Content = request.Content,
                ImageUrl = request.ImageUrl,
                Author = request.Author,
                IsActive = true,
                Created = DateTime.UtcNow
            };

            await _unitOfWork.Tips.AddAsync(tip);
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

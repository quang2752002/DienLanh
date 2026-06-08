using Dms.Application.DTOs;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Tips.Queries
{
    public record GetTipByIdQuery(string Id) : IRequest<TipDto?>;

    public class GetTipByIdQueryHandler : IRequestHandler<GetTipByIdQuery, TipDto?>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetTipByIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<TipDto?> Handle(GetTipByIdQuery request, CancellationToken cancellationToken)
        {
            var t = await _unitOfWork.Tips.GetByIdAsync(request.Id);
            if (t == null) return null;

            return new TipDto
            {
                Id = t.Id,
                Title = t.Title,
                ShortDescription = t.ShortDescription,
                Content = t.Content,
                ImageUrl = t.ImageUrl,
                Author = t.Author,
                IsActive = t.IsActive,
                Created = t.Created
            };
        }
    }
}

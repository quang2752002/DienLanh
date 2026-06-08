using Dms.Application.DTOs;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Tips.Queries
{
    public record GetTipsListQuery : IRequest<IEnumerable<TipDto>>;

    public class GetTipsListQueryHandler : IRequestHandler<GetTipsListQuery, IEnumerable<TipDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetTipsListQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<TipDto>> Handle(GetTipsListQuery request, CancellationToken cancellationToken)
        {
            var tips = await _unitOfWork.Tips.GetAllAsync();
            return tips.Select(t => new TipDto
            {
                Id = t.Id,
                Title = t.Title,
                ShortDescription = t.ShortDescription,
                Content = t.Content,
                ImageUrl = t.ImageUrl,
                Author = t.Author,
                IsActive = t.IsActive,
                Created = t.Created
            });
        }
    }
}

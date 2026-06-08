using Dms.Application.DTOs;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.SystemSettings.Queries
{
    public record GetSystemSettingsListQuery : IRequest<IEnumerable<SystemSettingDto>>;

    public class GetSystemSettingsListQueryHandler : IRequestHandler<GetSystemSettingsListQuery, IEnumerable<SystemSettingDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetSystemSettingsListQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<SystemSettingDto>> Handle(GetSystemSettingsListQuery request, CancellationToken cancellationToken)
        {
            var settings = await _unitOfWork.SystemSettings.GetAllAsync();
            return settings.Select(s => new SystemSettingDto
            {
                Id = s.Id,
                Key = s.Key,
                Value = s.Value,
                Description = s.Description,
                Created = s.Created
            });
        }
    }
}

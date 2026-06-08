using Dms.Application.DTOs;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.SystemSettings.Commands
{
    public record UpdateSystemSettingCommand : IRequest<SystemSettingDto>
    {
        public string Id { get; init; } = string.Empty;
        public string Value { get; init; } = string.Empty;
    }

    public class UpdateSystemSettingCommandHandler : IRequestHandler<UpdateSystemSettingCommand, SystemSettingDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateSystemSettingCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<SystemSettingDto> Handle(UpdateSystemSettingCommand request, CancellationToken cancellationToken)
        {
            var setting = await _unitOfWork.SystemSettings.GetByIdAsync(request.Id);
            if (setting == null)
            {
                throw new KeyNotFoundException($"System setting with ID {request.Id} was not found.");
            }

            setting.Value = request.Value;
            setting.LastModified = DateTime.UtcNow;

            await _unitOfWork.CompleteAsync();

            return new SystemSettingDto
            {
                Id = setting.Id,
                Key = setting.Key,
                Value = setting.Value,
                Description = setting.Description,
                Created = setting.Created
            };
        }
    }
}

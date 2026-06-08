using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.ServiceDevices.Commands
{
    public record DeleteServiceDeviceCommand(string Id) : IRequest<Unit>;

    public class DeleteServiceDeviceCommandHandler : IRequestHandler<DeleteServiceDeviceCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteServiceDeviceCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(DeleteServiceDeviceCommand request, CancellationToken cancellationToken)
        {
            var device = await _unitOfWork.ServiceDevices.GetByIdAsync(request.Id);
            if (device == null)
            {
                throw new KeyNotFoundException($"Service device with ID {request.Id} was not found.");
            }

            _unitOfWork.ServiceDevices.Delete(device);
            await _unitOfWork.CompleteAsync();

            return Unit.Value;
        }
    }
}

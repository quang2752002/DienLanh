using Dms.Application.DTOs;
using Dms.Domain.Entities;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.ServiceDevices.Commands
{
    public record CreateServiceDeviceCommand : IRequest<ServiceDeviceDto>
    {
        public string Name { get; init; } = string.Empty;
        public string Brand { get; init; } = string.Empty;
        public string? ModelNumber { get; init; }
        public string? SerialNumber { get; init; }
        public string? Description { get; init; }
        public string? Price { get; init; }
        public double Rating { get; init; } = 5.0;
        public string? Icon { get; init; }
        public string? Content { get; init; }
        public string CategoryId { get; init; } = string.Empty;
    }

    public class CreateServiceDeviceCommandHandler : IRequestHandler<CreateServiceDeviceCommand, ServiceDeviceDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateServiceDeviceCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ServiceDeviceDto> Handle(CreateServiceDeviceCommand request, CancellationToken cancellationToken)
        {
            var device = new ServiceDevice
            {
                Name = request.Name,
                Brand = request.Brand,
                ModelNumber = request.ModelNumber,
                SerialNumber = request.SerialNumber,
                Description = request.Description,
                Price = request.Price,
                Rating = request.Rating,
                Icon = request.Icon,
                IsActive = true,
                Content = request.Content,
                CategoryId = request.CategoryId,
                Created = DateTime.UtcNow
            };

            await _unitOfWork.ServiceDevices.AddAsync(device);
            await _unitOfWork.CompleteAsync();

            var category = await _unitOfWork.Categories.GetByIdAsync(device.CategoryId);

            return new ServiceDeviceDto
            {
                Id = device.Id,
                Name = device.Name,
                Brand = device.Brand,
                ModelNumber = device.ModelNumber,
                SerialNumber = device.SerialNumber,
                Description = device.Description,
                Price = device.Price,
                Rating = device.Rating,
                Icon = device.Icon,
                IsActive = device.IsActive,
                Content = device.Content,
                CategoryId = device.CategoryId,
                CategoryName = category?.Name ?? "Không xác định",
                Created = device.Created
            };
        }
    }
}

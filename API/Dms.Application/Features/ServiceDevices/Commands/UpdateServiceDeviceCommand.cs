using Dms.Application.DTOs;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.ServiceDevices.Commands
{
    public record UpdateServiceDeviceCommand : IRequest<ServiceDeviceDto>
    {
        public string Id { get; init; } = string.Empty;
        public string Name { get; init; } = string.Empty;
        public string Brand { get; init; } = string.Empty;
        public string? ModelNumber { get; init; }
        public string? SerialNumber { get; init; }
        public string? Description { get; init; }
        public string? Price { get; init; }
        public double Rating { get; init; }
        public string? Icon { get; init; }
        public bool IsActive { get; init; }
        public string? Content { get; init; }
        public string CategoryId { get; init; } = string.Empty;
    }

    public class UpdateServiceDeviceCommandHandler : IRequestHandler<UpdateServiceDeviceCommand, ServiceDeviceDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateServiceDeviceCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ServiceDeviceDto> Handle(UpdateServiceDeviceCommand request, CancellationToken cancellationToken)
        {
            var device = await _unitOfWork.ServiceDevices.GetByIdAsync(request.Id);
            if (device == null)
            {
                throw new KeyNotFoundException($"Service device with ID {request.Id} was not found.");
            }

            device.Name = request.Name;
            device.Brand = request.Brand;
            device.ModelNumber = request.ModelNumber;
            device.SerialNumber = request.SerialNumber;
            device.Description = request.Description;
            device.Price = request.Price;
            device.Rating = request.Rating;
            device.Icon = request.Icon;
            device.IsActive = request.IsActive;
            device.Content = request.Content;
            device.CategoryId = request.CategoryId;
            device.LastModified = DateTime.UtcNow;

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

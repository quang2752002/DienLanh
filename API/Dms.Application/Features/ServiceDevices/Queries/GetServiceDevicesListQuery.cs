using Dms.Application.DTOs;
using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.ServiceDevices.Queries
{
    public record GetServiceDevicesListQuery : IRequest<IEnumerable<ServiceDeviceDto>>;

    public class GetServiceDevicesListQueryHandler : IRequestHandler<GetServiceDevicesListQuery, IEnumerable<ServiceDeviceDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetServiceDevicesListQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<ServiceDeviceDto>> Handle(GetServiceDevicesListQuery request, CancellationToken cancellationToken)
        {
            var serviceDevices = await _unitOfWork.ServiceDevices.GetAllAsync();
            var categories = await _unitOfWork.Categories.GetAllAsync();
            var categoryDict = categories.ToDictionary(c => c.Id, c => c.Name);

            return serviceDevices.Select(s => new ServiceDeviceDto
            {
                Id = s.Id,
                Name = s.Name,
                Brand = s.Brand,
                ModelNumber = s.ModelNumber,
                SerialNumber = s.SerialNumber,
                Description = s.Description,
                Price = s.Price,
                Rating = s.Rating,
                Icon = s.Icon,
                IsActive = s.IsActive,
                Content = s.Content,
                CategoryId = s.CategoryId,
                CategoryName = categoryDict.TryGetValue(s.CategoryId, out var catName) ? catName : "Không xác định",
                Created = s.Created
            });
        }
    }
}

using AutoMapper;
using Dms.Application.DTOs;
using Dms.Domain.Entities;

namespace Dms.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            #region Repair Mappings
            CreateMap<Repair, RepairDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));

            CreateMap<CreateRepairDto, Repair>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.Created, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.LastModified, opt => opt.Ignore())
                .ForMember(dest => dest.LastModifiedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());

            CreateMap<UpdateRepairDto, Repair>()
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.Created, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.LastModified, opt => opt.Ignore())
                .ForMember(dest => dest.LastModifiedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());
            #endregion

            #region Category Mappings
            CreateMap<Category, CategoryDto>().ReverseMap();
            #endregion

            #region Menu Mappings
            CreateMap<Menu, MenuDto>().ReverseMap();
            #endregion

            #region SystemSetting Mappings
            CreateMap<SystemSetting, SystemSettingDto>().ReverseMap();
            #endregion


        }
    }
}

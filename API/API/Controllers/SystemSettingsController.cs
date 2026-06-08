using Dms.Application.DTOs;
using Dms.Application.Features.SystemSettings.Commands;
using Dms.Application.Features.SystemSettings.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SystemSettingsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SystemSettingDto>>> GetSystemSettings()
        {
            var settings = await Mediator.Send(new GetSystemSettingsListQuery());
            return Ok(settings);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SystemSettingDto>> UpdateSystemSetting(string id, UpdateSystemSettingCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL does not match ID in body.");
            }

            var setting = await Mediator.Send(command);
            return Ok(setting);
        }
    }
}

using Dms.Application.DTOs;
using Dms.Application.Features.ServiceDevices.Commands;
using Dms.Application.Features.ServiceDevices.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ServiceDevicesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDeviceDto>>> GetServiceDevices()
        {
            var devices = await Mediator.Send(new GetServiceDevicesListQuery());
            return Ok(devices);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceDeviceDto>> CreateServiceDevice(CreateServiceDeviceCommand command)
        {
            var device = await Mediator.Send(command);
            return CreatedAtAction(nameof(GetServiceDevices), new { id = device.Id }, device);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceDeviceDto>> UpdateServiceDevice(string id, UpdateServiceDeviceCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL does not match ID in body.");
            }

            var device = await Mediator.Send(command);
            return Ok(device);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteServiceDevice(string id)
        {
            await Mediator.Send(new DeleteServiceDeviceCommand(id));
            return NoContent();
        }
    }
}

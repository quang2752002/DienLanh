using Dms.Application.DTOs;
using Dms.Application.Features.Tips.Commands;
using Dms.Application.Features.Tips.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TipsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipDto>>> GetTips()
        {
            var tips = await Mediator.Send(new GetTipsListQuery());
            return Ok(tips);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TipDto>> GetTipById(string id)
        {
            var tip = await Mediator.Send(new GetTipByIdQuery(id));
            if (tip == null)
            {
                return NotFound($"Tip with ID {id} was not found.");
            }
            return Ok(tip);
        }

        [HttpPost]
        public async Task<ActionResult<TipDto>> CreateTip(CreateTipCommand command)
        {
            var tip = await Mediator.Send(command);
            return CreatedAtAction(nameof(GetTipById), new { id = tip.Id }, tip);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TipDto>> UpdateTip(string id, UpdateTipCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL does not match ID in body.");
            }

            var tip = await Mediator.Send(command);
            return Ok(tip);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTip(string id)
        {
            await Mediator.Send(new DeleteTipCommand(id));
            return NoContent();
        }
    }
}

using Dms.Application.DTOs;
using Dms.Application.Features.Menus.Commands;
using Dms.Application.Features.Menus.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MenusController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
        {
            var menus = await Mediator.Send(new GetMenusListQuery());
            return Ok(menus);
        }

        [HttpPost]
        public async Task<ActionResult<MenuDto>> CreateMenu(CreateMenuCommand command)
        {
            var menu = await Mediator.Send(command);
            return CreatedAtAction(nameof(GetMenus), new { id = menu.Id }, menu);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MenuDto>> UpdateMenu(string id, UpdateMenuCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL does not match ID in body.");
            }

            var menu = await Mediator.Send(command);
            return Ok(menu);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMenu(string id)
        {
            await Mediator.Send(new DeleteMenuCommand(id));
            return NoContent();
        }
    }
}

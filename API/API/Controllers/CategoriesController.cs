using Dms.Application.DTOs;
using Dms.Application.Features.Categories.Commands;
using Dms.Application.Features.Categories.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CategoriesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await Mediator.Send(new GetCategoriesListQuery());
            return Ok(categories);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryCommand command)
        {
            var validator = new CreateCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(command);
            
            if (!validationResult.IsValid)
            {
                throw new FluentValidation.ValidationException(validationResult.Errors);
            }

            var category = await Mediator.Send(command);
            return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
        }
    }
}

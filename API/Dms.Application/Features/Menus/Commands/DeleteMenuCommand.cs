using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Menus.Commands
{
    public record DeleteMenuCommand(string Id) : IRequest<Unit>;

    public class DeleteMenuCommandHandler : IRequestHandler<DeleteMenuCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteMenuCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(DeleteMenuCommand request, CancellationToken cancellationToken)
        {
            var menu = await _unitOfWork.Menus.GetByIdAsync(request.Id);
            if (menu == null)
            {
                throw new KeyNotFoundException($"Menu with ID {request.Id} was not found.");
            }

            _unitOfWork.Menus.Delete(menu);
            await _unitOfWork.CompleteAsync();

            return Unit.Value;
        }
    }
}

using Dms.Domain.Interfaces;
using MediatR;

namespace Dms.Application.Features.Tips.Commands
{
    public record DeleteTipCommand(string Id) : IRequest<Unit>;

    public class DeleteTipCommandHandler : IRequestHandler<DeleteTipCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteTipCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(DeleteTipCommand request, CancellationToken cancellationToken)
        {
            var tip = await _unitOfWork.Tips.GetByIdAsync(request.Id);
            if (tip == null)
            {
                throw new KeyNotFoundException($"Tip with ID {request.Id} was not found.");
            }

            _unitOfWork.Tips.Delete(tip);
            await _unitOfWork.CompleteAsync();

            return Unit.Value;
        }
    }
}

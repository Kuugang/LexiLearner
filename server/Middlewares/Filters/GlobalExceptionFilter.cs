using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using LexiLearn.Exceptions;
using LexiLearn.Models.DTO;

public class GlobalExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is ApplicationExceptionBase ex)
        {
            context.Result = new ObjectResult(new ErrorResponseDTO(ex.Message, ex.Error, ex.StatusCode))
            {
                StatusCode = ex.StatusCode
            };
        }
        else
        {
            context.Result = new ObjectResult(new ErrorResponseDTO(context.Exception.Message, context.Exception.StackTrace, 500))
            {
                StatusCode = StatusCodes.Status500InternalServerError
            };
        }

        context.ExceptionHandled = true;
    }
}

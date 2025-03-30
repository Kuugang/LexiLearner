using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using LexiLearner.Exceptions;
using LexiLearner.Models.DTO;

public class GlobalExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is ApplicationExceptionBase ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Error);
            context.Result = new ObjectResult(new ErrorResponseDTO(ex.Message, ex.Error, ex.StatusCode))
            {
                StatusCode = ex.StatusCode
            };
        }
        else
        {
            Console.WriteLine(context.Exception.Message);
            Console.WriteLine(context.Exception.StackTrace);
            context.Result = new ObjectResult(new ErrorResponseDTO(context.Exception.Message, context.Exception.StackTrace, 500))
            {
                StatusCode = StatusCodes.Status500InternalServerError
            };
        }

        context.ExceptionHandled = true;
    }
}

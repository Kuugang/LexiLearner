namespace LexiLearn.Models.DTO
{
    public class ResponseDTO
    {
        public string? Message { get; set; }
        public object? Data { get; set; }
        public object? Error { get; set; }
        public int StatusCode { get; set; }


        public ResponseDTO() { }

        public ResponseDTO(string? message, object? data = null, object? error = null, int statusCode = 200)
        {
            Message = message;
            Data = data;
            Error = error;
            StatusCode = statusCode;
        }
    }

    public class SuccessResponseDTO : ResponseDTO
    {
        public SuccessResponseDTO(){}

        public SuccessResponseDTO(string message, object? data = null)
            : base(message, data, null, 200) { }
    }

    public class ErrorResponseDTO : ResponseDTO
    {
        public ErrorResponseDTO(){}

        public ErrorResponseDTO(string message, object? error = null, int statusCode = 400)
            : base(message, null, error, statusCode) { }
    }
}

using System.Security.Claims;

using LexiLearn.Models;
using LexiLearn.Models.DTO;

namespace LexiLearn.Interfaces{
	public interface IUserService
	{
        Task<string> GetRole(User user);
		Task<User?> GetUserByIdAsync(string userId);
		Task<User?> GetUserByEmail(string email);
		Task<SuccessResponseDTO> Register(RegisterRequest RegisterRequest);

        Task<SuccessResponseDTO> GetUserProfile(ClaimsPrincipal user);

        Task<User?> GetUserFromToken(ClaimsPrincipal token);

        Task<SuccessResponseDTO> UpdateProfile(UpdateProfileDTO UpdateProfileDTO, ClaimsPrincipal User);
	}
}

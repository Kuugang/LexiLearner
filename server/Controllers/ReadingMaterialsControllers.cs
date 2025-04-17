using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using LexiLearner.Models.DTO;
using LexiLearner.Interfaces;

[ApiController]
[Route("api/readingMaterials")]

public class readingMaterialsController : ControllerBase
{
    private readonly IUserService _userService;

   
}

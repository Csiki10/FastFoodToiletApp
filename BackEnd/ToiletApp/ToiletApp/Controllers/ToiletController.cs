using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ToiletApp.Services;
using ToiletApp.Models;

namespace ToiletApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToiletController : ControllerBase
    {
        private readonly IToiletAppService _toiletService;
        private readonly UserManager<SiteUser> _userManager;
        private readonly ILogger<ToiletController> _logger;

        public ToiletController(UserManager<SiteUser> userManager, IToiletAppService toiletService, ILogger<ToiletController> logger)
        {
            _toiletService = toiletService;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet("GetToilets")]
        public ActionResult<IEnumerable<Toilet>> GetToilets()
        {
            try
            {
                return Ok(_toiletService.GetAllToilets());
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(GetToilets)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpGet("GetToilet/{id}")]
        public ActionResult<Toilet> GetToilet(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                _logger.LogError($"Input parameter is null or not provided at {nameof(GetToilet)}");
                return BadRequest("Invalid ID");
            }

            try
            {
                var toilet = _toiletService.GetToilet(id);
                if (toilet == null)
                {
                    return NotFound();
                }
                return Ok(toilet);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(GetToilet)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpPost("AddToilet")]
        public ActionResult AddToilet([FromBody] Toilet toilet)
        {
            if (toilet == null)
            {
                _logger.LogError($"Input parameter is null or not provided at {nameof(AddToilet)}");
                return BadRequest("Toilet object is null");
            }

            try
            {
                var user = _userManager.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
                if (user == null)
                {
                    return Unauthorized();
                }
                _toiletService.AddNewToilet(toilet, user);
                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(AddToilet)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("EditToilet")]
        public ActionResult EditToilet([FromBody] UpdateToiletViewModel toiletViewModel)
        {
            if (toiletViewModel == null)
            {
                _logger.LogError($"Input parameter is null or not provided at {nameof(EditToilet)}");
                return BadRequest("UpdateToiletViewModel object is null");
            }

            try
            {
                _toiletService.UpdateToilet(toiletViewModel);
                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(EditToilet)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpDelete("DeleteToilet/{id}")]
        public ActionResult DeleteToilet(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                _logger.LogError($"Input parameter is null or not provided at {nameof(DeleteToilet)}");
                return BadRequest("Invalid ID");
            }

            try
            {
                _toiletService.DeleteToilet(id);
                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(DeleteToilet)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}

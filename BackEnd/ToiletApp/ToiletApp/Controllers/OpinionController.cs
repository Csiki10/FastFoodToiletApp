using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ToiletApp.Services;
using ToiletApp.Models;
using System.Collections.Generic;
using System.Linq;
using System;

namespace ToiletApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OpinionController : ControllerBase
    {
        private readonly IToiletAppService _toiletService;
        private readonly UserManager<SiteUser> _userManager;
        private readonly ILogger<OpinionController> _logger;

        public OpinionController(UserManager<SiteUser> userManager, IToiletAppService toiletService, ILogger<OpinionController> logger)
        {
            _toiletService = toiletService;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet("GetOpinions/{toiletUid}")]
        public ActionResult<IEnumerable<Opinion>> GetOpinions(string toiletUid)
        {
            if (string.IsNullOrEmpty(toiletUid))
            {
                _logger.LogError($"Input parameter is null or not provided at {nameof(GetOpinions)}");
                return BadRequest("Invalid toilet ID");
            }

            try
            {
                var opinions = _toiletService.ListOpinions(toiletUid);
                return Ok(opinions);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(GetOpinions)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpGet("GetEditOpinion/{opinionUid}")]
        public ActionResult<Opinion> GetEditOpinion(string opinionUid)
        {
            if (string.IsNullOrEmpty(opinionUid))
            {
                _logger.LogError($"Input parameter is null or not provided at {nameof(GetEditOpinion)}");
                return BadRequest("Invalid opinion ID");
            }

            try
            {
                var opinion = _toiletService.GetOpinion(opinionUid);
                if (opinion == null)
                {
                    return NotFound();
                }
                return Ok(opinion);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(GetEditOpinion)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpPost("AddOpinion")]
        public ActionResult AddOpinion([FromBody] Opinion opinion)
        {
            if (opinion == null)
            {
                _logger.LogError($"Input parameter is null or not provided at {nameof(AddOpinion)}");
                return BadRequest("Opinion object is null");
            }

            try
            {
                var user = _userManager.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
                if (user == null)
                {
                    return Unauthorized();
                }
                opinion.userUid = user.Id;
                _toiletService.AddOpinion(opinion);
                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(AddOpinion)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpPut("EditOpinion")]
        public ActionResult EditOpinion([FromBody] UpdateOpinionViewmodel opinionViewModel)
        {
            if (opinionViewModel == null)
            {
                _logger.LogError($"Input parameter is null or not provided at {nameof(EditOpinion)}");
                return BadRequest("UpdateOpinionViewmodel object is null");
            }

            try
            {
                _toiletService.UpdateOpinion(opinionViewModel);
                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(EditOpinion)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpDelete("DeleteOpinion/{tuid}/{ouid}")]
        public ActionResult DeleteOpinion(string tuid, string ouid)
        {
            if (string.IsNullOrEmpty(tuid) || string.IsNullOrEmpty(ouid))
            {
                _logger.LogError($"Input parameters are null or not provided at {nameof(DeleteOpinion)}");
                return BadRequest("Invalid toilet or opinion ID");
            }

            try
            {
                _toiletService.DeleteOpinion(tuid, ouid);
                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(DeleteOpinion)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ToiletApp.Services;
using ToiletApp.Models;

namespace ToiletApp.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class OpinionController : Controller
    {
        IToiletAppService _toiletService;
        private readonly UserManager<SiteUser> _userManager;

        public OpinionController(UserManager<SiteUser> userManager, IToiletAppService logic)
        {
            this._toiletService = logic;
            _userManager = userManager;
        }

        [HttpGet("{toiletUid}")]
        public IEnumerable<Opinion> GetOpinions(string toiletUid)
        {
            return _toiletService.ListOpinions(toiletUid);
        }

        [Authorize]
        [HttpGet("{opinionUid}")]
        public Opinion GetEditOpinion(string opinionUid)
        {
            return _toiletService.GetOpinion(opinionUid);
        }

        [Authorize]
        [HttpPost]
        public void AddOpinion(Opinion opinion)
        {
            var user = _userManager.Users.FirstOrDefault(t => t.UserName == this.User.Identity.Name);
            opinion.userUid = user.Id;
            _toiletService.AddOpinion(opinion);
        }

        [Authorize]
        [HttpPut]
        public void EditOpinion([FromBody] UpdateOpinionViewmodel opinion)
        {
            _toiletService.UpdateOpinion(opinion);
        }

        [HttpDelete]
        public void DeleteOpinion(string tuid, string ouid)
        {
            _toiletService.DeleteOpinion(tuid, ouid);
        }
    }
}

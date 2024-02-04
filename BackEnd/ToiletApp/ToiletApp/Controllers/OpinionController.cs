using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ToiletApp.Logic;
using ToiletApp.Models;

namespace ToiletApp.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class OpinionController : Controller
    {
        IToiletAppLogic _logic;
        private readonly UserManager<SiteUser> _userManager;

        public OpinionController(UserManager<SiteUser> userManager, IToiletAppLogic logic)
        {
            this._logic = logic;
            _userManager = userManager;
        }

        [HttpGet("{toiletUid}")]
        public IEnumerable<Opinion> GetOpinions(string toiletUid)
        {
            return _logic.ListOpinions(toiletUid);
        }

        [Authorize]
        [HttpGet("{opinionUid}")]
        public Opinion GetEditOpinion(string opinionUid)
        {
            return _logic.GetOpinion(opinionUid);
        }

        [Authorize]
        [HttpPost]
        public void AddOpinion(Opinion opinion)
        {
            var user = _userManager.Users.FirstOrDefault(t => t.UserName == this.User.Identity.Name);
            opinion.userUid = user.Id;
            _logic.AddOpinion(opinion);
        }

        [Authorize]
        [HttpPut]
        public void EditOpinion([FromBody] UpdateOpinionViewmodel opinion)
        {
            _logic.UpdateOpinion(opinion);
        }

        [HttpDelete]
        public void DeleteOpinion(string tuid, string ouid)
        {
            _logic.DeleteOpinion(tuid, ouid);
        }
    }
}

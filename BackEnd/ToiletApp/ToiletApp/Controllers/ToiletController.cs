using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ToiletApp.Logic;
using ToiletApp.Models;

namespace ToiletApp.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ToiletController : ControllerBase
    {
        IToiletAppLogic _logic;
        UserManager<SiteUser> _userManager;

        public ToiletController(UserManager<SiteUser> userManager, IToiletAppLogic logic)
        {
            this._logic = logic;
            this._userManager = userManager;
        }

        [HttpGet]
        public IEnumerable<Toilet> GetToilets()
        {
            return _logic.GetAllToilets();
        }

        [Authorize]
        [HttpGet("{id}")]
        public Toilet? GetToilet(string id)
        {
            return _logic.GetToilet(id);
        }

        [Authorize]
        [HttpPost]
        public void AddToilet([FromBody] Toilet t)
        {
            var user = _userManager.Users.FirstOrDefault(t => t.UserName == this.User.Identity.Name);
            _logic.AddNewToilet(t,user);
        }

        [HttpPut]
        public void EditToilet([FromBody] UpdateToiletViewModel t)
        {
            _logic.UpdateToilet(t);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public void DeleteToilet(string id)
        {
            _logic.DeleteToilet(id);
        }
    }
}

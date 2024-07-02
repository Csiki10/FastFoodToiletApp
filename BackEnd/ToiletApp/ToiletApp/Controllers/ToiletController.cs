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
        private readonly IToiletAppLogic _logic;
        private readonly UserManager<SiteUser> _userManager;
        private readonly ILogger _logger;

        public ToiletController(UserManager<SiteUser> userManager, IToiletAppLogic logic, ILogger<ToiletController> logger)
        {
            this._logic = logic;
            this._userManager = userManager;
            this._logger = logger;
        }

        [HttpGet]
        public IEnumerable<Toilet> GetToilets()
        {
            try
            {
                return _logic.GetAllToilets();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happend at ${nameof(GetToilets)}, Message: ${e.Message}");
                return Enumerable.Empty<Toilet>();
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public Toilet? GetToilet(string id)
        {
            if (String.IsNullOrEmpty(id))
            {
                _logger.LogError($"Input parameter is null or not provided at ${nameof(GetToilet)}");
                return null;
            }

            try
            {
                return _logic.GetToilet(id);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happend at ${nameof(GetToilet)}, Message: ${e.Message}");
                return null;
            }
        }

        [Authorize]
        [HttpPost]
        public void AddToilet([FromBody] Toilet t)
        {
            if (t == null)
            {
                _logger.LogError($"Input parameter is null or not provided at ${nameof(AddToilet)}");
            }

            try
            {
                var user = _userManager.Users.FirstOrDefault(t => t.UserName == this.User.Identity.Name);
                _logic.AddNewToilet(t, user);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happend at ${nameof(AddToilet)}, Message: ${e.Message}");
            }

        }

        [HttpPut]
        public void EditToilet([FromBody] UpdateToiletViewModel t)
        {
            if (t == null)
            {
                _logger.LogError($"Input parameter is null or not provided at ${nameof(EditToilet)}");
            }
            try
            {
                _logic.UpdateToilet(t);
            }
            catch (Exception e )
            {
                _logger.LogError($"Error happend at ${nameof(EditToilet)}, Message: ${e.Message}");
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public void DeleteToilet(string id)
        {
            if (String.IsNullOrEmpty(id))
            {
                _logger.LogError($"Input parameter is null or not provided at ${nameof(DeleteToilet)}");
            }

            try
            {
                _logic.DeleteToilet(id);
            }
            catch (Exception e )
            {
                _logger.LogError($"Error happend at ${nameof(DeleteToilet)}, Message: ${e.Message}");
            }
        }
    }
}

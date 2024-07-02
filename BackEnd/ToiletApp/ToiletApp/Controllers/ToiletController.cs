using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ToiletApp.Services;
using ToiletApp.Models;

namespace ToiletApp.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ToiletController : ControllerBase
    {
        private readonly IToiletAppService _toiletService;
        private readonly UserManager<SiteUser> _userManager;
        private readonly ILogger _logger;

        public ToiletController(UserManager<SiteUser> userManager, IToiletAppService logic, ILogger<ToiletController> logger)
        {
            this._toiletService = logic;
            this._userManager = userManager;
            this._logger = logger;
        }

        [HttpGet]
        public IEnumerable<Toilet> GetToilets()
        {
            try
            {
                return _toiletService.GetAllToilets();
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
                return _toiletService.GetToilet(id);
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
                _toiletService.AddNewToilet(t, user);
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
                _toiletService.UpdateToilet(t);
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
                _toiletService.DeleteToilet(id);
            }
            catch (Exception e )
            {
                _logger.LogError($"Error happend at ${nameof(DeleteToilet)}, Message: ${e.Message}");
            }
        }
    }
}

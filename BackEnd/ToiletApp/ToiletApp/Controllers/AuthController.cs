using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ToiletApp.Models;

namespace ToiletApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<SiteUser> _userManager;
        private readonly ILogger<AuthController> _logger;

        public AuthController(UserManager<SiteUser> userManager, ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(model.UserName);

                if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    var claim = new List<Claim>
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Name, user.UserName),
                        new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
                    };

                    foreach (var role in await _userManager.GetRolesAsync(user))
                    {
                        claim.Add(new Claim(ClaimTypes.Role, role));
                    }

                    var signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("nagyonhosszutitkoskodhelyeamimostmeghosszabbmintazelobbvolt"));
                    var token = new JwtSecurityToken(
                        issuer: "http://www.security.org", audience: "http://www.security.org",
                        claims: claim, expires: DateTime.Now.AddMinutes(60),
                        signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256)
                    );

                    return Ok(new
                    {
                        uid = user.Id,
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo.ToLocalTime()
                    });
                }

                return Unauthorized();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(Login)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("InsertUser")]
        public async Task<IActionResult> InsertUser()
        {
            try
            {
                var user = new SiteUser
                {
                    Email = Request.Form["email"],
                    UserName = Request.Form["userName"],
                    SecurityStamp = Guid.NewGuid().ToString(),
                    FirstName = Request.Form["firstName"],
                    LastName = Request.Form["lastName"],
                    ImageUrl = Request.Form["imageUrl"]
                };

                var result = await _userManager.CreateAsync(user, Request.Form["password"]);
                if (result.Succeeded)
                {
                    return Ok();
                }

                return BadRequest(result.Errors);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(InsertUser)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpGet("GetUserInfos")]
        public async Task<IActionResult> GetUserInfos()
        {
            try
            {
                var user = _userManager.Users.FirstOrDefault(t => t.UserName == this.User.Identity.Name);
                if (user != null)
                {
                    return Ok(new
                    {
                        UId = user.Id,
                        UserName = user.UserName,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        PhotoData = user.Data,
                        PhotoContentType = user.ContentType,
                        Roles = await _userManager.GetRolesAsync(user),
                        ImageUrl = user.ImageUrl
                    });
                }

                return Unauthorized();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(GetUserInfos)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpDelete("DeleteMyself")]
        public async Task<IActionResult> DeleteMyself()
        {
            try
            {
                var user = _userManager.Users.FirstOrDefault(t => t.UserName == this.User.Identity.Name);
                if (user != null)
                {
                    var result = await _userManager.DeleteAsync(user);
                    if (result.Succeeded)
                    {
                        return Ok();
                    }
                    return BadRequest(result.Errors);
                }

                return NotFound();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(DeleteMyself)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] RegisterViewModel model)
        {
            try
            {
                var user = _userManager.Users.FirstOrDefault(t => t.UserName == this.User.Identity.Name);
                if (user != null)
                {
                    user.UserName = model.UserName;
                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;

                    var result = await _userManager.UpdateAsync(user);
                    if (result.Succeeded)
                    {
                        return Ok();
                    }
                    return BadRequest(result.Errors);
                }

                return NotFound();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(Update)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("Google")]
        public async Task<IActionResult> Google([FromBody] SocialToken token)
        {
            try
            {
                using HttpClient client = new HttpClient();
                client.BaseAddress = new Uri("https://oauth2.googleapis.com");
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                var response = await client.GetAsync($"tokeninfo?id_token={token.Token}");
                var result = await response.Content.ReadFromJsonAsync<GoogleModel>();

                if (result != null)
                {
                    var user = new SiteUser
                    {
                        FirstName = result.given_name,
                        LastName = result.family_name,
                        Email = result.email,
                        UserName = result.email,
                    };
                    return await SocialAuth(user);
                }

                return Unauthorized();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(Google)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        private async Task<IActionResult> SocialAuth(SiteUser user)
        {
            try
            {
                if (_userManager.Users.FirstOrDefault(t => t.Email == user.Email) == null)
                {
                    await _userManager.CreateAsync(user);
                }

                var appUser = _userManager.Users.FirstOrDefault(t => t.Email == user.Email);

                if (appUser != null)
                {
                    var claim = new List<Claim> {
                        new Claim(JwtRegisteredClaimNames.NameId, appUser.UserName),
                        new Claim(JwtRegisteredClaimNames.Name, appUser.UserName)
                    };

                    foreach (var role in await _userManager.GetRolesAsync(appUser))
                    {
                    claim.Add(new Claim(ClaimTypes.Role, role));
                    }

                    var signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("nagyonhosszutitkoskodhelyeamimostmeghosszabbmintazelobbvolt"));
                    var token = new JwtSecurityToken(
                        issuer: "http://www.security.org", audience: "http://www.security.org",
                    claims: claim, expires: DateTime.Now.AddMinutes(60),
                        signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256));

                    return Ok(new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo.ToLocalTime()
                    });
                }

                return Unauthorized();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error happened at {nameof(SocialAuth)}, Message: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }

    internal class MsModel
    {
        public string given_name { get; set; }
        public string family_name { get; set; }
        public string email { get; set; }
    }

    public class SocialToken
    {
        public string Token { get; set; }
    }

    public class FbModel
    {
        public string first_name { get; set; }
        public string last_name { get; set; }
        public Picture picture { get; set; }
        public string email { get; set; }
        public string id { get; set; }
        public class Picture
        {
            public PictureData data { get; set; }
            public class PictureData
            {
                public int height { get; set; }
                public bool is_silhouette { get; set; }
                public string url { get; set; }
                public int width { get; set; }
            }
        }
    }

    public class GoogleModel
    {
        public string iss { get; set; }
        public string azp { get; set; }
        public string aud { get; set; }
        public string sub { get; set; }
        public string email { get; set; }
        public string email_verified { get; set; }
        public string at_hash { get; set; }
        public string name { get; set; }
        public string picture { get; set; }
        public string given_name { get; set; }
        public string family_name { get; set; }
        public string locale { get; set; }
        public string iat { get; set; }
        public string exp { get; set; }
        public string jti { get; set; }
        public string alg { get; set; }
        public string kid { get; set; }
        public string typ { get; set; }
    }

}

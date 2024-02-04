using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ToiletApp.Models
{
    public class SiteUser : IdentityUser
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public string? ContentType { get; set; }
        public byte[]? Data { get; set; }
        public string? ImageUrl { get; set; }
    }
}

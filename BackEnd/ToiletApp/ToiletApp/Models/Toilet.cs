using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToiletApp.Models
{
    public enum Institution
    {
        [Display(Name = "Mc Donald's")] McDonalds,
        [Display(Name = "Burger King")] BurgerKing,
        [Display(Name = "Costa Caffe")] CostaCaffe,
        [Display(Name = "Star bucks")] StarBucks,
        [Display(Name = "Frei Caffe")] FreiCaffee,
        [Display(Name = "KFC")] KFC,
        [Display(Name = "Pizza Hut")] PizzaHut,
        [Display(Name = "Other")] Other
    }
    public class Toilet
    {
        [Key]
        public string Uid { get; set; }

        [Required]
        [MaxLength(20, ErrorMessage = "Maximum length is 20 characters.")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "Code must be minimum 2 letter long.")]
        public string Code { get; set; }

        public virtual SiteUser? User { get; set; }
        public string UserId { get; set; }

        [NotMapped]
        public virtual Address? Address { get; set; }

        [NotMapped]
        public virtual ICollection<Opinion> Opinions { get; set; }

        [Required]
        public Institution Institution { get; set; }

        public string? ImageUrl { get; set; }

        [NotMapped]
        public virtual AppFileData? ToiletPicture { get; set; }

        public Toilet()
        {
            Uid = Guid.NewGuid().ToString();
            Opinions = new HashSet<Opinion>();
        }

        public override bool Equals(object? obj)
        {
            return obj is Toilet toilet &&
                   Code == toilet.Code &&
                   Address.Equals(toilet.Address) &&
                   Institution == toilet.Institution;
        }
    }
}

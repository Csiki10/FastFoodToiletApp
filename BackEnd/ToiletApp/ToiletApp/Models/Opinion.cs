using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ToiletApp.Models
{
    public class Opinion
    {
        [Key]
        public string Uid { get; set; }

        [Required]
        public int Stars { get; set; }

        [Required]
        [StringLength(200, ErrorMessage = "Maximum length is 200 characters.")]
        public string Description { get; set; }

        [Required]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime Date { get; set; }

        [NotMapped]
        [JsonIgnore]
        public virtual Toilet? Toilet { get; set; }
      
        [ForeignKey(nameof(Toilet))]
        public string ToiletUid { get; set; }
        //asd
        public string userUid { get; set; }
        public Opinion()
        {
            Uid = Guid.NewGuid().ToString();
        }
    }
}

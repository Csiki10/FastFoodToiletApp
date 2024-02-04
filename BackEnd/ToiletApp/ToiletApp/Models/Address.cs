using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ToiletApp.Models
{
    public class Address
    {
        [Key]
        public string Uid { get; set; }

        [Required]
        [StringLength(40, MinimumLength = 2, ErrorMessage = "City name must be minimum 2 letter long.")]
        [MaxLength(40, ErrorMessage = "City name max length is 40 letter.")]
        public string City { get; set; }

        [Required]
        [StringLength(40, MinimumLength = 2, ErrorMessage = "Street name must be minimum 2 letter long.")]
        [MaxLength(40, ErrorMessage = "Street name max length is 40 letter.")]
        public string Street { get; set; }

        [Required]
        [Range(1000,9999, ErrorMessage = "Post code Must be between 1000 and 9999.")]
        public int PostCode { get; set; }

        [NotMapped]
        [JsonIgnore]
        public virtual Toilet? Toilet { get; set; }

        [ForeignKey(nameof(Toilet))]

        public string? ToiletUid { get; set; }

        public Address()
        {
            Uid = Guid.NewGuid().ToString();
        }

        public override bool Equals(object? obj)
        {
            return obj is Address address &&
                   City == address.City &&
                   Street == address.Street &&
                   PostCode == address.PostCode;
        }
    }
}

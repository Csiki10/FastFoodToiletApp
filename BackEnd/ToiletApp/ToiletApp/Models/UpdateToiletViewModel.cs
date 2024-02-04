namespace ToiletApp.Models
{
    public class UpdateToiletViewModel
    {
        public string Id { get; set; }

        public string Code { get; set; }
        public string userId { get; set; }

        public virtual Address Address { get; set; }

        public Institution Institution { get; set; }

        public string? ImageUrl { get; set; }
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ToiletApp.Models;

namespace ToiletApp.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Opinion> Opinions { get; set; }
        public DbSet<Toilet> Toilets { get; set; }
        public DbSet<SiteUser> Users { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<IdentityRole>().HasData(
                   new { Id = "1", Name = "Admin", NormalizeName = "ADMIN" },
                   new { Id = "2", Name = "Customer", NormalizeName = "CUSTOMER" }
               );

            //PasswordHasher<SiteUser> passwordHasher = new PasswordHasher<SiteUser>();
            //SiteUser csiki = new SiteUser
            //{
            //    Id = Guid.NewGuid().ToString(),
            //    Email = "csiki@gmail.com",
            //    EmailConfirmed = true,
            //    UserName = "csiki123",
            //    FirstName = "Benedek",
            //    LastName = "Csikós",
            //    NormalizedUserName = "CSIKI123"
            //};
            //csiki.PasswordHash = passwordHasher.HashPassword(csiki, "alma123");
            //builder.Entity<SiteUser>().HasData(csiki);

            builder.Entity<Toilet>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Toilet>()
                .HasOne(t => t.Address)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Opinion>(entity =>
            {
                entity
                .HasOne(opinion => opinion.Toilet)
                .WithMany(toilet => toilet.Opinions)
                .HasForeignKey(opinion => opinion.ToiletUid)
                .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Toilet>()
                .HasOne(t => t.ToiletPicture)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(builder);
        }
    }
}
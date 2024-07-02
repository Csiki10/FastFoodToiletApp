using Microsoft.AspNetCore.Identity;
using ToiletApp.Data;
using ToiletApp.Models;

namespace ToiletApp.Services
{
    public class ToiletAppService : IToiletAppService
    {
        ApplicationDbContext db;
        

        public ToiletAppService(ApplicationDbContext db)
        {
            this.db = db;
        }

        public IEnumerable<Toilet> GetAllToilets()
        {
            return db.Toilets;
        }

        public Toilet? GetToilet(string id)
        {
            return db.Toilets.FirstOrDefault(t => t.Uid == id);
        }

        public void AddNewToilet(Toilet t,SiteUser user)
        {        
            if (t.Uid == null)
            {
                t.Uid = Guid.NewGuid().ToString();
            }

            var old = db.Toilets.FirstOrDefault(x => x.Equals(t));

            if (old == null)
            {
                t.User = user;
                t.UserId = user.Id;
                t.Address.ToiletUid = t.Uid;
                db.Toilets.Add(t);
                db.SaveChanges();
            }
        }

        public void UpdateToilet(UpdateToiletViewModel t)
        {
            var old = db.Toilets.FirstOrDefault(x => x.Uid == t.Id);
            if (old != null)
            {
                old.Code = t.Code;
                old.ImageUrl = t.ImageUrl;
                old.Institution = t.Institution;

                if (old.Address != null)
                {
                    old.Address.City = t.Address.City;
                    old.Address.Street = t.Address.Street;
                    old.Address.PostCode = t.Address.PostCode;
                }

                db.SaveChanges();
            }
        }

        public void DeleteToilet(string id)
        {
            var toilet = db.Toilets.FirstOrDefault(t => t.Uid == id);
            if (toilet != null)
            {
                db.Toilets.Remove(toilet);
                db.SaveChanges();
            }
        }

        public IEnumerable<Opinion> ListOpinions(string toiletUid)
        {
            var toilet = db.Toilets.FirstOrDefault(t => t.Uid == toiletUid);
            if (toilet == null)
            {
                return Enumerable.Empty<Opinion>();
            }
            else
            {
                return toilet.Opinions;
            }
        }

        public Opinion GetOpinion(string opinionUid)
        {
            var opinion = db.Opinions.FirstOrDefault(o => o.Uid == opinionUid);
            if(opinion != null)
            {
                return opinion;
            }
            else
            {
                return new Opinion();
            }
        }

        public void AddOpinion(Opinion opinion)
        {
            var toilet = db.Toilets.FirstOrDefault(t => t.Uid == opinion.ToiletUid);
            if (toilet == null)
            {

            }
            else
            {
                opinion.Toilet = toilet;
                opinion.Date = opinion.Date.AddDays(1);
                db.Opinions.Add(opinion);
                db.SaveChanges();
            }
        }

        public void DeleteOpinion(string tuid, string ouid)
        {
            var toilet = db.Toilets.FirstOrDefault(t => t.Uid == tuid);
            if (toilet != null)
            {
                var op = toilet.Opinions.FirstOrDefault(o => o.Uid == ouid);

                if (op != null)
                {
                    db.Opinions.Remove(op);
                    db.SaveChanges();
                }
            }
        }

        public void UpdateOpinion(UpdateOpinionViewmodel opinion)
        {
            var old = db.Opinions.FirstOrDefault(x => x.Uid == opinion.Id);
            if (old != null)
            {
                old.Stars = opinion.Stars;

                if (old.Date != opinion.Date)
                {
                    old.Date = opinion.Date.AddDays(1);
                }

                old.Description = opinion.Description;

                db.SaveChanges();
            }
        }
    }
}

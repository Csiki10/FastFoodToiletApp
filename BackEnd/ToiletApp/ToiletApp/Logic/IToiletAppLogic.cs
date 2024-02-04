using ToiletApp.Models;

namespace ToiletApp.Logic
{
    public interface IToiletAppLogic
    {
        void AddNewToilet(Toilet t, SiteUser user);
        void AddOpinion(Opinion opinion);
        void DeleteOpinion(string tuid, string ouid);
        void DeleteToilet(string id);
        IEnumerable<Toilet> GetAllToilets();
        Toilet? GetToilet(string id);
        IEnumerable<Opinion> ListOpinions(string toiletUid);
        void UpdateToilet(UpdateToiletViewModel t);
        void UpdateOpinion(UpdateOpinionViewmodel opinion);
        Opinion GetOpinion(string opinionUid);
    }
}
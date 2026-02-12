using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;

namespace buildtech_backend.Services.Interfaces
{
    public interface IAsignacionService
    {

        Task<IEnumerable<Asignacion>> GetAll();
        Task<Asignacion?> GetById(int id);
        Task<IEnumerable<Asignacion>> GetByObraId(int obraId);
        Task<IEnumerable<Asignacion>> GetByMaquinariaId(int maquinariaId);
        Task<IEnumerable<Asignacion>> GetActivas();
        Task<Asignacion> Create(CreateAsignacionDto dto);
        Task<Asignacion> Update(int id, UpdateAsignacionDto dto);
        Task<bool> Delete(int id);

    }
}

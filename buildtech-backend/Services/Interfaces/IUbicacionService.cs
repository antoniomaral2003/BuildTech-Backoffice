using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;

namespace buildtech_backend.Services.Interfaces
{
    public interface IUbicacionService
    {

        Task<IEnumerable<Ubicacion>> GetAll();
        Task<Ubicacion?> GetById(int id);
        Task<IEnumerable<Ubicacion>> GetByTipo(string tipo);
        Task<Ubicacion> Create(CreateUbicacionDto dto);
        Task<Ubicacion> Update(int id, UpdateUbicacionDto dto);
        Task<bool> Delete(int id);

    }
}

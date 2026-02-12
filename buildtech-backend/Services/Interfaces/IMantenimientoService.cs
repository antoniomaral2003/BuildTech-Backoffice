using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;

namespace buildtech_backend.Services.Interfaces
{
    public interface IMantenimientoService
    {

        Task<IEnumerable<Mantenimiento>> GetAll();
        Task<Mantenimiento?> GetById(int id);
        Task<IEnumerable<Mantenimiento>> GetByMaquinariaId(int maquinariaId);
        Task<IEnumerable<Mantenimiento>> GetProximos(int dias);
        Task<Mantenimiento> Create(CreateMantenimientoDto dto);
        Task<Mantenimiento> Update(int id, UpdateMantenimientoDto dto);
        Task<bool> Delete(int id);

    }
}

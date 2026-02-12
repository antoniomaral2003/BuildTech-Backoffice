using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;

namespace buildtech_backend.Services.Interfaces
{
    public interface ITipoMaquinariaService
    {

        Task<IEnumerable<TipoMaquinaria>> GetAll();
        Task<TipoMaquinaria?> GetById(int id);
        Task<IEnumerable<TipoMaquinaria>> GetByCategoriaId(int categoriaId);
        Task<TipoMaquinaria> Create(CreateTipoMaquinariaDto dto);
        Task<TipoMaquinaria> Update(int id, UpdateTipoMaquinariaDto dto);
        Task<bool> Delete(int id);

    }
}

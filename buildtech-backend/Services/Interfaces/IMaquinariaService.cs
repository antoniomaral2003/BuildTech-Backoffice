using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;

namespace buildtech_backend.Services.Interfaces
{
    public interface IMaquinariaService
    {

        Task<IEnumerable<Maquinaria>> GetAll();
        Task<Maquinaria?> GetById(int id);
        Task<Maquinaria> Create(CreateMaquinariaDto maquinaria);
        Task<Maquinaria> Update(int id, UpdateMaquinariaDto maquinaria);
        Task<bool> Delete(int id);
        Task<bool> ExistsByCodigoInterno(string codigoInterno);
        Task<IEnumerable<Maquinaria>> GetByEstado(string estado);

    }
}

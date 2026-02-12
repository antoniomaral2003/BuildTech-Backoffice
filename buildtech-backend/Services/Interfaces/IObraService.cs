using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;

namespace buildtech_backend.Services.Interfaces
{
    public interface IObraService
    {

        Task<IEnumerable<Obra>> GetAll();
        Task<Obra?> GetById(int id);
        Task<IEnumerable<Obra>> GetByEstado(string estado);
        Task<Obra> Create(CreateObraDto dto);
        Task<Obra> Update(int id, UpdateObraDto dto);
        Task<bool> Delete(int id);

    }
}

using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;

namespace buildtech_backend.Services.Interfaces
{
    public interface ICategoriaService
    {

        Task<IEnumerable<Categoria>> GetAll();
        Task<Categoria?> GetById(int id);
        Task<Categoria> Create(CreateCategoriaDto dto);
        Task<Categoria> Update(int id, UpdateCategoriaDto dto);
        Task<bool> Delete(int id);

    }
}

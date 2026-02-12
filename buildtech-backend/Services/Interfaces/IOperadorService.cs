using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;

namespace buildtech_backend.Services.Interfaces
{
    public interface IOperadorService
    {

        Task<IEnumerable<Operador>> GetAll();
        Task<Operador?> GetById(int id);
        Task<IEnumerable<Operador>> GetByEstado(string estado);
        Task<Operador> Create(CreateOperadorDto dto);
        Task<Operador> Update(int id, UpdateOperadorDto dto);
        Task<bool> Delete(int id);

    }
}

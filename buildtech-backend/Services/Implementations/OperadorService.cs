using buildtech_backend.Data;
using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;
using buildtech_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace buildtech_backend.Services.Implementations
{
    public class OperadorService : IOperadorService
    {

        private readonly ApplicationDbContext _context;

        public OperadorService(ApplicationDbContext context)
        { 
            _context = context; 
        }

        public async Task<Operador> Create(CreateOperadorDto dto)
        {

            if (await _context.Operadores.AnyAsync(o => o.Dni == dto.Dni))
                throw new InvalidOperationException($"Ya existe un operador con el documento {dto.Dni}");

            var operador = new Operador
            {
                Nombre = dto.Nombre,
                Apellidos = dto.Apellidos,
                Dni = dto.Dni,
                Telefono = dto.Telefono,
                Email = dto.Email,
                Licencias = dto.Licencias,
                Estado = "Activo",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Operadores.Add(operador);
            await _context.SaveChangesAsync();

            return await GetById(operador.Id) ?? operador;

        }

        public async Task<bool> Delete(int id)
        {

            var operador = await _context.Operadores
                .Include(o => o.Asignaciones)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (operador == null)
                return false;

            if (operador.Asignaciones.Any(a => a.Estado == "En Curso" || a.Estado == "Programada"))
                throw new InvalidOperationException("No se puede eliminar un operador con asignaciones activas");

            _context.Operadores.Remove(operador);
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<IEnumerable<Operador>> GetAll()
        {

            return await _context.Operadores
                .OrderBy(o => o.Apellidos)
                .ThenBy(o => o.Nombre)
                .ToListAsync();

        }

        public async Task<IEnumerable<Operador>> GetByEstado(string estado)
        {

            return await _context.Operadores
                .Where(o => o.Estado == estado)
                .OrderBy(o => o.Apellidos)
                .ToListAsync();

        }

        public async Task<Operador?> GetById(int id)
        {

            return await _context.Operadores
                .Include(o => o.Asignaciones)
                .FirstOrDefaultAsync(o => o.Id == id);

        }

        public async Task<Operador> Update(int id, UpdateOperadorDto dto)
        {

            var existing = await _context.Operadores.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Operador con ID {id} no encontrado");

            if (dto.Dni != existing.Dni &&
                await _context.Operadores.AnyAsync(o => o.Dni == dto.Dni && o.Id != id))
                throw new InvalidOperationException($"Ya existe un operador con el documento {dto.Dni}");

            existing.Nombre = dto.Nombre;
            existing.Apellidos = dto.Apellidos;
            existing.Dni = dto.Dni;
            existing.Telefono = dto.Telefono;
            existing.Email = dto.Email;
            existing.Licencias = dto.Licencias;
            existing.Estado = dto.Estado;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetById(id) ?? existing;

        }
    }
}

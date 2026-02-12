using buildtech_backend.Data;
using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;
using buildtech_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace buildtech_backend.Services.Implementations
{
    public class UbicacionService : IUbicacionService
    {

        private readonly ApplicationDbContext _context;

        public UbicacionService(ApplicationDbContext context)
        { 
            _context = context; 
        }

        public async Task<Ubicacion> Create(CreateUbicacionDto dto)
        {

            if (await _context.Ubicaciones.AnyAsync(u => u.Nombre == dto.Nombre))
                throw new InvalidOperationException($"Ya existe una ubicación con el nombre {dto.Nombre}");

            var ubicacion = new Ubicacion
            {
                Nombre = dto.Nombre,
                Tipo = dto.Tipo,
                Direccion = dto.Direccion,
                Ciudad = dto.Ciudad,
                CodigoPostal = dto.CodigoPostal,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Ubicaciones.Add(ubicacion);
            await _context.SaveChangesAsync();

            return await GetById(ubicacion.Id) ?? ubicacion;

        }

        public async Task<bool> Delete(int id)
        {

            var ubicacion = await _context.Ubicaciones
                .Include(u => u.Maquinarias)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (ubicacion == null)
                return false;

            if (ubicacion.Maquinarias.Any())
                throw new InvalidOperationException("No se puede eliminar una ubicación que tiene maquinaria asignada");

            _context.Ubicaciones.Remove(ubicacion);
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<IEnumerable<Ubicacion>> GetAll()
        {

            return await _context.Ubicaciones
                .OrderBy(u => u.Nombre)
                .ToListAsync();

        }

        public async Task<Ubicacion?> GetById(int id)
        {

            return await _context.Ubicaciones
                .Include(u => u.Maquinarias)
                .FirstOrDefaultAsync(u => u.Id == id);

        }

        public async Task<IEnumerable<Ubicacion>> GetByTipo(string tipo)
        {

            return await _context.Ubicaciones
                .Where(u => u.Tipo == tipo)
                .OrderBy(u => u.Nombre)
                .ToListAsync();

        }

        public async Task<Ubicacion> Update(int id, UpdateUbicacionDto dto)
        {

            var existing = await _context.Ubicaciones.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Ubicación con ID {id} no encontrada");

            if (dto.Nombre != existing.Nombre &&
                await _context.Ubicaciones.AnyAsync(u => u.Nombre == dto.Nombre && u.Id != id))
                throw new InvalidOperationException($"Ya existe una ubicación con el nombre {dto.Nombre}");

            existing.Nombre = dto.Nombre;
            existing.Tipo = dto.Tipo;
            existing.Direccion = dto.Direccion;
            existing.Ciudad = dto.Ciudad;
            existing.CodigoPostal = dto.CodigoPostal;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetById(id) ?? existing;

        }
    }
}

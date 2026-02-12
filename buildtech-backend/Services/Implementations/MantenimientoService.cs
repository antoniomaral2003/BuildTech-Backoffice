using buildtech_backend.Data;
using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;
using buildtech_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace buildtech_backend.Services.Implementations
{
    public class MantenimientoService : IMantenimientoService
    {

        private readonly ApplicationDbContext _context; 
        
        public MantenimientoService(ApplicationDbContext context)
        { 
            _context = context; 
        }

        public async Task<Mantenimiento> Create(CreateMantenimientoDto dto)
        {

            if (!await _context.Maquinarias.AnyAsync(m => m.Id == dto.MaquinariaId))
                throw new InvalidOperationException("La maquinaria especificada no existe");

            var mantenimiento = new Mantenimiento
            {
                MaquinariaId = dto.MaquinariaId,
                Tipo = dto.Tipo,
                FechaProgramada = dto.FechaProgramada,
                Descripcion = dto.Descripcion,
                HorasUsoMomento = dto.HorasUsoMomento,
                Taller = dto.Taller,
                Observaciones = dto.Observaciones,
                Estado = "Programado",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Mantenimientos.Add(mantenimiento);
            await _context.SaveChangesAsync();

            return await GetById(mantenimiento.Id) ?? mantenimiento;

        }

        public async Task<bool> Delete(int id)
        {

            var mantenimiento = await _context.Mantenimientos.FindAsync(id);

            if (mantenimiento == null)
                return false;

            if (mantenimiento.Estado == "En Proceso")
                throw new InvalidOperationException("No se puede eliminar un mantenimiento en proceso");

            _context.Mantenimientos.Remove(mantenimiento);
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<IEnumerable<Mantenimiento>> GetAll()
        {

            return await _context.Mantenimientos
                .Include(m => m.Maquinaria)
                .OrderByDescending(m => m.FechaProgramada)
                .ToListAsync();

        }

        public async Task<Mantenimiento?> GetById(int id)
        {

            return await _context.Mantenimientos
                .Include(m => m.Maquinaria)
                .FirstOrDefaultAsync(m => m.Id == id);

        }

        public async Task<IEnumerable<Mantenimiento>> GetByMaquinariaId(int maquinariaId)
        {

            return await _context.Mantenimientos
                .Where(m => m.MaquinariaId == maquinariaId)
                .OrderByDescending(m => m.FechaProgramada)
                .ToListAsync();

        }

        public async Task<IEnumerable<Mantenimiento>> GetProximos(int dias)
        {

            var fechaLimite = DateTime.UtcNow.AddDays(dias);
            return await _context.Mantenimientos
                .Include(m => m.Maquinaria)
                .Where(m => m.Estado == "Programado" &&
                           m.FechaProgramada.HasValue &&
                           m.FechaProgramada <= fechaLimite)
                .OrderBy(m => m.FechaProgramada)
                .ToListAsync();

        }

        public async Task<Mantenimiento> Update(int id, UpdateMantenimientoDto dto)
        {

            var existing = await _context.Mantenimientos
                .Include(m => m.Maquinaria)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (existing == null)
                throw new KeyNotFoundException($"Mantenimiento con ID {id} no encontrado");

            if (!await _context.Maquinarias.AnyAsync(m => m.Id == dto.MaquinariaId))
                throw new InvalidOperationException("La maquinaria especificada no existe");

            existing.MaquinariaId = dto.MaquinariaId;
            existing.Tipo = dto.Tipo;
            existing.FechaProgramada = dto.FechaProgramada;
            existing.FechaInicio = dto.FechaInicio;
            existing.FechaFin = dto.FechaFin;
            existing.Descripcion = dto.Descripcion;
            existing.HorasUsoMomento = dto.HorasUsoMomento;
            existing.Taller = dto.Taller;
            existing.Costo = dto.Costo;
            existing.Observaciones = dto.Observaciones;
            existing.Estado = dto.Estado;
            existing.UpdatedAt = DateTime.UtcNow;

            // Actualizar estado de maquinaria según estado del mantenimiento
            if (dto.Estado == "En Proceso" && existing.Maquinaria != null)
            {
                existing.Maquinaria.Estado = "En Mantenimiento";
                existing.Maquinaria.UpdatedAt = DateTime.UtcNow;
            }
            else if (dto.Estado == "Completado" && existing.Maquinaria != null)
            {
                existing.Maquinaria.Estado = "Disponible";
                existing.Maquinaria.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return await GetById(id) ?? existing;

        }
    }
}

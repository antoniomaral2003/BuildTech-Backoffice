using buildtech_backend.Data;
using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;
using buildtech_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace buildtech_backend.Services.Implementations
{
    public class AsignacionService : IAsignacionService
    {

        private readonly ApplicationDbContext _context;

        public AsignacionService(ApplicationDbContext context)
        { 
            _context = context; 
        }

        public async Task<Asignacion> Create(CreateAsignacionDto dto)
        {

            if (!await _context.Obras.AnyAsync(o => o.Id == dto.ObraId))
                throw new InvalidOperationException("La obra especificada no existe");

            if (!await _context.Maquinarias.AnyAsync(m => m.Id == dto.MaquinariaId))
                throw new InvalidOperationException("La maquinaria especificada no existe");

            if (dto.OperadorId.HasValue && !await _context.Operadores.AnyAsync(o => o.Id == dto.OperadorId))
                throw new InvalidOperationException("El operador especificado no existe");

            if (dto.FechaFinEstimada < dto.FechaInicio)
                throw new InvalidOperationException("La fecha fin estimada no puede ser anterior a la fecha de inicio");

            // Verificar que la maquinaria esté disponible
            var maquinaria = await _context.Maquinarias.FindAsync(dto.MaquinariaId);
            if (maquinaria?.Estado != "Disponible")
                throw new InvalidOperationException("La maquinaria no está disponible para asignación");

            // Verificar solapamiento de fechas
            var haySolapamiento = await _context.Asignaciones
                .AnyAsync(a => a.MaquinariaId == dto.MaquinariaId &&
                              (a.Estado == "En Curso" || a.Estado == "Programada") &&
                              ((dto.FechaInicio >= a.FechaInicio && dto.FechaInicio <= a.FechaFinEstimada) ||
                               (dto.FechaFinEstimada >= a.FechaInicio && dto.FechaFinEstimada <= a.FechaFinEstimada)));

            if (haySolapamiento)
                throw new InvalidOperationException("La maquinaria ya tiene una asignación en ese periodo");

            var asignacion = new Asignacion
            {
                ObraId = dto.ObraId,
                MaquinariaId = dto.MaquinariaId,
                OperadorId = dto.OperadorId,
                FechaInicio = dto.FechaInicio,
                FechaFinEstimada = dto.FechaFinEstimada,
                CondicionesEntrega = dto.CondicionesEntrega,
                Observaciones = dto.Observaciones,
                Estado = "Programada",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Asignaciones.Add(asignacion);

            // Actualizar estado de maquinaria
            if (maquinaria != null)
            {
                maquinaria.Estado = "Asignada";
                maquinaria.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return await GetById(asignacion.Id) ?? asignacion;

        }

        public async Task<bool> Delete(int id)
        {

            var asignacion = await _context.Asignaciones
                .Include(a => a.Maquinaria)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (asignacion == null)
                return false;

            if (asignacion.Estado == "En Curso")
                throw new InvalidOperationException("No se puede eliminar una asignación en curso");

            // Liberar la maquinaria si estaba asignada
            if (asignacion.Maquinaria != null && asignacion.Maquinaria.Estado == "Asignada")
            {
                asignacion.Maquinaria.Estado = "Disponible";
                asignacion.Maquinaria.UpdatedAt = DateTime.UtcNow;
            }

            _context.Asignaciones.Remove(asignacion);
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<IEnumerable<Asignacion>> GetActivas()
        {

            return await _context.Asignaciones
                .Include(a => a.Obra)
                .Include(a => a.Maquinaria)
                .Include(a => a.Operador)
                .Where(a => a.Estado == "En Curso")
                .ToListAsync();

        }

        public async Task<IEnumerable<Asignacion>> GetAll()
        {

            return await _context.Asignaciones
                .Include(a => a.Obra)
                .Include(a => a.Maquinaria)
                .Include(a => a.Operador)
                .OrderByDescending(a => a.FechaInicio)
                .ToListAsync();

        }

        public async Task<Asignacion?> GetById(int id)
        {

            return await _context.Asignaciones
                .Include(a => a.Obra)
                .Include(a => a.Maquinaria)
                .Include(a => a.Operador)
                .FirstOrDefaultAsync(a => a.Id == id);

        }

        public async Task<IEnumerable<Asignacion>> GetByMaquinariaId(int maquinariaId)
        {

            return await _context.Asignaciones
                .Include(a => a.Obra)
                .Include(a => a.Operador)
                .Where(a => a.MaquinariaId == maquinariaId)
                .OrderByDescending(a => a.FechaInicio)
                .ToListAsync();

        }

        public async Task<IEnumerable<Asignacion>> GetByObraId(int obraId)
        {

            return await _context.Asignaciones
                .Include(a => a.Maquinaria)
                .Include(a => a.Operador)
                .Where(a => a.ObraId == obraId)
                .OrderByDescending(a => a.FechaInicio)
                .ToListAsync();

        }

        public async Task<Asignacion> Update(int id, UpdateAsignacionDto dto)
        {

            var existing = await _context.Asignaciones
                .Include(a => a.Maquinaria)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (existing == null)
                throw new KeyNotFoundException($"Asignación con ID {id} no encontrada");

            if (!await _context.Obras.AnyAsync(o => o.Id == dto.ObraId))
                throw new InvalidOperationException("La obra especificada no existe");

            if (!await _context.Maquinarias.AnyAsync(m => m.Id == dto.MaquinariaId))
                throw new InvalidOperationException("La maquinaria especificada no existe");

            if (dto.OperadorId.HasValue && !await _context.Operadores.AnyAsync(o => o.Id == dto.OperadorId))
                throw new InvalidOperationException("El operador especificado no existe");

            if (dto.FechaFinEstimada < dto.FechaInicio)
                throw new InvalidOperationException("La fecha fin estimada no puede ser anterior a la fecha de inicio");

            existing.ObraId = dto.ObraId;
            existing.MaquinariaId = dto.MaquinariaId;
            existing.OperadorId = dto.OperadorId;
            existing.FechaInicio = dto.FechaInicio;
            existing.FechaFinEstimada = dto.FechaFinEstimada;
            existing.FechaEntregaReal = dto.FechaEntregaReal;
            existing.FechaDevolucionReal = dto.FechaDevolucionReal;
            existing.CondicionesEntrega = dto.CondicionesEntrega;
            existing.Observaciones = dto.Observaciones;
            existing.Estado = dto.Estado;
            existing.UpdatedAt = DateTime.UtcNow;

            // Si la asignación se finaliza, liberar la maquinaria
            if (dto.Estado == "Finalizada" && existing.Maquinaria != null)
            {
                existing.Maquinaria.Estado = "Disponible";
                existing.Maquinaria.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return await GetById(id) ?? existing;

        }
    }
}

using buildtech_backend.Data;
using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;
using buildtech_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace buildtech_backend.Services.Implementations
{
    public class MaquinariaService : IMaquinariaService
    {

        private readonly ApplicationDbContext _context;

        public MaquinariaService(ApplicationDbContext context) 
        { 
            _context = context;
        }

        public async Task<Maquinaria> Create(CreateMaquinariaDto dto)
        {

            // Validaciones de negocio
            if (await _context.Maquinarias.AnyAsync(m => m.CodigoInterno == dto.CodigoInterno))
                throw new InvalidOperationException($"Ya existe una maquinaria con el código interno {dto.CodigoInterno}");

            if (await _context.Maquinarias.AnyAsync(m => m.NumeroSerie == dto.NumeroSerie))
                throw new InvalidOperationException($"Ya existe una maquinaria con el número de serie {dto.NumeroSerie}");

            if (dto.AnioFabricacion > DateTime.UtcNow.Year)
                throw new InvalidOperationException("El año de fabricación no puede ser futuro");

            // Validar que el tipo existe
            if (!await _context.TiposMaquinaria.AnyAsync(t => t.Id == dto.TipoId))
                throw new InvalidOperationException("El tipo de maquinaria especificado no existe");

            var maquinaria = new Maquinaria
            {
                CodigoInterno = dto.CodigoInterno,
                TipoId = dto.TipoId,
                Marca = dto.Marca,
                Modelo = dto.Modelo,
                AnioFabricacion = dto.AnioFabricacion,
                NumeroSerie = dto.NumeroSerie,
                UbicacionId = dto.UbicacionId,
                Observaciones = dto.Observaciones,
                Estado = "Disponible",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Maquinarias.Add(maquinaria);
            await _context.SaveChangesAsync();

            return await GetById(maquinaria.Id) ?? maquinaria;

        }

        public async Task<bool> Delete(int id)
        {

            var maquinaria = await _context.Maquinarias
                .Include(m => m.Asignaciones)
                .Include(m => m.Mantenimientos)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (maquinaria == null)
                return false;

            // Validación de negocio: no eliminar si tiene asignaciones activas
            if (maquinaria.Asignaciones.Any(a => a.Estado == "En Curso" || a.Estado == "Programada"))
                throw new InvalidOperationException("No se puede eliminar una maquinaria con asignaciones activas");

            _context.Maquinarias.Remove(maquinaria);
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<bool> ExistsByCodigoInterno(string codigoInterno)
        {
            return await _context.Maquinarias.AnyAsync(m => m.CodigoInterno == codigoInterno);
        }

        public async Task<IEnumerable<Maquinaria>> GetAll()
        {

            return await _context.Maquinarias
                .Include(m => m.Tipo)
                    .ThenInclude(t => t.Categoria)
                .Include(m => m.Ubicacion)
                .OrderBy(m => m.CodigoInterno)
                .ToListAsync();

        }

        public async Task<IEnumerable<Maquinaria>> GetByEstado(string estado)
        {

            return await _context.Maquinarias
                .Include(m => m.Tipo)
                .Include(m => m.Ubicacion)
                .Where(m => m.Estado == estado)
                .OrderBy(m => m.CodigoInterno)
                .ToListAsync();

        }

        public async Task<Maquinaria?> GetById(int id)
        {

            return await _context.Maquinarias
                .Include(m => m.Tipo)
                    .ThenInclude(t => t.Categoria)
                .Include(m => m.Ubicacion)
                .Include(m => m.Asignaciones)
                .Include(m => m.Mantenimientos)
                .FirstOrDefaultAsync(m => m.Id == id);

        }

        public async Task<Maquinaria> Update(int id, UpdateMaquinariaDto dto)
        {

            var existing = await _context.Maquinarias.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Maquinaria con ID {id} no encontrada");

            // Validar código interno duplicado
            if (dto.CodigoInterno != existing.CodigoInterno &&
                await _context.Maquinarias.AnyAsync(m => m.CodigoInterno == dto.CodigoInterno && m.Id != id))
                throw new InvalidOperationException($"Ya existe una maquinaria con el código interno {dto.CodigoInterno}");

            // Validar número de serie duplicado
            if (dto.NumeroSerie != existing.NumeroSerie &&
                await _context.Maquinarias.AnyAsync(m => m.NumeroSerie == dto.NumeroSerie && m.Id != id))
                throw new InvalidOperationException($"Ya existe una maquinaria con el número de serie {dto.NumeroSerie}");

            // Validar cambio de estado
            if (dto.Estado != existing.Estado)
            {
                await ValidarCambioEstadoAsync(existing, dto.Estado);
            }

            existing.CodigoInterno = dto.CodigoInterno;
            existing.TipoId = dto.TipoId;
            existing.Marca = dto.Marca;
            existing.Modelo = dto.Modelo;
            existing.AnioFabricacion = dto.AnioFabricacion;
            existing.NumeroSerie = dto.NumeroSerie;
            existing.Estado = dto.Estado;
            existing.UbicacionId = dto.UbicacionId;
            existing.Observaciones = dto.Observaciones;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetById(id) ?? existing;

        }

        private async Task ValidarCambioEstadoAsync(Maquinaria maquinaria, string nuevoEstado)
        {

            // Validar que no esté en una asignación activa si se quiere cambiar a "En Mantenimiento"
            if (nuevoEstado == "En Mantenimiento")
            {
                var tieneAsignacionActiva = await _context.Asignaciones
                    .AnyAsync(a => a.MaquinariaId == maquinaria.Id &&
                                   (a.Estado == "En Curso" || a.Estado == "Programada"));

                if (tieneAsignacionActiva)
                    throw new InvalidOperationException("No se puede enviar a mantenimiento una maquinaria con asignaciones activas");
            }

        }

    }
}

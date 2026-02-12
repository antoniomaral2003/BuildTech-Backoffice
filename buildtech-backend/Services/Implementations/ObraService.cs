using buildtech_backend.Data;
using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;
using buildtech_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace buildtech_backend.Services.Implementations
{
    public class ObraService : IObraService
    {

        private readonly ApplicationDbContext _context;

        public ObraService(ApplicationDbContext context)
        { 
            _context = context; 
        }

        public async Task<Obra> Create(CreateObraDto dto)
        {

            if (!string.IsNullOrEmpty(dto.Codigo) &&
                await _context.Obras.AnyAsync(o => o.Codigo == dto.Codigo))
                throw new InvalidOperationException($"Ya existe una obra con el código {dto.Codigo}");

            if (dto.FechaFinEstimada.HasValue && dto.FechaInicio.HasValue &&
                dto.FechaFinEstimada < dto.FechaInicio)
                throw new InvalidOperationException("La fecha fin estimada no puede ser anterior a la fecha de inicio");

            var obra = new Obra
            {
                Nombre = dto.Nombre,
                Codigo = dto.Codigo,
                Direccion = dto.Direccion,
                Ciudad = dto.Ciudad,
                ResponsableNombre = dto.ResponsableNombre,
                ResponsableTelefono = dto.ResponsableTelefono,
                ResponsableEmail = dto.ResponsableEmail,
                FechaInicio = dto.FechaInicio,
                FechaFinEstimada = dto.FechaFinEstimada,
                Estado = "Planificada",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Obras.Add(obra);
            await _context.SaveChangesAsync();

            return await GetById(obra.Id) ?? obra;

        }

        public async Task<bool> Delete(int id)
        {

            var obra = await _context.Obras
                .Include(o => o.Asignaciones)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (obra == null)
                return false;

            if (obra.Asignaciones.Any(a => a.Estado == "En Curso" || a.Estado == "Programada"))
                throw new InvalidOperationException("No se puede eliminar una obra con asignaciones activas");

            _context.Obras.Remove(obra);
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<IEnumerable<Obra>> GetAll()
        {

            return await _context.Obras
                .Include(o => o.Asignaciones)
                .OrderByDescending(o => o.FechaInicio)
                .ToListAsync();

        }

        public async Task<IEnumerable<Obra>> GetByEstado(string estado)
        {

            return await _context.Obras
                .Where(o => o.Estado == estado)
                .OrderByDescending(o => o.FechaInicio)
                .ToListAsync();

        }

        public async Task<Obra?> GetById(int id)
        {

            return await _context.Obras
                .Include(o => o.Asignaciones)
                    .ThenInclude(a => a.Maquinaria)
                .FirstOrDefaultAsync(o => o.Id == id);

        }

        public async Task<Obra> Update(int id, UpdateObraDto dto)
        {

            var existing = await _context.Obras.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Obra con ID {id} no encontrada");

            if (!string.IsNullOrEmpty(dto.Codigo) && dto.Codigo != existing.Codigo &&
                await _context.Obras.AnyAsync(o => o.Codigo == dto.Codigo && o.Id != id))
                throw new InvalidOperationException($"Ya existe una obra con el código {dto.Codigo}");

            if (dto.FechaFinEstimada.HasValue && dto.FechaInicio.HasValue &&
                dto.FechaFinEstimada < dto.FechaInicio)
                throw new InvalidOperationException("La fecha fin estimada no puede ser anterior a la fecha de inicio");

            existing.Nombre = dto.Nombre;
            existing.Codigo = dto.Codigo;
            existing.Direccion = dto.Direccion;
            existing.Ciudad = dto.Ciudad;
            existing.ResponsableNombre = dto.ResponsableNombre;
            existing.ResponsableTelefono = dto.ResponsableTelefono;
            existing.ResponsableEmail = dto.ResponsableEmail;
            existing.FechaInicio = dto.FechaInicio;
            existing.FechaFinEstimada = dto.FechaFinEstimada;
            existing.Estado = dto.Estado;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetById(id) ?? existing;

        }
    }
}

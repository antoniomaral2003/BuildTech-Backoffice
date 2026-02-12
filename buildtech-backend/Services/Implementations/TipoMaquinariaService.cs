using buildtech_backend.Data;
using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;
using buildtech_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace buildtech_backend.Services.Implementations
{
    public class TipoMaquinariaService : ITipoMaquinariaService
    {

        private readonly ApplicationDbContext _context;

        public TipoMaquinariaService(ApplicationDbContext context)
        { 
            _context = context; 
        }

        public async Task<TipoMaquinaria> Create(CreateTipoMaquinariaDto dto)
        {

            if (!await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId))
                throw new InvalidOperationException("La categoría especificada no existe");

            if (await _context.TiposMaquinaria.AnyAsync(t => t.Nombre == dto.Nombre && t.CategoriaId == dto.CategoriaId))
                throw new InvalidOperationException($"Ya existe un tipo '{dto.Nombre}' en esta categoría");

            var tipo = new TipoMaquinaria
            {
                Nombre = dto.Nombre,
                CategoriaId = dto.CategoriaId,
                Descripcion = dto.Descripcion,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.TiposMaquinaria.Add(tipo);
            await _context.SaveChangesAsync();

            return await GetById(tipo.Id) ?? tipo;

        }

        public async Task<bool> Delete(int id)
        {

            var tipo = await _context.TiposMaquinaria
                .Include(t => t.Maquinarias)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tipo == null)
                return false;

            if (tipo.Maquinarias.Any())
                throw new InvalidOperationException("No se puede eliminar un tipo de maquinaria que tiene máquinas asociadas");

            _context.TiposMaquinaria.Remove(tipo);
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<IEnumerable<TipoMaquinaria>> GetAll()
        {

            return await _context.TiposMaquinaria
                .Include(t => t.Categoria)
                .OrderBy(t => t.Nombre)
                .ToListAsync();

        }

        public async Task<IEnumerable<TipoMaquinaria>> GetByCategoriaId(int categoriaId)
        {

            return await _context.TiposMaquinaria
                .Where(t => t.CategoriaId == categoriaId)
                .OrderBy(t => t.Nombre)
                .ToListAsync();

        }

        public async Task<TipoMaquinaria?> GetById(int id)
        {

            return await _context.TiposMaquinaria
                .Include(t => t.Categoria)
                .Include(t => t.Maquinarias)
                .FirstOrDefaultAsync(t => t.Id == id);

        }

        public async Task<TipoMaquinaria> Update(int id, UpdateTipoMaquinariaDto dto)
        {

            var existing = await _context.TiposMaquinaria.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Tipo de maquinaria con ID {id} no encontrado");

            if (!await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId))
                throw new InvalidOperationException("La categoría especificada no existe");

            if ((dto.Nombre != existing.Nombre || dto.CategoriaId != existing.CategoriaId) &&
                await _context.TiposMaquinaria.AnyAsync(t => t.Nombre == dto.Nombre && t.CategoriaId == dto.CategoriaId && t.Id != id))
                throw new InvalidOperationException($"Ya existe un tipo '{dto.Nombre}' en esta categoría");

            existing.Nombre = dto.Nombre;
            existing.CategoriaId = dto.CategoriaId;
            existing.Descripcion = dto.Descripcion;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetById(id) ?? existing;

        }
    }
}

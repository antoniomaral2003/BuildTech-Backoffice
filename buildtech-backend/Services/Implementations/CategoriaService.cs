using buildtech_backend.Data;
using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;
using buildtech_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace buildtech_backend.Services.Implementations
{
    public class CategoriaService : ICategoriaService
    {

        private readonly ApplicationDbContext _context;

        public CategoriaService(ApplicationDbContext context) 
        {
            _context = context; 
        }

        public async Task<Categoria> Create(CreateCategoriaDto dto)
        {

            if (await _context.Categorias.AnyAsync(c => c.Nombre == dto.Nombre))
                throw new InvalidOperationException($"Ya existe una categoría con el nombre {dto.Nombre}");

            var categoria = new Categoria
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return await GetById(categoria.Id) ?? categoria;

        }

        public async Task<bool> Delete(int id)
        {

            var categoria = await _context.Categorias
                .Include(c => c.TiposMaquinaria)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (categoria == null)
                return false;

            if (categoria.TiposMaquinaria.Any())
                throw new InvalidOperationException("No se puede eliminar una categoría que tiene tipos de maquinaria asociados");

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<IEnumerable<Categoria>> GetAll()
        {

            return await _context.Categorias
                .Include(c => c.TiposMaquinaria)
                .OrderBy(c => c.Nombre)
                .ToListAsync();

        }

        public async Task<Categoria?> GetById(int id)
        {

            return await _context.Categorias
                .Include(c => c.TiposMaquinaria)
                .FirstOrDefaultAsync(c => c.Id == id);

        }

        public async Task<Categoria> Update(int id, UpdateCategoriaDto dto)
        {

            var existing = await _context.Categorias.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Categoría con ID {id} no encontrada");

            if (dto.Nombre != existing.Nombre &&
                await _context.Categorias.AnyAsync(c => c.Nombre == dto.Nombre && c.Id != id))
                throw new InvalidOperationException($"Ya existe una categoría con el nombre {dto.Nombre}");

            existing.Nombre = dto.Nombre;
            existing.Descripcion = dto.Descripcion;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetById(id) ?? existing;

        }
    }
}

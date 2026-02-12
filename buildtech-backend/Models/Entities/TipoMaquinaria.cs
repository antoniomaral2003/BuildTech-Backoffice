namespace buildtech_backend.Models.Entities
{
    public class TipoMaquinaria
    {

        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int CategoriaId { get; set; }
        public string? Descripcion { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Categoria Categoria { get; set; } = null!;
        public ICollection<Maquinaria> Maquinarias { get; set; } = new List<Maquinaria>();

    }
}

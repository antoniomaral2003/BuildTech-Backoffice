namespace buildtech_backend.Models.Entities
{
    public class Categoria
    {

        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TipoMaquinaria> TiposMaquinaria { get; set; } = new List<TipoMaquinaria>();

    }
}

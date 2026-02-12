namespace buildtech_backend.Models.Entities
{
    public class Ubicacion
    {

        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string? Ciudad { get; set; }
        public string CodigoPostal { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Maquinaria> Maquinarias { get; set; } = new List<Maquinaria>();

    }
}

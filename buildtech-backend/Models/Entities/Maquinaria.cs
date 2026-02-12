namespace buildtech_backend.Models.Entities
{
    public class Maquinaria
    {

        public int Id { get; set; }
        public string CodigoInterno { get; set; } = string.Empty;
        public int TipoId { get; set; }
        public string Marca { get; set; } = string.Empty;
        public string Modelo { get; set; } = string.Empty;
        public int AnioFabricacion { get; set; }
        public string NumeroSerie { get; set; } = string.Empty;
        public string Estado { get; set; } = "Disponible";
        public int? UbicacionId { get; set; }
        public string? Observaciones { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public TipoMaquinaria Tipo { get; set; } = null!;
        public Ubicacion? Ubicacion { get; set; }
        public ICollection<Asignacion> Asignaciones { get; set; } = new List<Asignacion>();
        public ICollection<Mantenimiento> Mantenimientos { get; set; } = new List<Mantenimiento>();

    }
}

namespace buildtech_backend.Models.Entities
{
    public class Mantenimiento
    {

        public int Id { get; set; }
        public int MaquinariaId { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public DateTime? FechaProgramada { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int? HorasUsoMomento { get; set; }
        public string? Taller { get; set; }
        public decimal? Costo { get; set; }
        public string? Observaciones { get; set; }
        public string Estado { get; set; } = "Programado";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Maquinaria Maquinaria { get; set; } = null!;

    }
}

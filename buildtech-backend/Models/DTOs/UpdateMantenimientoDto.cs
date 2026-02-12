namespace buildtech_backend.Models.DTOs
{
    public class UpdateMantenimientoDto
    {
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
        public string Estado { get; set; } = string.Empty;
    }
}

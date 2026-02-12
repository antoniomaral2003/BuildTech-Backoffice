namespace buildtech_backend.Models.DTOs
{
    public class CreateMantenimientoDto
    {
        public int MaquinariaId { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public DateTime? FechaProgramada { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int? HorasUsoMomento { get; set; }
        public string? Taller { get; set; }
        public string? Observaciones { get; set; }
    }
}

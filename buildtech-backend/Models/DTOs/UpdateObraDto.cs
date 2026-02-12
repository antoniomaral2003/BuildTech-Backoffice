namespace buildtech_backend.Models.DTOs
{
    public class UpdateObraDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string? Codigo { get; set; }
        public string Direccion { get; set; } = string.Empty;
        public string? Ciudad { get; set; }
        public string? ResponsableNombre { get; set; }
        public string? ResponsableTelefono { get; set; }
        public string? ResponsableEmail { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFinEstimada { get; set; }
        public string Estado { get; set; } = string.Empty;
    }
}

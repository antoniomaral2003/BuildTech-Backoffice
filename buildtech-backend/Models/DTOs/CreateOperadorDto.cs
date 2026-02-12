namespace buildtech_backend.Models.DTOs
{
    public class CreateOperadorDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Apellidos { get; set; } = string.Empty;
        public string Dni { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public string? Licencias { get; set; }
    }
}

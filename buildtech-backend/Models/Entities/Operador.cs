namespace buildtech_backend.Models.Entities
{
    public class Operador
    {

        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellidos { get; set; } = string.Empty;
        public string Dni { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public string? Licencias { get; set; }
        public string Estado { get; set; } = "Activo";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Asignacion> Asignaciones { get; set; } = new List<Asignacion>();

    }
}

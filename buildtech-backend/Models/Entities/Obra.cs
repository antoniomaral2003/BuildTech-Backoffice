namespace buildtech_backend.Models.Entities
{
    public class Obra
    {

        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Codigo { get; set; }
        public string Direccion { get; set; } = string.Empty;
        public string? Ciudad { get; set; }
        public string? ResponsableNombre { get; set; }
        public string? ResponsableTelefono { get; set; }
        public string? ResponsableEmail { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFinEstimada { get; set; }
        public string Estado { get; set; } = "Activa";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Asignacion> Asignaciones { get; set; } = new List<Asignacion>();

    }
}

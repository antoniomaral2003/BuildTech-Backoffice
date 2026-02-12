namespace buildtech_backend.Models.Entities
{
    public class Asignacion
    {

        public int Id { get; set; }
        public int ObraId { get; set; }
        public int MaquinariaId { get; set; }
        public int? OperadorId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFinEstimada { get; set; }
        public DateTime? FechaEntregaReal { get; set; }
        public DateTime? FechaDevolucionReal { get; set; }
        public string? CondicionesEntrega { get; set; }
        public string? Observaciones { get; set; }
        public string Estado { get; set; } = "Programada";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Obra Obra { get; set; } = null!;
        public Maquinaria Maquinaria { get; set; } = null!;
        public Operador? Operador { get; set; }

    }
}

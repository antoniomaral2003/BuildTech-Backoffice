namespace buildtech_backend.Models.DTOs
{
    public class UpdateAsignacionDto
    {
        public int ObraId { get; set; }
        public int MaquinariaId { get; set; }
        public int? OperadorId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFinEstimada { get; set; }
        public DateTime? FechaEntregaReal { get; set; }
        public DateTime? FechaDevolucionReal { get; set; }
        public string? CondicionesEntrega { get; set; }
        public string? Observaciones { get; set; }
        public string Estado { get; set; } = string.Empty;
    }
}

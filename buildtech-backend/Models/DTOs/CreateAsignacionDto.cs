namespace buildtech_backend.Models.DTOs
{
    public class CreateAsignacionDto
    {
        public int ObraId { get; set; }
        public int MaquinariaId { get; set; }
        public int? OperadorId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFinEstimada { get; set; }
        public string? CondicionesEntrega { get; set; }
        public string? Observaciones { get; set; }
    }
}

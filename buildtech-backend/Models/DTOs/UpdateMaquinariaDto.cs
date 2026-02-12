namespace buildtech_backend.Models.DTOs
{
    public class UpdateMaquinariaDto
    {
        public string CodigoInterno { get; set; } = string.Empty;
        public int TipoId { get; set; }
        public string Marca { get; set; } = string.Empty;
        public string Modelo { get; set; } = string.Empty;
        public int AnioFabricacion { get; set; }
        public string NumeroSerie { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public int? UbicacionId { get; set; }
        public string? Observaciones { get; set; }
    }
}

namespace buildtech_backend.Models.DTOs
{
    public class UpdateTipoMaquinariaDto
    {
        public string Nombre { get; set; } = string.Empty;
        public int CategoriaId { get; set; }
        public string? Descripcion { get; set; }
    }
}

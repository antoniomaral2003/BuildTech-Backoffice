namespace buildtech_backend.Models.DTOs
{
    public class CreateCategoriaDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
    }
}

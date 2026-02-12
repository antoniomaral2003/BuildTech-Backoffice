using buildtech_backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace buildtech_backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<TipoMaquinaria> TiposMaquinaria { get; set; }
        public DbSet<Ubicacion> Ubicaciones { get; set; }
        public DbSet<Maquinaria> Maquinarias { get; set; }
        public DbSet<Obra> Obras { get; set; }
        public DbSet<Operador> Operadores { get; set; }
        public DbSet<Asignacion> Asignaciones { get; set; }
        public DbSet<Mantenimiento> Mantenimientos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuracion Categoria
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.ToTable("categorias");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
                entity.Property(e => e.Descripcion).HasColumnName("descripcion");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                entity.HasIndex(e => e.Nombre).IsUnique();
            });

            // Configuracion TipoMaquinaria
            modelBuilder.Entity<TipoMaquinaria>(entity =>
            {
                entity.ToTable("tipos_maquinaria");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
                entity.Property(e => e.CategoriaId).HasColumnName("categoria_id");
                entity.Property(e => e.Descripcion).HasColumnName("descripcion");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                entity.HasOne(e => e.Categoria)
                    .WithMany(c => c.TiposMaquinaria)
                    .HasForeignKey(e => e.CategoriaId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configuracion Ubicacion
            modelBuilder.Entity<Ubicacion>(entity =>
            {
                entity.ToTable("ubicaciones");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(150).IsRequired();
                entity.Property(e => e.Tipo).HasColumnName("tipo").HasMaxLength(50).IsRequired();
                entity.Property(e => e.Direccion).HasColumnName("direccion");
                entity.Property(e => e.Ciudad).HasColumnName("ciudad").HasMaxLength(100);
                entity.Property(e => e.CodigoPostal).HasColumnName("codigo_postal").HasMaxLength(20);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                entity.HasIndex(e => e.Nombre).IsUnique();
            });

            // Configuracion Maquinaria
            modelBuilder.Entity<Maquinaria>(entity =>
            {
                entity.ToTable("maquinaria");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.CodigoInterno).HasColumnName("codigo_interno").HasMaxLength(50).IsRequired();
                entity.Property(e => e.TipoId).HasColumnName("tipo_id");
                entity.Property(e => e.Marca).HasColumnName("marca").HasMaxLength(100).IsRequired();
                entity.Property(e => e.Modelo).HasColumnName("modelo").HasMaxLength(100).IsRequired();
                entity.Property(e => e.AnioFabricacion).HasColumnName("anio_fabricacion");
                entity.Property(e => e.NumeroSerie).HasColumnName("numero_serie").HasMaxLength(100).IsRequired();
                entity.Property(e => e.Estado).HasColumnName("estado").HasMaxLength(50).IsRequired();
                entity.Property(e => e.UbicacionId).HasColumnName("ubicacion_id");
                entity.Property(e => e.Observaciones).HasColumnName("observaciones");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                entity.HasIndex(e => e.CodigoInterno).IsUnique();
                entity.HasIndex(e => e.NumeroSerie).IsUnique();

                entity.HasOne(e => e.Tipo)
                    .WithMany(t => t.Maquinarias)
                    .HasForeignKey(e => e.TipoId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Ubicacion)
                    .WithMany(u => u.Maquinarias)
                    .HasForeignKey(e => e.UbicacionId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Configuracion Obra
            modelBuilder.Entity<Obra>(entity =>
            {
                entity.ToTable("obras");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(200).IsRequired();
                entity.Property(e => e.Codigo).HasColumnName("codigo").HasMaxLength(50);
                entity.Property(e => e.Direccion).HasColumnName("direccion").IsRequired();
                entity.Property(e => e.Ciudad).HasColumnName("ciudad").HasMaxLength(100);
                entity.Property(e => e.ResponsableNombre).HasColumnName("responsable_nombre").HasMaxLength(150);
                entity.Property(e => e.ResponsableTelefono).HasColumnName("responsable_telefono").HasMaxLength(20);
                entity.Property(e => e.ResponsableEmail).HasColumnName("responsable_email").HasMaxLength(150);
                entity.Property(e => e.FechaInicio).HasColumnName("fecha_inicio");
                entity.Property(e => e.FechaFinEstimada).HasColumnName("fecha_fin_estimada");
                entity.Property(e => e.Estado).HasColumnName("estado").HasMaxLength(50);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                entity.HasIndex(e => e.Codigo).IsUnique();
            });

            // Configuracion Operador
            modelBuilder.Entity<Operador>(entity =>
            {
                entity.ToTable("operadores");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(150).IsRequired();
                entity.Property(e => e.Apellidos).HasColumnName("apellidos").HasMaxLength(150).IsRequired();
                entity.Property(e => e.Dni).HasColumnName("dni").HasMaxLength(9).IsRequired();
                entity.Property(e => e.Telefono).HasColumnName("telefono").HasMaxLength(20);
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(150);
                entity.Property(e => e.Licencias).HasColumnName("licencias");
                entity.Property(e => e.Estado).HasColumnName("estado").HasMaxLength(50);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                entity.HasIndex(e => e.Dni).IsUnique();
            });

            // Configuracion Asignacion
            modelBuilder.Entity<Asignacion>(entity =>
            {
                entity.ToTable("asignaciones");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.ObraId).HasColumnName("obra_id");
                entity.Property(e => e.MaquinariaId).HasColumnName("maquinaria_id");
                entity.Property(e => e.OperadorId).HasColumnName("operador_id");
                entity.Property(e => e.FechaInicio).HasColumnName("fecha_inicio");
                entity.Property(e => e.FechaFinEstimada).HasColumnName("fecha_fin_estimada");
                entity.Property(e => e.FechaEntregaReal).HasColumnName("fecha_entrega_real");
                entity.Property(e => e.FechaDevolucionReal).HasColumnName("fecha_devolucion_real");
                entity.Property(e => e.CondicionesEntrega).HasColumnName("condiciones_entrega");
                entity.Property(e => e.Observaciones).HasColumnName("observaciones");
                entity.Property(e => e.Estado).HasColumnName("estado").HasMaxLength(50);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                entity.HasOne(e => e.Obra)
                    .WithMany(o => o.Asignaciones)
                    .HasForeignKey(e => e.ObraId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Maquinaria)
                    .WithMany(m => m.Asignaciones)
                    .HasForeignKey(e => e.MaquinariaId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Operador)
                    .WithMany(op => op.Asignaciones)
                    .HasForeignKey(e => e.OperadorId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Configuracion Mantenimiento
            modelBuilder.Entity<Mantenimiento>(entity =>
            {
                entity.ToTable("mantenimientos");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.MaquinariaId).HasColumnName("maquinaria_id");
                entity.Property(e => e.Tipo).HasColumnName("tipo").HasMaxLength(50).IsRequired();
                entity.Property(e => e.FechaProgramada).HasColumnName("fecha_programada");
                entity.Property(e => e.FechaInicio).HasColumnName("fecha_inicio");
                entity.Property(e => e.FechaFin).HasColumnName("fecha_fin");
                entity.Property(e => e.Descripcion).HasColumnName("descripcion").IsRequired();
                entity.Property(e => e.HorasUsoMomento).HasColumnName("horas_uso_momento");
                entity.Property(e => e.Taller).HasColumnName("taller").HasMaxLength(150);
                entity.Property(e => e.Costo).HasColumnName("costo").HasColumnType("decimal(10,2)");
                entity.Property(e => e.Observaciones).HasColumnName("observaciones");
                entity.Property(e => e.Estado).HasColumnName("estado").HasMaxLength(50);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                entity.HasOne(e => e.Maquinaria)
                    .WithMany(m => m.Mantenimientos)
                    .HasForeignKey(e => e.MaquinariaId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

        }

    }
}

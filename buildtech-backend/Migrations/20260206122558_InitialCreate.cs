using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace buildtech_backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categorias",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categorias", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "obras",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    codigo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    direccion = table.Column<string>(type: "text", nullable: false),
                    ciudad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    responsable_nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    responsable_telefono = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    responsable_email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    fecha_inicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    fecha_fin_estimada = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    estado = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_obras", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "operadores",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    apellidos = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    dni = table.Column<string>(type: "character varying(9)", maxLength: 9, nullable: false),
                    telefono = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    licencias = table.Column<string>(type: "text", nullable: true),
                    estado = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_operadores", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ubicaciones",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    tipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    direccion = table.Column<string>(type: "text", nullable: false),
                    ciudad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    codigo_postal = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ubicaciones", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tipos_maquinaria",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    categoria_id = table.Column<int>(type: "integer", nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tipos_maquinaria", x => x.id);
                    table.ForeignKey(
                        name: "FK_tipos_maquinaria_categorias_categoria_id",
                        column: x => x.categoria_id,
                        principalTable: "categorias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "maquinaria",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    codigo_interno = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    tipo_id = table.Column<int>(type: "integer", nullable: false),
                    marca = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    modelo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    anio_fabricacion = table.Column<int>(type: "integer", nullable: false),
                    numero_serie = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    estado = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ubicacion_id = table.Column<int>(type: "integer", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_maquinaria", x => x.id);
                    table.ForeignKey(
                        name: "FK_maquinaria_tipos_maquinaria_tipo_id",
                        column: x => x.tipo_id,
                        principalTable: "tipos_maquinaria",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_maquinaria_ubicaciones_ubicacion_id",
                        column: x => x.ubicacion_id,
                        principalTable: "ubicaciones",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "asignaciones",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    obra_id = table.Column<int>(type: "integer", nullable: false),
                    maquinaria_id = table.Column<int>(type: "integer", nullable: false),
                    operador_id = table.Column<int>(type: "integer", nullable: true),
                    fecha_inicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fecha_fin_estimada = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fecha_entrega_real = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    fecha_devolucion_real = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    condiciones_entrega = table.Column<string>(type: "text", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    estado = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_asignaciones", x => x.id);
                    table.ForeignKey(
                        name: "FK_asignaciones_maquinaria_maquinaria_id",
                        column: x => x.maquinaria_id,
                        principalTable: "maquinaria",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_asignaciones_obras_obra_id",
                        column: x => x.obra_id,
                        principalTable: "obras",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_asignaciones_operadores_operador_id",
                        column: x => x.operador_id,
                        principalTable: "operadores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "mantenimientos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    maquinaria_id = table.Column<int>(type: "integer", nullable: false),
                    tipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    fecha_programada = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    fecha_inicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    fecha_fin = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    descripcion = table.Column<string>(type: "text", nullable: false),
                    horas_uso_momento = table.Column<int>(type: "integer", nullable: true),
                    taller = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    costo = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    estado = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mantenimientos", x => x.id);
                    table.ForeignKey(
                        name: "FK_mantenimientos_maquinaria_maquinaria_id",
                        column: x => x.maquinaria_id,
                        principalTable: "maquinaria",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_asignaciones_maquinaria_id",
                table: "asignaciones",
                column: "maquinaria_id");

            migrationBuilder.CreateIndex(
                name: "IX_asignaciones_obra_id",
                table: "asignaciones",
                column: "obra_id");

            migrationBuilder.CreateIndex(
                name: "IX_asignaciones_operador_id",
                table: "asignaciones",
                column: "operador_id");

            migrationBuilder.CreateIndex(
                name: "IX_categorias_nombre",
                table: "categorias",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_mantenimientos_maquinaria_id",
                table: "mantenimientos",
                column: "maquinaria_id");

            migrationBuilder.CreateIndex(
                name: "IX_maquinaria_codigo_interno",
                table: "maquinaria",
                column: "codigo_interno",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_maquinaria_numero_serie",
                table: "maquinaria",
                column: "numero_serie",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_maquinaria_tipo_id",
                table: "maquinaria",
                column: "tipo_id");

            migrationBuilder.CreateIndex(
                name: "IX_maquinaria_ubicacion_id",
                table: "maquinaria",
                column: "ubicacion_id");

            migrationBuilder.CreateIndex(
                name: "IX_obras_codigo",
                table: "obras",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_operadores_dni",
                table: "operadores",
                column: "dni",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tipos_maquinaria_categoria_id",
                table: "tipos_maquinaria",
                column: "categoria_id");

            migrationBuilder.CreateIndex(
                name: "IX_ubicaciones_nombre",
                table: "ubicaciones",
                column: "nombre",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "asignaciones");

            migrationBuilder.DropTable(
                name: "mantenimientos");

            migrationBuilder.DropTable(
                name: "obras");

            migrationBuilder.DropTable(
                name: "operadores");

            migrationBuilder.DropTable(
                name: "maquinaria");

            migrationBuilder.DropTable(
                name: "tipos_maquinaria");

            migrationBuilder.DropTable(
                name: "ubicaciones");

            migrationBuilder.DropTable(
                name: "categorias");
        }
    }
}

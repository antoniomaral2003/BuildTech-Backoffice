using buildtech_backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace buildtech_backend.Data
{
    public static class DbSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            // Only seed if all tables are empty
            if (context.Categorias.Any()) return;

            // Categorías
            var categorias = new[]
            {
                new Categoria { Nombre = "Movimiento de Tierras", Descripcion = "Maquinaria para excavación y movimiento de tierra" },
                new Categoria { Nombre = "Elevación", Descripcion = "Equipos de elevación y transporte vertical" },
                new Categoria { Nombre = "Compactación", Descripcion = "Maquinaria para compactar suelos" },
                new Categoria { Nombre = "Hormigonado", Descripcion = "Equipos para preparación y aplicación de hormigón" },
                new Categoria { Nombre = "Transporte", Descripcion = "Vehículos para transporte de materiales" },
            };
            context.Categorias.AddRange(categorias);
            context.SaveChanges();

            // Tipos de Maquinaria
            var tipos = new[]
            {
                new TipoMaquinaria { Nombre = "Excavadora",            CategoriaId = categorias[0].Id, Descripcion = "Excavadora hidráulica" },
                new TipoMaquinaria { Nombre = "Bulldozer",             CategoriaId = categorias[0].Id, Descripcion = "Tractor de oruga con pala frontal" },
                new TipoMaquinaria { Nombre = "Motoniveladora",        CategoriaId = categorias[0].Id, Descripcion = "Máquina para nivelar terrenos" },
                new TipoMaquinaria { Nombre = "Grúa Torre",            CategoriaId = categorias[1].Id, Descripcion = "Grúa fija de gran altura" },
                new TipoMaquinaria { Nombre = "Grúa Móvil",            CategoriaId = categorias[1].Id, Descripcion = "Grúa autopropulsada" },
                new TipoMaquinaria { Nombre = "Plataforma Elevadora",  CategoriaId = categorias[1].Id, Descripcion = "Plataforma de trabajo en altura" },
                new TipoMaquinaria { Nombre = "Rodillo",               CategoriaId = categorias[2].Id, Descripcion = "Rodillo compactador" },
                new TipoMaquinaria { Nombre = "Compactador Vibratorio",CategoriaId = categorias[2].Id, Descripcion = "Compactador con sistema de vibración" },
                new TipoMaquinaria { Nombre = "Mezcladora",            CategoriaId = categorias[3].Id, Descripcion = "Mezcladora de hormigón" },
                new TipoMaquinaria { Nombre = "Bomba de Hormigón",     CategoriaId = categorias[3].Id, Descripcion = "Bomba para distribución de hormigón" },
                new TipoMaquinaria { Nombre = "Dumper",                CategoriaId = categorias[4].Id, Descripcion = "Volquete pequeño" },
                new TipoMaquinaria { Nombre = "Camión Articulado",     CategoriaId = categorias[4].Id, Descripcion = "Camión volquete articulado" },
            };
            context.TiposMaquinaria.AddRange(tipos);
            context.SaveChanges();

            // Ubicaciones
            var ubicaciones = new[]
            {
                new Ubicacion { Nombre = "Almacén Central Madrid",      Tipo = "Almacén Central",   Direccion = "Polígono Industrial Las Américas, Calle 5", Ciudad = "Madrid",    CodigoPostal = "28906" },
                new Ubicacion { Nombre = "Almacén Regional Barcelona",  Tipo = "Almacén Regional",  Direccion = "Zona Franca, Sector B",                     Ciudad = "Barcelona", CodigoPostal = "08040" },
                new Ubicacion { Nombre = "Almacén Regional Valencia",   Tipo = "Almacén Regional",  Direccion = "Polígono Vara de Quart",                    Ciudad = "Valencia",  CodigoPostal = "46014" },
            };
            context.Ubicaciones.AddRange(ubicaciones);
            context.SaveChanges();

            // Maquinaria
            var maquinaria = new[]
            {
                new Maquinaria { CodigoInterno = "EXC-001", TipoId = tipos[0].Id, Marca = "Caterpillar", Modelo = "320D",       AnioFabricacion = 2020, NumeroSerie = "CAT320D2020001",    Estado = "Disponible",       UbicacionId = ubicaciones[0].Id },
                new Maquinaria { CodigoInterno = "EXC-002", TipoId = tipos[0].Id, Marca = "Komatsu",     Modelo = "PC210",      AnioFabricacion = 2021, NumeroSerie = "KOM210LC2021045",   Estado = "Disponible",       UbicacionId = ubicaciones[0].Id },
                new Maquinaria { CodigoInterno = "BUL-001", TipoId = tipos[1].Id, Marca = "Caterpillar", Modelo = "D6T",        AnioFabricacion = 2019, NumeroSerie = "CATD6T2019023",     Estado = "Asignada",         UbicacionId = ubicaciones[0].Id },
                new Maquinaria { CodigoInterno = "GRU-001", TipoId = tipos[3].Id, Marca = "Liebherr",    Modelo = "110 EC-B",   AnioFabricacion = 2022, NumeroSerie = "LBH110ECB2022012",  Estado = "Disponible",       UbicacionId = ubicaciones[1].Id },
                new Maquinaria { CodigoInterno = "ROD-001", TipoId = tipos[6].Id, Marca = "BOMAG",       Modelo = "BW 211 D-5", AnioFabricacion = 2020, NumeroSerie = "BMG211D2020078",    Estado = "En Mantenimiento", UbicacionId = ubicaciones[0].Id },
                new Maquinaria { CodigoInterno = "GRU-002", TipoId = tipos[4].Id, Marca = "Liebherr",    Modelo = "LTM 1050",   AnioFabricacion = 2021, NumeroSerie = "LBH1050MOB2021033", Estado = "Disponible",       UbicacionId = ubicaciones[1].Id },
                new Maquinaria { CodigoInterno = "PLT-001", TipoId = tipos[5].Id, Marca = "JLG",         Modelo = "860SJ",      AnioFabricacion = 2022, NumeroSerie = "JLG860SJ2022007",   Estado = "Disponible",       UbicacionId = ubicaciones[2].Id },
                new Maquinaria { CodigoInterno = "DMP-001", TipoId = tipos[10].Id, Marca = "Thwaites",   Modelo = "MACH 574",   AnioFabricacion = 2020, NumeroSerie = "THW574M2020041",    Estado = "Disponible",       UbicacionId = ubicaciones[0].Id },
            };
            context.Maquinarias.AddRange(maquinaria);
            context.SaveChanges();

            // Obras
            var obras = new[]
            {
                new Obra
                {
                    Nombre = "Residencial Las Palmeras", Codigo = "OBR-2024-001",
                    Direccion = "Avenida de las Palmeras 45", Ciudad = "Madrid",
                    ResponsableNombre = "Carlos Fernández", ResponsableTelefono = "+34 666 123 456", ResponsableEmail = "c.fernandez@buildtech.es",
                    FechaInicio = new DateTime(2024, 1, 15), FechaFinEstimada = new DateTime(2025, 6, 30),
                    Estado = "Activa"
                },
                new Obra
                {
                    Nombre = "Centro Comercial Norte", Codigo = "OBR-2024-002",
                    Direccion = "Carretera Nacional II, Km 23", Ciudad = "Barcelona",
                    ResponsableNombre = "Laura Martínez", ResponsableTelefono = "+34 677 234 567", ResponsableEmail = "l.martinez@buildtech.es",
                    FechaInicio = new DateTime(2024, 3, 1), FechaFinEstimada = new DateTime(2025, 12, 31),
                    Estado = "Activa"
                },
                new Obra
                {
                    Nombre = "Nave Industrial Polígono Sur", Codigo = "OBR-2024-003",
                    Direccion = "Polígono Industrial Sur, Parcela 12", Ciudad = "Valencia",
                    ResponsableNombre = "Miguel Torres", ResponsableTelefono = "+34 688 345 678", ResponsableEmail = "m.torres@buildtech.es",
                    FechaInicio = new DateTime(2024, 6, 1), FechaFinEstimada = new DateTime(2025, 3, 31),
                    Estado = "Activa"
                },
            };
            context.Obras.AddRange(obras);
            context.SaveChanges();

            // Operadores
            var operadores = new[]
            {
                new Operador { Nombre = "Juan",    Apellidos = "García López",      Dni = "12345678A", Telefono = "+34 655 111 222", Email = "juan.garcia@buildtech.es",    Licencias = "Excavadoras, Bulldozers",          Estado = "Activo" },
                new Operador { Nombre = "María",   Apellidos = "Rodríguez Sanz",    Dni = "87654321B", Telefono = "+34 666 222 333", Email = "maria.rodriguez@buildtech.es", Licencias = "Grúas, Plataformas",               Estado = "Activo" },
                new Operador { Nombre = "Pedro",   Apellidos = "López Martín",      Dni = "11223344C", Telefono = "+34 677 333 444", Email = "pedro.lopez@buildtech.es",    Licencias = "Rodillos, Compactadores",          Estado = "Activo" },
                new Operador { Nombre = "Ana",     Apellidos = "Fernández Ruiz",    Dni = "55667788D", Telefono = "+34 688 444 555", Email = "ana.fernandez@buildtech.es",   Licencias = "Excavadoras, Dumpers",             Estado = "Activo" },
                new Operador { Nombre = "Roberto", Apellidos = "Sánchez Moreno",    Dni = "99001122E", Telefono = "+34 699 555 666", Email = "roberto.sanchez@buildtech.es", Licencias = "Grúas, Plataformas, Excavadoras",  Estado = "Inactivo" },
            };
            context.Operadores.AddRange(operadores);
            context.SaveChanges();

            // Asignaciones
            var asignaciones = new[]
            {
                new Asignacion
                {
                    ObraId = obras[0].Id, MaquinariaId = maquinaria[2].Id, OperadorId = operadores[0].Id,
                    FechaInicio = new DateTime(2024, 1, 20), FechaFinEstimada = new DateTime(2024, 12, 31),
                    Estado = "En Curso", CondicionesEntrega = "Maquinaria entregada en buen estado, sin daños visibles."
                },
                new Asignacion
                {
                    ObraId = obras[1].Id, MaquinariaId = maquinaria[3].Id, OperadorId = operadores[1].Id,
                    FechaInicio = new DateTime(2024, 3, 5), FechaFinEstimada = new DateTime(2024, 11, 30),
                    Estado = "Finalizada", CondicionesEntrega = "Grúa montada y operativa.", FechaDevolucionReal = new DateTime(2024, 11, 28)
                },
                new Asignacion
                {
                    ObraId = obras[2].Id, MaquinariaId = maquinaria[0].Id, OperadorId = operadores[3].Id,
                    FechaInicio = new DateTime(2024, 6, 3), FechaFinEstimada = new DateTime(2025, 1, 31),
                    Estado = "En Curso", CondicionesEntrega = "Excavadora en perfectas condiciones."
                },
            };
            context.Asignaciones.AddRange(asignaciones);
            context.SaveChanges();

            // Mantenimientos
            var mantenimientos = new[]
            {
                new Mantenimiento
                {
                    MaquinariaId = maquinaria[4].Id, Tipo = "Preventivo",
                    FechaProgramada = new DateTime(2024, 2, 15),
                    FechaInicio = new DateTime(2024, 2, 15),
                    Descripcion = "Revisión 2000 horas - Cambio filtros y aceites",
                    HorasUsoMomento = 1800, Taller = "Taller Central Madrid",
                    Estado = "En Proceso"
                },
                new Mantenimiento
                {
                    MaquinariaId = maquinaria[0].Id, Tipo = "Preventivo",
                    FechaProgramada = new DateTime(2025, 3, 1),
                    Descripcion = "Revisión 1500 horas - Inspección general",
                    HorasUsoMomento = 1250,
                    Estado = "Programado"
                },
                new Mantenimiento
                {
                    MaquinariaId = maquinaria[1].Id, Tipo = "Correctivo",
                    FechaProgramada = new DateTime(2025, 4, 10),
                    Descripcion = "Reparación de fuga hidráulica en brazo",
                    HorasUsoMomento = 890, Taller = "Taller Oficial Komatsu",
                    Estado = "Programado"
                },
                new Mantenimiento
                {
                    MaquinariaId = maquinaria[3].Id, Tipo = "Preventivo",
                    FechaProgramada = new DateTime(2024, 8, 20),
                    FechaInicio = new DateTime(2024, 8, 20),
                    FechaFin = new DateTime(2024, 8, 22),
                    Descripcion = "Revisión 500 horas - Engrase y ajuste de cables",
                    HorasUsoMomento = 450, Taller = "Taller Central Madrid",
                    Costo = 850.00m,
                    Estado = "Completado"
                },
            };
            context.Mantenimientos.AddRange(mantenimientos);
            context.SaveChanges();
        }
    }
}

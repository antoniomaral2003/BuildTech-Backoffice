using buildtech_backend.Models.DTOs;
using buildtech_backend.Models.Entities;
using buildtech_backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildtech_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsignacionController : ControllerBase
    {

        private readonly IAsignacionService _service;

        public AsignacionController(IAsignacionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var asignaciones = await _service.GetAll();
            return Ok(asignaciones);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var asignacion = await _service.GetById(id);
            if (asignacion == null)
                return NotFound();

            return Ok(asignacion);
        }

        [HttpGet("obra/{obraId}")]
        public async Task<IActionResult> GetByObraId(int obraId)
        {
            var asignaciones = await _service.GetByObraId(obraId);
            return Ok(asignaciones);
        }

        [HttpGet("maquinaria/{maquinariaId}")]
        public async Task<IActionResult> GetByMaquinariaId(int maquinariaId)
        {
            var asignaciones = await _service.GetByMaquinariaId(maquinariaId);
            return Ok(asignaciones);
        }

        [HttpGet("activas")]
        public async Task<IActionResult> GetActivas()
        {
            var asignaciones = await _service.GetActivas();
            return Ok(asignaciones);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAsignacionDto asignacionDto)
        {
            try
            {
                var asignacion = await _service.Create(asignacionDto);
                return CreatedAtAction(nameof(GetById), new { id = asignacion.Id }, asignacion);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAsignacionDto asignacionDto)
        {
            try
            {
                var asignacion = await _service.Update(id, asignacionDto);
                return Ok(asignacion);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _service.Delete(id);
                if (!result)
                    return NotFound();

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}

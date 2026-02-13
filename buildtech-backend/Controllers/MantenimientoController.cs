using buildtech_backend.Models.DTOs;
using buildtech_backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildtech_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MantenimientoController : ControllerBase
    {

        private readonly IMantenimientoService _service;

        public MantenimientoController(IMantenimientoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var mantenimientos = await _service.GetAll();
            return Ok(mantenimientos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var mantenimiento = await _service.GetById(id);
            if (mantenimiento == null)
                return NotFound();

            return Ok(mantenimiento);
        }

        [HttpGet("maquinaria/{maquinariaId}")]
        public async Task<IActionResult> GetByMaquinariaId(int maquinariaId)
        {
            var mantenimientos = await _service.GetByMaquinariaId(maquinariaId);
            return Ok(mantenimientos);
        }

        [HttpGet("proximos/{dias}")]
        public async Task<IActionResult> GetProximos(int dias)
        {
            var mantenimientos = await _service.GetProximos(dias);
            return Ok(mantenimientos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMantenimientoDto mantenimientoDto)
        {
            try
            {
                var mantenimiento = await _service.Create(mantenimientoDto);
                return CreatedAtAction(nameof(GetById), new { id = mantenimiento.Id }, mantenimiento);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMantenimientoDto mantenimientoDto)
        {
            try
            {
                var mantenimiento = await _service.Update(id, mantenimientoDto);
                return Ok(mantenimiento);
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

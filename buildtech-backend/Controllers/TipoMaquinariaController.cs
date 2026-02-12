using buildtech_backend.Models.DTOs;
using buildtech_backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildtech_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoMaquinariaController : ControllerBase
    {

        private readonly ITipoMaquinariaService _service;

        public TipoMaquinariaController(ITipoMaquinariaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tipos = await _service.GetAll();
            return Ok(tipos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var tipo = await _service.GetById(id);
            if (tipo == null)
                return NotFound();

            return Ok(tipo);
        }

        [HttpGet("categoria/{categoriaId}")]
        public async Task<IActionResult> GetByCategoriaId(int categoriaId)
        {
            var tipos = await _service.GetByCategoriaId(categoriaId);
            return Ok(tipos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTipoMaquinariaDto tipoMaquinariaDto)
        {
            try
            {
                var tipo = await _service.Create(tipoMaquinariaDto);
                return CreatedAtAction(nameof(GetById), new { id = tipo.Id }, tipo);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTipoMaquinariaDto tipoMaquinariaDto)
        {
            try
            {
                var tipo = await _service.Update(id, tipoMaquinariaDto);
                return Ok(tipo);
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

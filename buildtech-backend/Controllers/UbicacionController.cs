using buildtech_backend.Models.DTOs;
using buildtech_backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildtech_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UbicacionController : ControllerBase
    {

        private readonly IUbicacionService _service;

        public UbicacionController(IUbicacionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ubicaciones = await _service.GetAll();
            return Ok(ubicaciones);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ubicacion = await _service.GetById(id);
            if (ubicacion == null)
                return NotFound();

            return Ok(ubicacion);
        }

        [HttpGet("tipo/{tipo}")]
        public async Task<IActionResult> GetByTipo(string tipo)
        {
            var ubicaciones = await _service.GetByTipo(tipo);
            return Ok(ubicaciones);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUbicacionDto ubicacionDto)
        {
            try
            {
                var ubicacion = await _service.Create(ubicacionDto);
                return CreatedAtAction(nameof(GetById), new { id = ubicacion.Id }, ubicacion);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUbicacionDto ubicacionDto)
        {
            try
            {
                var ubicacion = await _service.Update(id, ubicacionDto);
                return Ok(ubicacion);
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

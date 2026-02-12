using buildtech_backend.Models.DTOs;
using buildtech_backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildtech_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperadorController : ControllerBase
    {

        private readonly IOperadorService _service;

        public OperadorController(IOperadorService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var operadores = await _service.GetAll();
            return Ok(operadores);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var operador = await _service.GetById(id);
            if (operador == null)
                return NotFound();

            return Ok(operador);
        }

        [HttpGet("estado/{estado}")]
        public async Task<IActionResult> GetByEstado(string estado)
        {
            var operadores = await _service.GetByEstado(estado);
            return Ok(operadores);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOperadorDto operadorDto)
        {
            try
            {
                var operador = await _service.Create(operadorDto);
                return CreatedAtAction(nameof(GetById), new { id = operador.Id }, operador);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateOperadorDto operadorDto)
        {
            try
            {
                var operador = await _service.Update(id, operadorDto);
                return Ok(operador);
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

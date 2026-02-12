using buildtech_backend.Models.DTOs;
using buildtech_backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildtech_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObraController : ControllerBase
    {

        private readonly IObraService _service;

        public ObraController(IObraService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var obras = await _service.GetAll();
            return Ok(obras);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var obra = await _service.GetById(id);
            if (obra == null)
                return NotFound();

            return Ok(obra);
        }

        [HttpGet("estado/{estado}")]
        public async Task<IActionResult> GetByEstado(string estado)
        {
            var obras = await _service.GetByEstado(estado);
            return Ok(obras);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateObraDto obraDto)
        {
            try
            {
                var obra = await _service.Create(obraDto);
                return CreatedAtAction(nameof(GetById), new { id = obra.Id }, obra);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateObraDto obraDto)
        {
            try
            {
                var obra = await _service.Update(id, obraDto);
                return Ok(obra);
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

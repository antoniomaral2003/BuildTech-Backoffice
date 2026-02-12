using buildtech_backend.Models.DTOs;
using buildtech_backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildtech_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaquinariaController : ControllerBase
    {

        private readonly IMaquinariaService _service;

        public MaquinariaController(IMaquinariaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAll();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var maquinaria = await _service.GetById(id);
            if (maquinaria == null)
                return NotFound();

            return Ok(maquinaria);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMaquinariaDto maquinariaDto)
        {
            try
            {
                var maquinaria = await _service.Create(maquinariaDto);
                return CreatedAtAction(nameof(GetById), new { id = maquinaria.Id }, maquinaria);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMaquinariaDto maquinariaDto)
        {
            try
            {
                var maquinaria = await _service.Update(id, maquinariaDto);
                return Ok(maquinaria);
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

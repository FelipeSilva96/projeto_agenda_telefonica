using Microsoft.AspNetCore.Mvc;
using ConnectHub.DTOs;
using ConnectHub.Services;

namespace ConnectHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContatosController : ControllerBase
{
    private readonly ContatoService _service;

    public ContatosController(ContatoService service)
    {
        _service = service;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterTodos()
    {
        var contatos = await _service.ObterTodosAsync();
        return Ok(contatos);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Criar([FromBody] ContatoDto novoContatoDto)
    {
        var criado = await _service.CriarAsync(novoContatoDto);
        return CreatedAtAction(nameof(ObterTodos), new { id = criado.Id }, criado);
    }
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Atualizar(int id, [FromBody] ContatoDto dto)
    {
        var atualizado = await _service.AtualizarAsync(id, dto);
        if (atualizado == null) return NotFound();
        return Ok(atualizado);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(int id)
    {
        var sucesso = await _service.ExcluirAsync(id);
        if (!sucesso) return NotFound();
        return NoContent();
    }
}

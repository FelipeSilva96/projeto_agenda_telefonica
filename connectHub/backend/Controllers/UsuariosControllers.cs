using Microsoft.AspNetCore.Mvc;
using ConnectHub.DTOs;
using ConnectHub.Services;

namespace ConnectHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly UsuarioService _service;

    public UsuariosController(UsuarioService service)
    {
        _service = service;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterTodos()
    {
        var usuarios = await _service.ObterTodosAsync();
        return Ok(usuarios);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Criar([FromBody] UsuarioDto novoUsuarioDto)
    {
        var criado = await _service.CriarAsync(novoUsuarioDto);
        return CreatedAtAction(nameof(ObterTodos), new { id = criado.Id }, criado);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Atualizar(int id, [FromBody] UsuarioDto dto)
    {
        var sucesso = await _service.AtualizarAsync(id, dto);

        if (!sucesso) return NotFound();

        return Ok(new { message = "Usuário atualizado com sucesso" });
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(int id)
    {
        var sucesso = await _service.DeletarAsync(id);
        if (!sucesso) return NotFound();
        return NoContent();
    }
}

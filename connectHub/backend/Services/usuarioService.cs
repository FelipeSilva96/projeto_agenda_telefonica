using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConnectHub.Repository;
using ConnectHub.DTOs;
using ConnectHub.Mappers;

namespace ConnectHub.Services
{
    public class UsuarioService
    {
        private readonly UsuarioRepository _usuarioRepository;

        public UsuarioService(UsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<IEnumerable<UsuarioDto?>> ObterTodosAsync()
        {
            var entidades = await _usuarioRepository.GetAllAsync();

            return entidades.Select(e => e.ToDto()).ToList();
        }

        public async Task<UsuarioDto?> ObterPorIdAsync(int id)
        {
            var entidadeUsuario = await _usuarioRepository.GetByIdAsync(id);

            if (entidadeUsuario == null) return null;

            return entidadeUsuario.ToDto();
        }

        public async Task<UsuarioDto> CriarAsync(UsuarioDto dtoQueVeioDoFront)
        {
            var novaEntidade = dtoQueVeioDoFront.ToEntity();

            var entidadeSalva = await _usuarioRepository.AddAsync(novaEntidade!);

            return entidadeSalva!.ToDto()!;
        }

        public async Task<bool> AtualizarAsync(int id, UsuarioDto dtoAtualizado)
        {
            var entidadeExistente = await _usuarioRepository.GetByIdAsync(id);
            if (entidadeExistente == null) return false;
            entidadeExistente.Name = dtoAtualizado.Name;
            entidadeExistente.Phone = System.Text.RegularExpressions.Regex.Replace(dtoAtualizado.Phone ?? string.Empty, "[^0-9]", "");

            await _usuarioRepository.UpdateAsync(entidadeExistente);
            return true;
        }

        public async Task<bool> DeletarAsync(int id)
        {
            var entidadeExistente = await _usuarioRepository.GetByIdAsync(id);
            if (entidadeExistente == null) return false;

            await _usuarioRepository.DeleteAsync(id); 
            return true;
        }
    }
}
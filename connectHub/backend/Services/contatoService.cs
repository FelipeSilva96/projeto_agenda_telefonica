using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConnectHub.Repository;
using ConnectHub.DTOs;
using ConnectHub.Mappers;

namespace ConnectHub.Services
{
    public class ContatoService
    {
        private readonly ContatoRepository _contatoRepository;

        public ContatoService(ContatoRepository contatoRepository)
        {
            _contatoRepository = contatoRepository;
        }

        public async Task<IEnumerable<ContatoDto>> ObterTodosAsync()
        {
            var entidades = await _contatoRepository.GetAllAsync();
            return entidades
                .Where(e => e != null)
                .Select(e => e!.ToDto()!)
                .ToList();
        }

        public async Task<bool> ExcluirAsync(int id)
        {
            var entidade = await _contatoRepository.GetByIdAsync(id);
            if (entidade == null) return false;
            await _contatoRepository.DeleteAsync(id);
            return true;
        }

        public async Task<ContatoDto?> ObterPorIdAsync(int id)
        {
            var entidadeUsuario = await _contatoRepository.GetByIdAsync(id);

            if (entidadeUsuario == null) return null;

            return entidadeUsuario.ToDto();
        }

        public async Task<ContatoDto?> AtualizarAsync(int id, ContatoDto dtoQueVeioDoFront)
        {
            var entidadeExistente = await _contatoRepository.GetByIdAsync(id);
            if (entidadeExistente == null) return null;

            entidadeExistente.Name = dtoQueVeioDoFront.Name;
            entidadeExistente.Phone = dtoQueVeioDoFront.Phone;

            var entidadeAtualizada = await _contatoRepository.UpdateAsync(entidadeExistente);
            return entidadeAtualizada.ToDto();
        }

        public async Task<ContatoDto> CriarAsync(ContatoDto dtoQueVeioDoFront)
        {
            var novaEntidade = dtoQueVeioDoFront.ToEntity();

            var entidadeSalva = await _contatoRepository.AddAsync(novaEntidade!);

            return entidadeSalva!.ToDto()!;
        }
    }
}

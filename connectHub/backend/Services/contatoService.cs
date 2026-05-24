using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConnectHub.DTOs;
using ConnectHub.Mappers;
using ConnectHub.Repository;

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
                .Select(e => e.ToDto()!)
                .ToList();
        }

        public async Task<ContatoDto?> ObterPorIdAsync(int id)
        {
            var entidade = await _contatoRepository.GetByIdAsync(id);

            if (entidade == null)
                return null;

            return entidade.ToDto();
        }

        public async Task<ContatoDto> CriarAsync(ContatoDto dtoQueVeioDoFront)
        {
            var novaEntidade = dtoQueVeioDoFront.ToEntity();

            if (novaEntidade == null)
                throw new ArgumentException("Dados do contato inválidos.");

            var entidadeSalva = await _contatoRepository.AddAsync(novaEntidade);

            return entidadeSalva!.ToDto()!;
        }

        public async Task<ContatoDto?> AtualizarAsync(int id, ContatoDto dtoQueVeioDoFront)
        {
            var entidadeExistente = await _contatoRepository.GetByIdAsync(id);

            if (entidadeExistente == null)
                return null;

            entidadeExistente.Name = dtoQueVeioDoFront.Name;
            entidadeExistente.Company = dtoQueVeioDoFront.Company;
            entidadeExistente.Phone = dtoQueVeioDoFront.Phone;
            entidadeExistente.Favorite = dtoQueVeioDoFront.IsFavorite;

            var entidadeAtualizada = await _contatoRepository.UpdateAsync(entidadeExistente);

            return entidadeAtualizada.ToDto();
        }

        public async Task<bool> ExcluirAsync(int id)
        {
            var entidade = await _contatoRepository.GetByIdAsync(id);

            if (entidade == null)
                return false;

            await _contatoRepository.DeleteAsync(id);

            return true;
        }
    }
}
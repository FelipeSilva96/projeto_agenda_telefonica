using System;
using System.Text.RegularExpressions;
using ConnectHub.Entities;
using ConnectHub.DTOs;

namespace ConnectHub.Mappers
{
    public static class ContatoMapper
    {
        public static ContatoDto? ToDto(this Contato? contato)
        {
            if (contato == null) return null;

            return new ContatoDto
            {
                Id = contato.Id,
                Name = contato.Name,
                Phone = contato.Phone
            };
        }

        public static Contato? ToEntity(this ContatoDto? contatoDto)
        {
            if (contatoDto == null) return null;

            if (!Regex.IsMatch(contatoDto.Phone ?? string.Empty, @"^[0-9\-\+\s\(\)]+$"))
            {
                throw new FormatException("Formato de telefone inválido.");
            }

            return new Contato
            {
                Id = contatoDto.Id,
                Name = contatoDto.Name,
                Phone = Regex.Replace(contatoDto.Phone ?? string.Empty, "[^0-9]", "")
            };
        }
    }
}

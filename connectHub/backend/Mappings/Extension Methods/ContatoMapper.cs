using System;
using System.Linq;
using System.Text.RegularExpressions;
using ConnectHub.DTOs;
using ConnectHub.Entities;

namespace ConnectHub.Mappers
{
    public static class ContatoMapper
    {
        public static ContatoDto? ToDto(this Contato? contato)
        {
            if (contato == null)
                return null;

            return new ContatoDto
            {
                Id = contato.Id,
                Name = contato.Name,
                Company = contato.Company,
                Phone = contato.Phone,
                Initials = GenerateInitials(contato.Name),
                IsFavorite = contato.Favorite
            };
        }

        public static Contato? ToEntity(this ContatoDto? contatoDto)
        {
            if (contatoDto == null)
                return null;

            if (!Regex.IsMatch(contatoDto.Phone ?? string.Empty, @"^[0-9\-\+\s\(\)]+$"))
            {
                throw new FormatException("Formato de telefone inválido.");
            }

            return new Contato
            {
                Id = contatoDto.Id,
                Name = contatoDto.Name,
                Company = contatoDto.Company,
                Phone = Regex.Replace(contatoDto.Phone ?? string.Empty, "[^0-9]", ""),
                Favorite = contatoDto.IsFavorite
            };
        }

        private static string GenerateInitials(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return string.Empty;

            var parts = name.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            return string.Join("", parts.Select(p => p[0]))
                .ToUpper()
                .Substring(0, Math.Min(2, parts.Length));
        }
    }
}
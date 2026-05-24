using System;
using System.Text.RegularExpressions;
using ConnectHub.Entities;
using ConnectHub.DTOs;

namespace ConnectHub.Mappers
{
    public static class UsuarioMapper
    {
        public static UsuarioDto? ToDto(this Usuario? usuario)
        {
            if (usuario == null) return null;

            return new UsuarioDto
            {
                Id = usuario.Id,
                Name = usuario.Name,
                Phone = usuario.Phone
            };
        }

        public static Usuario? ToEntity(this UsuarioDto? dto)
        {
            if (dto == null) return null;

            if (!Regex.IsMatch(dto.Phone ?? string.Empty, @"^[0-9\-\+\s\(\)]+$"))
                throw new FormatException("Formato de telefone inválido.");

            return new Usuario
            {
                Id = dto.Id,
                Name = dto.Name,
                Phone = Regex.Replace(dto.Phone ?? string.Empty, "[^0-9]", "")
            };
        }
    }
}

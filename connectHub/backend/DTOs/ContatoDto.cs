using System.ComponentModel.DataAnnotations;

namespace ConnectHub.DTOs
{
    public class ContatoDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome do contato é obrigatório.")]
        [MaxLength(100, ErrorMessage = "O nome não pode ter mais de 100 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "O nome da empresa não pode ter mais de 100 caracteres.")]
        public string Company { get; set; } = string.Empty;

        [Required(ErrorMessage = "O telefone é obrigatório.")]
        [RegularExpression(@"^[0-9\-\+\s\(\)]+$", ErrorMessage = "Formato de telefone inválido.")]
        public string Phone { get; set; } = string.Empty;

        public string Initials { get; set; } = string.Empty;

        public bool IsFavorite { get; set; }
    }
}
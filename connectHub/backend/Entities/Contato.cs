namespace ConnectHub.Entities
{
    public class Contato
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Company { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public bool Favorite { get; set; }
    }
}

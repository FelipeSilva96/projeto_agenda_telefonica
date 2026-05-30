using ConnectHub.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectHub.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<Contato> Contatos => Set<Contato>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("usuarios");

                entity.HasKey(u => u.Id);

                entity.Property(u => u.Name).IsRequired().HasMaxLength(100);

                entity.Property(u => u.Phone).IsRequired().HasMaxLength(20);
            });

            modelBuilder.Entity<Contato>(entity =>
            {
                entity.ToTable("contatos");

                entity.HasKey(c => c.Id);

                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);

                entity.Property(c => c.Company).HasMaxLength(100);

                entity.Property(c => c.Phone).IsRequired().HasMaxLength(20);

                entity.Property(c => c.Favorite).HasDefaultValue(false);
            });
        }
    }
}

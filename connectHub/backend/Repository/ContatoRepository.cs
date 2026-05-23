using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ConnectHub.Data;
using ConnectHub.Entities;
using System.Linq.Expressions;
using System.Linq;

namespace ConnectHub.Repository
{
    public class ContatoRepository
    {
        private readonly AppDbContext _context;

        public ContatoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Contato>> GetAllAsync()
        {
            return await _context.Contatos.ToListAsync();
        }

        public async Task<Contato?> GetByIdAsync(int id)
        {
            return await _context.Contatos.FindAsync(id);
        }

        public async Task<Contato?> AddAsync(Contato entity)
        {
            await _context.Contatos.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Contato> UpdateAsync(Contato entity)
        {
            _context.Contatos.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Contatos.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Contato>> FindAsync(Expression<Func<Contato, bool>> predicate)
        {
            return await _context.Contatos.Where(predicate).ToListAsync();
        }
    }
}

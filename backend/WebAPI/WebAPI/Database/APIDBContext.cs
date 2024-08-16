using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Database
{
    public class APIDBContext : DbContext
    {
        public DbSet<Bank> Banks { get; set; }
        public DbSet<BankAccount> BankAccounts { get; set; }

        public APIDBContext(DbContextOptions<APIDBContext> options) : base(options)
        {
            
        }
    }
}

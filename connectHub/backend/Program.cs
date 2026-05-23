using Microsoft.EntityFrameworkCore;
using ConnectHub.Data;
using ConnectHub.Repository;
using ConnectHub.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=connecthub.db";
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddScoped<ContatoRepository>();
builder.Services.AddScoped<UsuarioRepository>();
builder.Services.AddScoped<ContatoService>();
builder.Services.AddScoped<UsuarioService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

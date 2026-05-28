var builder = WebApplication.CreateBuilder(args);

// Agregar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:3000", "https://joantarazona99.github.io", "https://389d14fd.cafe-133.pages.dev", "https://cafe-133.pages.dev")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Servir archivos estáticos del frontend (wwwroot/)
app.UseDefaultFiles();
app.UseStaticFiles();

// Usar CORS
app.UseCors("AllowFrontend");

// Endpoint para recibir datos del formulario
app.MapPost("/api/cafe/analyze", (CafeRequest request) =>
{
    // Imprimir datos en consola
    Console.WriteLine("=== ЗАПРОС НА АНАЛИЗ КАФЕ ===");
    Console.WriteLine($"Клиент: {request.Customer}");
    Console.WriteLine($"Кухня: {request.Cuisine}");
    Console.WriteLine($"Расположение: {request.Location}");
    Console.WriteLine($"Конкуренты: {request.Competitors}");
    Console.WriteLine($"Парковка: {request.Parking}");
    Console.WriteLine($"Вход: {request.Entrance}");
    Console.WriteLine($"Средний чек: {request.AvgCheck}");
    Console.WriteLine($"Якорь: {request.Anchor}");
    Console.WriteLine($"Заметки: {request.Notes}");
    Console.WriteLine($"Дата и время: {request.Timestamp}");
    Console.WriteLine("=============================\n");

    // Retornar string de respuesta
    return $"Анализ завершён для {request.Customer} — {request.Timestamp}";
})
.WithName("AnalyzeCafe");

// Health check
app.MapGet("/health", () => "OK")
    .WithName("Health");

app.Run();

// Modelo para recibir datos del formulario
public class CafeRequest
{
    public string? Customer { get; set; }
    public string? Cuisine { get; set; }
    public string? Location { get; set; }
    public int Competitors { get; set; }
    public string? Parking { get; set; }
    public string? Entrance { get; set; }
    public int AvgCheck { get; set; }
    public string? Anchor { get; set; }
    public string? Notes { get; set; }
    public string? Timestamp { get; set; }
}

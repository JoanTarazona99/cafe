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

// Usar CORS
app.UseCors("AllowFrontend");

// Endpoint para recibir datos del formulario
app.MapPost("/api/cafe/analyze", (CafeRequest request) =>
{
    // Imprimir datos en consola
    Console.WriteLine("=== CAFE ANALYSIS REQUEST ===");
    Console.WriteLine($"Customer: {request.Customer}");
    Console.WriteLine($"Cuisine: {request.Cuisine}");
    Console.WriteLine($"Location: {request.Location}");
    Console.WriteLine($"Competitors: {request.Competitors}");
    Console.WriteLine($"Parking: {request.Parking}");
    Console.WriteLine($"Entrance: {request.Entrance}");
    Console.WriteLine($"Average Check: {request.AvgCheck}");
    Console.WriteLine($"Anchor: {request.Anchor}");
    Console.WriteLine($"Notes: {request.Notes}");
    Console.WriteLine($"Timestamp: {request.Timestamp}");
    Console.WriteLine("=============================\n");

    // Retornar string de respuesta
    return $"Análisis completado para {request.Customer} el {request.Timestamp}";
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

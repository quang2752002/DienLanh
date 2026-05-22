using Dms.Application;
using Dms.Infrastructure;
using API.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký cấu hình từ lớp Application và Infrastructure
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Cấu hình CORS cho phép Next.js (http://localhost:3000) kết nối
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Đăng ký Middleware xử lý ngoại lệ toàn cục ở đầu pipeline
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Sử dụng CORS policy trước khi map controllers và authorization
app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();

using System.Net.Http.Json;
using Dms.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Dms.Infrastructure.Services
{
    public class RecaptchaService : IRecaptchaService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public RecaptchaService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<bool> VerifyTokenAsync(string token)
        {
            if (string.IsNullOrEmpty(token)) return false;

            var secretKey = _configuration["Authentication:Recaptcha:SecretKey"];
            var response = await _httpClient.PostAsync($"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={token}", null);

            if (response.IsSuccessStatusCode)
            {
                var recaptchaResult = await response.Content.ReadFromJsonAsync<RecaptchaResponse>();
                return recaptchaResult != null && recaptchaResult.Success;
            }

            return false;
        }

        private class RecaptchaResponse
        {
            public bool Success { get; set; }
        }
    }
}

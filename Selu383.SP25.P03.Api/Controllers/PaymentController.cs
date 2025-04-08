/*
using Microsoft.AspNetCore.Mvc;
using Stripe;
using System;
using System.IO;
using System.Threading.Tasks;
using Events = Stripe.Events;
using EventTypes = Stripe.EventTypes;

namespace Selu383.SP25.P03.Api.Features.PaymentServer.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase{
        private readonly IConfiguration _configuration;
        private readonly string _webhookSecret;

        public PaymentController(IConfiguration configuration){
            _configuration = configuration;
            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
            _webhookSecret = _configuration["Stripe:WebhookSecret"];
        }

        [HttpPost("create-payment-intent")]
        public async Task<ActionResult> CreatePaymentIntent([FromBody] PaymentIntentCreateRequest request){
            try{
                var options = new PaymentIntentCreateOptions{
                    Amount = request.Amount,
                    Currency = request.Currency ?? "usd",
                    PaymentMethodTypes = new List<string> { "card" },
                    Description = request.Description,
                    ReceiptEmail = request.Email,
                    Metadata = request.Metadata
                };
                var service = new PaymentIntentService();
                var paymentIntent = await service.CreateAsync(options);

                return Ok(new{
                    clientSecret = paymentIntent.ClientSecret
                });
            }
            catch(StripeException e){
                return BadRequest(new { error = new { message = e.Message } });
            }
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook(){
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try{
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    _webhookSecret
                );

                // NOTE -- Handling events based on type
                switch(stripeEvent.Type){
                    case EventTypes.PaymentIntentSucceeded:
                        var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                        // NOTE -- Handling a Successful Payment(update order status, send confirmation email, etc)
                        Console.WriteLine($"Payment succeeded for: {paymentIntent.Id}");
                        break;
                    case EventTypes.PaymentIntentPaymentFailed:
                        var failedPaymentIntent = stripeEvent.Data.Object as PaymentIntent;
                        // NOTE -- Handling failed payments
                        Console.WriteLine($"Payment failed for: {failedPaymentIntent.Id}");
                        break;
                    // TODO -- Add other events later
                }
                return Ok();
            }
            catch (StripeException e){
                return BadRequest();
            }
        }
    }

    public class PaymentIntentCreateRequest{
        public long Amount { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public Dictionary<string, string> Metadata { get; set; }
    }
}
*/
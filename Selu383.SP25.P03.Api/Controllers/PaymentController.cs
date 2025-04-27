using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Selu383.SP25.P03.Api.Features.Payment;
using Stripe;
using Stripe.Checkout;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase 
    {
        private readonly StripeSettings _stripeSettings;

        public PaymentController(IOptions<StripeSettings> stripeSettings)
        {
            _stripeSettings = stripeSettings.Value;
        }

        [HttpGet("config")]
        public IActionResult GetConfig(){
            return Ok(new { 
                PublishableKey = _stripeSettings.PublishableKey 
            });
        }

        [HttpPost("createcheckoutsession")]
        public async Task<IActionResult> CreateCheckoutSession()
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = 2000,
                            Currency = "usd", 
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "Tickets",
                            },
                        },
                        Quantity = 2,
                    },
                },
                Mode = "payment",
                SuccessUrl = "http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = "http://localhost:5173/checkout/cancel",
            };

            try
            {
                var service = new SessionService();
                Session session = await service.CreateAsync(options);
                return Ok(new { id = session.Id });
            }
            catch (StripeException e)
            {
                return BadRequest(new { 
                    error = e.Message,
                    redirectUrl = "http://localhost:5173/checkout/decline"  
                    });
            }
        }
    }
}
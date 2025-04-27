namespace Selu383.SP25.P03.Api.Features.Payment{
    public class StripeSettings{
        public required string SecretKey { get; set; }
        public required string PublishableKey{ get; set; }
    }
}

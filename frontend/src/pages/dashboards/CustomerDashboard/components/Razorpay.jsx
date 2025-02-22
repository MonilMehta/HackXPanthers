const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const Razorpay = async (amount, userId, onSuccess) => {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Failed to load Razorpay SDK");
    return;
  }

  const options = {
    key: "rzp_test_DwptmlE6gLwR5G",
    currency: "INR",
    amount: amount * 100,
    name: "Comedy Club Booking",
    description: "Event Ticket Purchase",
    handler: async function (response) {
      const paymentId = response.razorpay_payment_id;

      // Call the success callback with payment ID
      if (onSuccess) {
        onSuccess(paymentId);
      }

      // Send transaction details to backend
      try {
        const result = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            amount,
            paymentId,
          }),
        });

        const data = await result.json();
        if (data.success) {
          alert("Booking confirmed! Check your email for details.");
        } else {
          alert("Booking recorded but confirmation email failed.");
        }
      } catch (error) {
        console.error("Error saving booking:", error);
        alert(
          "Payment successful but booking confirmation failed. Please contact support."
        );
      }
    },
    prefill: {
      name: "Customer",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

export default Razorpay;

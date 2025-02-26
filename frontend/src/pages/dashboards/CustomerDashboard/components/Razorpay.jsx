const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Razorpay = ({
  amount,
  userId,
  eventId,
  seats,
  ticketCount,
  onSuccess,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!res) {
        reject(new Error("Failed to load Razorpay SDK"));
        return;
      }

      const options = {
        key: "rzp_test_DwptmlE6gLwR5G",
        currency: "INR",
        amount: amount * 100,
        name: "Comedy Club",
        description: `Booking ${ticketCount} tickets`,
        handler: async function (response) {
          try {
            const bookingResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({
                userId,
                eventId,
                amount,
                paymentId: response.razorpay_payment_id,
                seats,
                ticketCount,
              }),
            });

            const data = await bookingResponse.json();
            if (data.success) {
              onSuccess(response.razorpay_payment_id);
              resolve({ success: true, paymentId: response.razorpay_payment_id });
            } else {
              reject(new Error("Booking failed"));
            }
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "Customer",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#422AFB",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      reject(error);
    }
  });
};

export default Razorpay;

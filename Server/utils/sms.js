import axios from "axios";

export const sendSMS = async (phone, message) => {
  try {
    const res = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        message: message.replace(/[^\x00-\x7F]/g, ""), 
        language: "english",
        route: "v3", 
        numbers: phone, 
      },
    });

    if (res.data.return) {
      console.log(`📩 SMS sent to ${phone}`);
    } else {
      console.error("⚠️ SMS failed:", res.data);
    }
  } catch (err) {
    console.error("❌ SMS error:", err.response?.data || err.message);
  }
};

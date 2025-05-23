import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString(); // raw body string
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    };

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = whook.verify(payload, headers);
    const { data, type } = evt;

    console.log("🧪 Webhook hit");
    console.log("Headers:", req.headers);
    console.log("Raw body:", req.body?.toString());


    console.log(`🔔 Webhook received: ${type}`);

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address,
          name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
          image: data.image_url,
          resume: ''
        };

         console.log("📩 Creating user with data:", userData);

        if (!userData.email || !userData.name || !userData.image) {
          console.error("❌ Missing required fields:", userData);
          return res.status(400).json({ success: false, message: "Missing user data" });
        }

        try {
    const savedUser = await User.create(userData);
    console.log("✅ User saved to DB:", savedUser);
  } catch (err) {
    console.error("❌ DB Save error:", err.message);
  }

  break;
      }

      case 'user.updated': {
        const updatedData = {
          email: data.email_addresses?.[0]?.email_address,
          name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
          image: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, updatedData);
        console.log("♻️ User updated:", data.id);
        break;
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted:", data.id);
        break;
      }

      default:
        console.warn("⚠️ Unhandled event type:", type);
        break;
    }

    res.json({ success: true });

  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(500).json({ success: false, message: 'Webhook error' });
  }
};

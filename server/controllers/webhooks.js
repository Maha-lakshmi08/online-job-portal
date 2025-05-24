import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString(); // raw body string

       const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);


    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

 
    const evt = whook.verify(payload, headers);
    const { data, type } = req.body;

    console.log("🧪 Webhook hit");
    console.log("Headers:", req.headers);
    console.log("Raw body:", req.body?.toString());

    console.log(`🔔 Webhook received: ${type}`);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name+ " " + data.last_name,
          image: data.image_url,
          resume: '',
        };

       await User.create(userData)
       res.json({})
       break;
      }

      case "user.updated": {
         const userData = {
        
          email: data.email_addresses[0].email_address,
          name: data.first_name+ " " + data.last_name,
          image: data.image_url,
        
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({})
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({})
        break;
      }

      default:
        console.warn("⚠️ Unhandled event type:", type);
        break;
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(500).json({ success: false, message: "Webhook error" });
  }
};

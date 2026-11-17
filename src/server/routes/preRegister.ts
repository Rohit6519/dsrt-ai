import { Router } from "express";
import { randomUUID } from "crypto";
import { supabase } from "../config/supabase";
import { sendPreRegistrationEmail } from "../services/emailService";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { company, contact, ai, access, consent, meta } = req.body;

    // Required field validation
    if (
      !company?.company_name ||
      !contact?.full_name ||
      !contact?.email ||
      !consent?.privacy_consent
    ) {
      return res.status(400).json({
        success: false,
        message: "Required registration fields are missing",
      });
    }

    const email = String(contact.email).trim().toLowerCase();
    const fullName = String(contact.full_name).trim();

    // Generate application reference
    const applicationReference = `DSRT-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`;

    // Save registration in Supabase
    const { error } = await supabase.from("pre_registrations").insert({
      application_reference: applicationReference,
      full_name: fullName,
      email,
      company,
      contact: {
        ...contact,
        email,
      },
      ai,
      access,
      consent,
      meta: meta || {},
    });

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "This email is already registered",
        });
      }

      throw error;
    }

    // Send confirmation email
    let emailSent = false;

    try {
      await sendPreRegistrationEmail(fullName, email);
      emailSent = true;
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: "Registration received successfully",
      application_reference: applicationReference,
      emailSent,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

export default router;

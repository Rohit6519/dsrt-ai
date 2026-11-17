import { Router, Request, Response } from "express";
import { randomBytes } from "crypto";
import { supabase } from "../config/supabase";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      businessEmail,
      organization,
      jobTitle,
      website,
      country,
      engagementObjective,
      requirements,
      monthlyAISpend,
      approximateUsers,
      currentProviders,
      deploymentEnvironment,
      expectedTimeline,
      additionalRequirements,
      privacyConsent,
      org_fax_extension,
    } = req.body;

    // Honeypot protection
    if (org_fax_extension) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission.",
      });
    }

    // Required field validation
    const requiredFields = [
      fullName,
      businessEmail,
      organization,
      jobTitle,
      website,
      country,
      engagementObjective,
      requirements,
    ];

    if (
      requiredFields.some((field) => typeof field !== "string" || !field.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // Email validation
    const email = businessEmail.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid business email.",
      });
    }

    if (privacyConsent !== true) {
      return res.status(400).json({
        success: false,
        message: "Privacy consent is required.",
      });
    }

    const providers = Array.isArray(currentProviders) ? currentProviders : [];

    const enquiryReference = `DSRT-ENT-${Date.now()}-${randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    const { data, error } = await supabase
      .from("enterprise_enquiries")
      .insert({
        enquiry_reference: enquiryReference,
        full_name: fullName.trim(),
        business_email: email,
        organization: organization.trim(),
        job_title: jobTitle.trim(),
        website: website.trim(),
        country: country.trim(),
        engagement_objective: engagementObjective.trim(),
        requirements: requirements.trim(),
        monthly_ai_spend: monthlyAISpend || null,
        approximate_users: approximateUsers || null,
        current_providers: providers,
        deployment_environment: deploymentEnvironment || null,
        expected_timeline: expectedTimeline || null,
        additional_requirements: additionalRequirements || null,
        privacy_consent: true,
      })
      .select("id, enquiry_reference, created_at")
      .single();

    if (error) {
      console.error("Enterprise enquiry database error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to save your enquiry. Please try again.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Enterprise enquiry submitted successfully.",
      enquiry: data,
    });
  } catch (error) {
    console.error("Enterprise enquiry API error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

export default router;

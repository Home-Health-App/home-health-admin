import { z } from "zod/v4"

export const getRegisterSchema = (type: string) => z.object({
  invitation_code: z.string().min(1, "Invitation code is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  address: z.string().min(1, "Address is required"),
  gender: z.enum(["MALE", "FEMALE"]),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  certification: type === "CARE_GIVER"
    ? z.string().min(1, "Certificate file is required")
    : z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
})

export const verifyOtpSchema = z.object({
  email: z.string().min(1),
  code: z.string().length(6, "Code must be exactly 6 digits"),
})

export type RegisterSchemaType = z.infer<ReturnType<typeof getRegisterSchema>>
export type LoginSchemaType = z.infer<typeof loginSchema>
export type VerifyOtpSchemaType = z.infer<typeof verifyOtpSchema>

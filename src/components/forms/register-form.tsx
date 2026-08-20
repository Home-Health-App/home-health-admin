"use client"

import React, { useState, useRef, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/libs/utils"
import {
  IconCamera,
  IconFileText,
  IconUpload,
  IconCheck,
  IconX,
  IconLoader2,
  IconCalendar,
} from "@tabler/icons-react"
import { useRegisterUser } from "@/hooks/auth.hook"
import { useForm } from "@/hooks/use-form"
import { getRegisterSchema, RegisterSchemaType } from "@/schemas/auth.schema"
import { Controller } from "react-hook-form"

export default function RegisterForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const code = searchParams.get("code") || ""
  const type = searchParams.get("type") || "USER" // USER or CARE_GIVER

  const { mutate: register, isPending } = useRegisterUser()

  // Form Zod Schema dynamically adjusted for CARE_GIVER or USER
  const schema = useMemo(() => getRegisterSchema(type), [type])

  // Custom Form Hook
  const {
    register: registerField,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    schema,
    defaultValues: {
      invitation_code: code,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      country: "Nigeria",
      state: "Lagos",
      gender: undefined,
      date_of_birth: "",
      certification: "",
    },
  })

  // Focus states for input styling
  const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>({})

  // Sync invitation code from search parameters (updates dynamically on load)
  React.useEffect(() => {
    if (code) {
      setValue("invitation_code", code, { shouldValidate: true })
    }
  }, [code, setValue])

  // Log validation status in development to help debug any missing fields
  React.useEffect(() => {
    console.log("RegisterForm State:", { isValid, errors })
  }, [isValid, errors])

  const handleFocus = (field: string) => {
    setFocusedFields((prev) => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field: string) => {
    setFocusedFields((prev) => ({ ...prev, [field]: false }))
  }

  const getInputClassName = (field: keyof RegisterSchemaType) => {
    const isFocused = !!focusedFields[field]
    const hasError = !!errors[field]
    return `w-full !h-12 px-3 rounded-[8px] border font-dm-san-regular text-sm focus-visible:ring-0 outline-hidden transition-all placeholder:text-zinc-400 bg-secondary-light ${
      hasError
        ? "border-error text-body-text"
        : isFocused
        ? "border-primary-color text-body-text"
        : "border-zinc-200 text-body-text"
    }`
  }

  // Profile picture state
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Certificate state (Caregiver only)
  const [certificate, setCertificate] = useState<File | null>(null)
  const certInputRef = useRef<HTMLInputElement>(null)

  // Submission views
  const [regStatus, setRegStatus] = useState<"idle" | "success" | "failure">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleProfilePicClick = () => {
    fileInputRef.current?.click()
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePic(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCertClick = () => {
    certInputRef.current?.click()
  }

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCertificate(file)
      setValue("certification", file.name, { shouldValidate: true })
    }
  }

  const handleRemoveCert = () => {
    setCertificate(null)
    setValue("certification", "", { shouldValidate: true })
    if (certInputRef.current) {
      certInputRef.current.value = ""
    }
  }

  const onFormSubmit = handleSubmit((values) => {
    register(values, {
      onSuccess: () => {
        setRegStatus("success")
      },
      onError: (err: any) => {
        setRegStatus("failure")
        setErrorMessage(
          err.response?.data?.message || err.message || "Failed to complete profile registration."
        )
      },
    })
  })

  // Success view
  if (regStatus === "success") {
    return (
      <Card className="w-full bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs font-dm-san-regular flex flex-col items-center text-center space-y-6">
        <div className="size-16 rounded-full bg-[#EEFDF4] flex items-center justify-center text-[#22C55E]">
          <IconCheck className="size-8 stroke-3" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-body-text">
            Profile Completed!
          </CardTitle>
          <p className="text-xs text-zinc-500 font-normal max-w-xs leading-relaxed">
            Your profile has been created successfully. You can now log in to the application and get started.
          </p>
        </div>
         <Button
          type="button"
          onClick={() => router.push("/")}
          className="w-full h-12! rounded-full font-dm-san-regular font-semibold tracking-wide text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
        >
          Go to Login
        </Button>
      </Card>
    )
  }

  // Failure view
  if (regStatus === "failure") {
    return (
      <Card className="w-full bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs font-dm-san-regular flex flex-col items-center text-center space-y-6">
        <div className="size-16 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EF4444]">
          <IconX className="size-8 stroke-3" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-body-text">
            Registration Failed
          </CardTitle>
          <p className="text-xs text-red-500 font-normal max-w-xs leading-relaxed">
            {errorMessage}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setRegStatus("idle")}
          className="w-full h-11! rounded-full font-dm-san-regular font-semibold tracking-wide text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
        >
          Try Again
        </Button>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs font-dm-san-regular">
      
      <CardHeader className="text-center space-y-2 mb-6 p-0">
        <CardTitle className="text-2xl font-bold tracking-tight text-body-text font-dm-san-regular">
          Complete Your Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        {/* Profile Pic Upload */}
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
          <span
            className="text-xs font-semibold text-[#0B1E3F] hover:underline cursor-pointer font-dm-san-regular"
            onClick={handleProfilePicClick}
          >
            Add Profile Picture
          </span>
          <button
            type="button"
            onClick={handleProfilePicClick}
            className="size-16 rounded-full border border-zinc-200 flex items-center justify-center bg-secondary-light hover:bg-zinc-100/50 cursor-pointer overflow-hidden group transition-all"
          >
            {profilePicPreview ? (
              <img src={profilePicPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <IconCamera className="size-6 text-zinc-400 group-hover:text-zinc-500 transition-colors" />
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <form onSubmit={onFormSubmit} className="space-y-6">
          
          {/* Form Fields Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
            
            {/* First Name */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                First Name
              </FieldLabel>
              <Input
                type="text"
                placeholder="First Name"
                {...registerField("first_name")}
                onFocus={() => handleFocus("first_name")}
                onBlur={() => handleBlur("first_name")}
                className={getInputClassName("first_name")}
              />
              <FieldError errors={[errors.first_name]} />
            </Field>

            {/* Last Name */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Last Name
              </FieldLabel>
              <Input
                type="text"
                placeholder="Last Name"
                {...registerField("last_name")}
                onFocus={() => handleFocus("last_name")}
                onBlur={() => handleBlur("last_name")}
                className={getInputClassName("last_name")}
              />
              <FieldError errors={[errors.last_name]} />
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Email
              </FieldLabel>
              <Input
                type="email"
                placeholder="Email Address"
                {...registerField("email")}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                className={getInputClassName("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            {/* Phone Number */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Phone Number
              </FieldLabel>
              <Input
                type="tel"
                placeholder="Phone Number"
                {...registerField("phone")}
                onFocus={() => handleFocus("phone")}
                onBlur={() => handleBlur("phone")}
                className={getInputClassName("phone")}
              />
              <FieldError errors={[errors.phone]} />
            </Field>

            {/* Address */}
            <Field className="sm:col-span-2">
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Address
              </FieldLabel>
              <Input
                type="text"
                placeholder="Address"
                {...registerField("address")}
                onFocus={() => handleFocus("address")}
                onBlur={() => handleBlur("address")}
                className={getInputClassName("address")}
              />
              <FieldError errors={[errors.address]} />
            </Field>

            {/* Country */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Country
              </FieldLabel>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={cn("w-full !h-12 px-3 py-2 rounded-[8px] border bg-secondary-light font-dm-san-regular text-sm text-body-text focus:ring-0 focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden shadow-none", errors.country ? "border-error" : "border-zinc-200")}>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="font-dm-san-regular font-normal text-sm" value="Nigeria">Nigeria</SelectItem>
                      <SelectItem className="font-dm-san-regular font-normal text-sm" value="Ghana">Ghana</SelectItem>
                      <SelectItem className="font-dm-san-regular font-normal text-sm" value="Kenya">Kenya</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.country]} />
            </Field>

            {/* State */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-body-text font-dm-san-regular block">
                State
              </FieldLabel>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={cn("w-full px-3 !h-12 rounded-[8px] border bg-secondary-light font-dm-san-regular text-sm text-body-text focus:ring-0 focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden shadow-none", errors.state ? "border-error" : "border-zinc-200")}>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="font-dm-san-regular font-normal text-sm" value="Lagos">Lagos</SelectItem>
                      <SelectItem className="font-dm-san-regular font-normal text-sm" value="Abuja">Abuja</SelectItem>
                      <SelectItem className="font-dm-san-regular font-normal text-sm" value="Oyo">Oyo</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.state]} />
            </Field>

            {/* Gender */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Gender
              </FieldLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger size="default" className={cn("w-full !h-12 px-3 py-3 rounded-[8px] border bg-secondary-light font-dm-san-regular text-sm text-body-text focus:ring-0 focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden shadow-none", errors.gender ? "border-error" : "border-zinc-200")}>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="font-dm-san-regular font-normal text-sm" value="MALE">Male</SelectItem>
                      <SelectItem className="font-dm-san-regular font-normal text-sm" value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.gender]} />
            </Field>

            {/* Date of Birth (DatePicker using Calendar & Popover) */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Date of Birth
              </FieldLabel>
              <Controller
                name="date_of_birth"
                control={control}
                render={({ field }) => {
                  const selectedDate = field.value ? new Date(field.value) : undefined
                  return (
                    <Popover>
                      <PopoverTrigger
                        className={cn(
                          "w-full !h-12 px-3 rounded-[8px] border text-left font-normal bg-secondary-light flex items-center justify-between text-body-text shadow-none hover:bg-secondary-light font-dm-san-regular text-sm cursor-pointer focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden",
                          errors.date_of_birth ? "border-error" : "border-zinc-200"
                        )}
                      >
                        <span>
                          {field.value
                            ? new Date(field.value).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Pick a date"}
                        </span>
                        <IconCalendar className="size-4 text-zinc-500" />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50 bg-white border border-zinc-200 shadow-lg rounded-lg" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={selectedDate}
                          startMonth={new Date(1930, 0)}
                          endMonth={new Date()}
                          onSelect={(date) => {
                            if (date) {
                              const year = date.getFullYear()
                              const month = String(date.getMonth() + 1).padStart(2, "0")
                              const day = String(date.getDate()).padStart(2, "0")
                              field.onChange(`${year}-${month}-${day}`)
                            } else {
                              field.onChange("")
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )
                }}
              />
              <FieldError errors={[errors.date_of_birth]} />
            </Field>

          </div>

          {/* Certificate Section (Caregiver only) */}
          {type === "CARE_GIVER" && (
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <Field>
                <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                  Certificate
                </FieldLabel>
                
                {certificate ? (
                  /* File detail card */
                  <div className="flex items-center justify-between border border-zinc-200 rounded-[8px] p-4 bg-secondary-light shadow-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-100 rounded-lg">
                        <IconFileText className="size-5 text-zinc-500" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-body-text block">
                          {certificate.name}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCertClick}
                      className="flex items-center gap-1 hover:opacity-75 transition-opacity text-xs font-semibold text-body-text cursor-pointer outline-hidden"
                    >
                      <span>Change</span>
                      <IconX className="size-3 text-zinc-500 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleRemoveCert(); }} />
                    </button>
                  </div>
                ) : (
                  /* Dashed upload box */
                  <div
                    onClick={handleCertClick}
                    className={cn(
                      "flex flex-col items-center justify-center border-2 border-dashed rounded-[8px] p-6 bg-[#648FCC]/5 cursor-pointer hover:bg-[#648FCC]/10 transition-colors text-center font-dm-san-regular",
                      errors.certification ? "border-red-500 bg-red-50/10" : "border-[#648FCC]"
                    )}
                  >
                    <IconUpload className={cn("size-6 mb-2", errors.certification ? "text-red-500" : "text-[#648FCC]")} />
                    <span className={cn("font-bold text-sm block", errors.certification ? "text-red-500" : "text-[#0B1E3F]")}>
                      + Upload Your Certificate
                    </span>
                    <span className="text-xs text-zinc-500 font-normal mt-1 block">
                      This should mention the file types accepted (PDF, JPG, PNG)
                    </span>
                  </div>
                )}
                <FieldError errors={[errors.certification]} />

                <input
                  type="file"
                  ref={certInputRef}
                  onChange={handleCertChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </Field>
            </div>
          )}

          {/* Complete Profile Button */}
          <Button
            type="submit"
            disabled={!isValid || isPending}
            className={`w-full h-12! rounded-full font-dm-san-regular font-semibold tracking-wide text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center gap-2 ${
              isValid && !isPending
                ? "bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
                : "bg-primary-light text-body-text pointer-events-none"
            }`}
          >
            {isPending ? (
              <>
                <IconLoader2 className="size-4 animate-spin" />
                <span>Completing Profile...</span>
              </>
            ) : (
              <span>Complete Profile</span>
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}
